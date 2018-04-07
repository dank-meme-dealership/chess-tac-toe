import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Game } from "../home/play-game-modal";
import { GameplayPage } from "../gameplay/gameplay";
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import _ from 'lodash';
import {HomePage} from "../home/home";

const moment = require("moment");

@IonicPage()
@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html',
})
export class QueuePage {
  private queueCollection;
  private queue;
  private ngUnsubscribe: Subject<void> = new Subject();
  private busy;

  queueId: string;
  queueMessage: string;
  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    // ensure this class doesn't think we're busy
    this.busy = false;
    let player = this.navParams.data.player;

    // bot stuff
    if(this.navParams.data.type === 'bots') {
      this.message = 'bots are being created...';
        this.createGame([{name: 'bot1', id: 'bot1'},{name: 'bot2', id: 'bot2'}], false).then(game => {
          // nav to this game, nothing to delete
          this.joinGame(game.id, 'bot1', null);
          this.joinGame(game.id, 'bot2', null);
        });
    }

    // private games just start and are handled in the gameplay page
    else if (this.navParams.data.type === 'private') {
      this.message = 'Creating game...';
      this.createGame([player], true).then(game => {
        // nav to this game, nothing to delete
        this.joinGame(game.id, player.id, null);
      });
    }

    // matchmaking games join a queue
    else {
      this.message = 'Waiting for opponent...';
      // sort the collection ascending by timestamp
      this.queueCollection = this.afs.collection<any>('queue',
        ref => ref.orderBy('timestamp', 'asc')
      );

      // add this player to the queue
      this.queueCollection.add({
        player: player,
        timestamp: moment().unix(),
      }).then(function (queueItem) {
        this.queueId = queueItem.id;
      }.bind(this));

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
      this.joinGame(queueGame.gameId, player.id, queueGame.queueId);
    }

    // if gameId returned as null, it means you haven't been invited to a game yet
    else {
      // filter the queue down to just people without games to join
      let filtered = queue.filter(queueEntry => queueEntry.gameId === undefined);

      this.queueMessage = this.getQueueMessage(filtered, player);

      // if there is a queue length > 1, figure out if you need to do anything
      if (filtered.length > 1) {
        let firstInQueue = filtered[0].payload.doc.data();

        // only the first player in the queue will do game creation
        if (firstInQueue.player.id === player.id) {
          this.message = 'Creating game...';
          this.busy = true;
          let players = [];
          players.push(filtered[0].payload.doc.data().player);
          players.push(filtered[1].payload.doc.data().player);

          players[0].color = 'white';
          players[1].color = 'black';

          this.createGame(players, false).then(game => {
            // put the gameId on both players
            setTimeout(() => {
              this.afs.doc<any>('queue/' + filtered[0].payload.doc.id).update({ gameId: game.id });
              this.afs.doc<any>('queue/' + filtered[1].payload.doc.id).update({ gameId: game.id });
            }, 1000)
          });

          this.busy = false;
        }
      }
    }
  }

  getQueueMessage(queue: any, player: any) {
    let position = queue.length;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].payload.doc.data().player.id === player.id) {
        return 'You are in position ' + (i + 1) + ' out of ' + queue.length;
      }
    }
    return 'You are in position ' + position + ' out of ' + queue.length;
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
        messages: [],
        timestamp: moment().unix(),
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

  joinGame(gameId: string, playerId: string, queueToDelete: string) {
    this.message = 'Game starting...';

    // if this game is being joined by a player from the queue,
    // that user's queueId needs to be removed
    if (queueToDelete) {
      this.afs.doc<any>('queue/' + queueToDelete).delete().catch(this.catchError);
    }

    setTimeout(() => {
      this.navCtrl.push(GameplayPage, { gameId: gameId, playerId: playerId });
    }, 1000)
  }

  exit() {
    this.ngUnsubscribe.next();
    this.afs.doc<any>('queue/' + this.queueId).delete().catch(this.catchError);
    this.navCtrl.push(HomePage);
  }

  catchError() {
    // do nothing
  }
}
