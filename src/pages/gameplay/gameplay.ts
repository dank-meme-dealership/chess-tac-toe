import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Game } from '../home/play-game-modal';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subject } from "rxjs/Subject";
import { BotProvider } from '../../providers/bot/bot';

import _ from "lodash";
import { HomePage } from '../home/home';
import { GameOverModalPage } from '../game-over-modal/game-over-modal';

const moment = require("moment");

@IonicPage()
@Component({
  selector: 'page-gameplay',
  templateUrl: 'gameplay.html',
})
export class GameplayPage {
  // game firebase magic
  private playerDoc: AngularFirestoreDocument<any>;
  private gameDoc: AngularFirestoreDocument<Game>;
  game: any; //Observable<Game>
  private ngUnsubscribe: Subject<void> = new Subject();
  private player: any;
  private enemy: any;
  private gameOver: boolean;
  private message: string;
  chatShown = false;
  yourTurn = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public botProvider: BotProvider, private afs: AngularFirestore, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    // reset game over boolean
    this.gameOver = false;

    let gameId = this.navParams.get('gameId');
    let playerId = this.navParams.get('playerId');
    // if you got here without a gameId, you're a magician, leave
    if (!gameId) {
      this.exit();
    }
    // carry on
    else {
      // connect to the player so we can update them later
      this.playerDoc = this.afs.doc<Game>('users/' + playerId);

      // listen to changes in the game
      this.gameDoc = this.afs.doc<Game>('games/' + gameId);
      this.gameDoc.valueChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(game => {
          this.game = game;

          // set up the player and enemy if it hasn't yet
          if (!this.player) {
            this.player = this.getPlayer(game, playerId);
            this.enemy = this.getEnemy(game, playerId);
          }

          // determine whose turn it is
          this.yourTurn = game.turns.length % 2 === (this.player.color === 'white' ? 0 : 1);

          // check if a winner was set by the board
          if (game.winner && !this.gameOver) {
            this.gameOver = true;
            this.showGameOverModal(this.enemy.name, game.winner === this.player.id);
          }
        });
    }
  }

  getPlayer(game: any, playerId: string) {
    return _.find(game.players, { 'id': playerId });
  }

  getEnemy(game: any, playerId: string) {
    return _.find(game.players, function (player) {
      return player.id != playerId;
    });
  }

  exit() {
    // if the game isn't over and you leave,
    // the other player wins automatically
    if (!this.gameOver) {
      this.gameDoc.update({ winner: this.enemy.id });
    }

    this.gameOver = true;
    this.navCtrl.push(HomePage);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showGameOverModal(name: string, didWin: boolean) {
    // if this player won, update their wins on their user document
    if (didWin) {
      this.playerDoc.valueChanges().take(1).subscribe(user => {
        let wins = (user.wins || 0) + 1;
        this.playerDoc.update({ wins: wins });
      });
    }

    // show the game over modal
    this.modalCtrl.create(GameOverModalPage, { name: name, didWin: didWin, player: this.player }, { cssClass: 'game-over-modal' }).present();
  }

  addMessage() {
    if (this.game.messages === undefined) this.game.messages = [];
    if (this.message !== '') this.game.messages.push({ player: this.player.name || 'Anonymous', message: this.message, timestamp: moment().unix() });
    this.gameDoc.update({ messages: this.game.messages });
    this.message = '';
  }

  toggleChatShown() {
    this.chatShown = !this.chatShown;
  }
}
