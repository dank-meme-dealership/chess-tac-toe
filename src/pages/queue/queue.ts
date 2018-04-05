import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Game} from "../home/play-game-modal";
import {GameplayPage} from "../gameplay/gameplay";
import {AngularFirestore} from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';

const moment = require("moment");

@IonicPage()
@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html',
})
export class QueuePage {
  private gameCollection;
  private queueCollection;
  private queue;
  private ngUnsubscribe: Subject<void> = new Subject();
  private busy;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    // ensure this class doesn't think we're busy
    this.busy = false;
    let player = this.navParams.data.player;

    // private games just start and are handled in the gameplay page
    if (this.navParams.data.type === 'private') {
      this.createGame([player], true).then(game => {
        // nav to this game, nothing to delete
        this.joinGame(game.id, null);
      });;
    }
    // matchmaking games join a queue
    else {
      // sort the collection ascending by queueTimestamp
      this.queueCollection = this.afs.collection<any>('queue', 
        ref => ref.orderBy('queueTimestamp', 'asc')
      );

      // add this player to the queue
      this.queueCollection.add({
        player: player,
        queueTimestamp: moment().unix(),
      });

      // listen for changes to the list and determine queue position
      this.queue = this.queueCollection.snapshotChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(queue => {
          this.determineQueuePosition(queue, player);
        });
    }
  }

  determineQueuePosition(queue: any, player: any) {
    if (this.busy) return;

    // remove queue items that are already done
    queue = queue.filter(queueEntry => queueEntry.payload.doc.data().done !== true);
    let queueGame = this.getQueueGame(queue, player);

    // if this queued user needs to join a game, do it!
    if (queueGame) {
      this.busy = true;
      this.joinGame(queueGame.gameId, queueGame.queueId);
    }
    
    // if gameId returned as null, it means you haven't been invited to a game yet
    else {
      // filter the queue down to just people without games to join
      let filtered = queue.filter(queueEntry => queueEntry.gameId === undefined);

      // if there is a queue length > 1, figure out if you need to do anything
      if (filtered.length > 1) {
        let firstInQueue = filtered[0].payload.doc.data();

        // only the first player in the queue will do game creation
        if (firstInQueue.player.id === player.id) {
          this.busy = true;
          let players = [];
          players.push(filtered[0].payload.doc.data().player);
          players.push(filtered[1].payload.doc.data().player);

          players[0].color = 'white'
          players[1].color = 'black'

          this.createGame(players, false).then(game => {
            // put the gameId on both players
            this.afs.doc<any>('queue/' + filtered[0].payload.doc.id).update({gameId: game.id});
            this.afs.doc<any>('queue/' + filtered[1].payload.doc.id).update({gameId: game.id});
          });

          this.busy = false;
        }
      }
    }
  }

  getQueueGame(queue: any, player: any) {
    for (let entry of queue) {
      let queuedEntry = entry.payload.doc.data();
      if (queuedEntry.player.id === player.id && queuedEntry.gameId) {
        return {
          gameId: queuedEntry.gameId,
          queueId: entry.payload.doc.id
        };
      }
    }
    return null;
  }

  createGame(players: any[], privateGame: boolean) {
    return this.afs.collection<Game>('games')
      .add({
        players: players,
        turns: [],
        queueTimestamp: moment().unix(),
        privateGame: privateGame,
        boardState: JSON.stringify([
          ['wr', 'wpd', 'wk', 'wb'],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['', '', '', ''],
          ['br', 'bpu', 'bk', 'bb'],
        ])
      });
  }

  joinGame(gameId: string, queueToDelete: string) {
    // if this game is being joined by a player from the queue,
    // that user's queueId needs to be removed
    if (queueToDelete) {
      this.afs.doc<any>('queue/' + queueToDelete).update({done: true});
    }

    this.navCtrl.pop(); // remove queue from history stack
    this.navCtrl.push(GameplayPage, {gameId: gameId});
  }
}
