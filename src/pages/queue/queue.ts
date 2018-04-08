import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Game } from "../home/play-game-modal";
import { GameplayPage } from "../gameplay/gameplay";
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import {HomePage} from "../home/home";

const moment = require("moment");

@IonicPage()
@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html',
})
export class QueuePage {
  private timeoutPeriod = 10;

  private queueCollection;
  private myQueuePosition;
  private ngUnsubscribe: Subject<void> = new Subject();
  private busy;
  private timeout;

  private updateStarted: boolean;
  private stopUpdate: boolean;

  queueId: string;
  queueMessage: string;
  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    // ensure this class doesn't think we're busy
    this.busy = false;
    this.updateStarted = false;
    this.stopUpdate = false;
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
        lastUpdated: moment().unix()
      }).then(function (queueItem) {
        this.queueId = queueItem.id;
        this.myQueuePosition = this.afs.doc('queue/' + this.queueId);
        
        // if we haven't started setting our lastUpdated timestamp, do it
        if (!this.updateStarted) {
          this.setLastUpdated(3);
        }
      }.bind(this));

      // listen for changes to the list and determine queue position
      this.queueCollection.snapshotChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(queue => {
          this.checkTheQueue(queue, player);
        });
    }
  }

  // start a timeout to update the queue with a new timestamp every 3
  // seconds so the other members in the queue know you're still here
  setLastUpdated(seconds: number) {
    this.updateStarted = true;
    if (!this.stopUpdate) {
      setTimeout(() => {
        this.myQueuePosition.update({ lastUpdated: moment().unix() }).catch(this.doNothing);
        this.setLastUpdated(seconds);
      }, seconds * 1000);
    }
  }
 
  checkTheQueue(queue: any, player: any) {
    if (this.busy) return;

    // if this queued user needs to join a game, do it!
    let queueGame = this.getQueueGame(queue, player);
    if (queueGame) {
      this.busy = true;
      this.joinGame(queueGame.gameId, player.id, queueGame.queueId);
    }

    // if queueGame returned as null, it means you haven't been invited to a game yet
    else {
      // filter the queue down to just people without games to join
      let filtered = queue.filter(queueEntry => queueEntry.gameId === undefined);

      // update the queue position message 
      let queuePosition = this.getQueuePosition(filtered, player);
      this.queueMessage = 'You are in position ' + (queuePosition + 1) + ' out of ' + queue.length;
      
      // check if the person in front of you in the queue is gone and boot them if so
      if (queuePosition > 0) {
        let nextPosition = filtered[queuePosition - 1].payload.doc.data();
        if (moment().unix() - nextPosition.lastUpdated > this.timeoutPeriod) {
          this.afs.doc<any>('queue/' + filtered[queuePosition - 1].payload.doc.id).delete().catch(this.doNothing);
        }
      }

      // only the first player in the queue will do game creation
      if (queuePosition === 0 && filtered.length > 1) {
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
          }, 500)
        });

        this.busy = false;
      }
    }
  }

  getQueuePosition(queue: any, player: any) {
    let position = queue.length - 1;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].payload.doc.id === this.queueId) {
        return i;
      }
    }
    return position;
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
    this.stopUpdate = true;

    // if this game is being joined by a player from the queue,
    // that user's queueId needs to be removed
    if (queueToDelete) {
      this.afs.doc<any>('queue/' + queueToDelete).delete().catch(this.doNothing);
    }

    setTimeout(() => {
      this.navCtrl.push(GameplayPage, { gameId: gameId, playerId: playerId });
    }, 500)
  }

  exit() {
    this.ngUnsubscribe.next();
    this.afs.doc<any>('queue/' + this.queueId).delete().catch(this.doNothing);
    this.navCtrl.push(HomePage);
  }

  doNothing() {
    // do nothing with the error message
  }
}
