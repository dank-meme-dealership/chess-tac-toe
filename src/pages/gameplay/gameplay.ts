import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {Game} from '../home/play-game-modal';
import {AngularFirestoreDocument, AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {Subject} from "rxjs/Subject";
import { BotProvider } from '../../providers/bot/bot';

import _ from "lodash";
import { GameOverModalPage } from '../game-over-modal/game-over-modal';

@IonicPage()
@Component({
  selector: 'page-gameplay',
  templateUrl: 'gameplay.html',
})
export class GameplayPage {
  // game firebase magic
  private gameDoc: AngularFirestoreDocument<Game>;
  game: any; //Observable<Game>
  private ngUnsubscribe: Subject<void> = new Subject();
  private player: any;
  private enemy: any;
  private modalLaunched: boolean;

  whiteName: string;
  whitesTurn: boolean;
  blackName: string;
  blacksTurn: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public botProvider: BotProvider, private afs: AngularFirestore, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    // reset modal launched boolean
    this.modalLaunched = false;

    let gameId = this.navParams.get('gameId');
    let playerId = this.navParams.get('playerId');
    // if you got here without a gameId, you're a magician, leave
    if (!gameId) {
      this.exit();
    }
    // carry on
    else {
      // bot stuff
      if(gameId.includes('bots')) {
        while(true) {
          this.botProvider.makeMove({})
          this.sleep(500);
        }
      }

      // listen to changes in the game
      this.gameDoc = this.afs.doc<Game>('games/' + gameId);
      this.game = this.gameDoc.valueChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(game => {
          if (!this.player) {
            this.player = this.getPlayer(game, playerId);
            this.enemy = this.getEnemy(game, playerId);
            if (game.players.length > 0) {
              this.whiteName = game.players[0].name || 'Anonymous';
              if (this.player.color === 'white') {
                this.whiteName += ' (You)';
              }
            }
            if (game.players.length > 1) {
              this.blackName = game.players[1].name || 'Anonymous';
              if (this.player.color === 'black') {
                this.blackName += ' (You)';
              }
            }
          }
          this.whitesTurn = game.turns.length % 2 === 0;
          this.blacksTurn = !this.whitesTurn;

          // check if a winner was set by the board
          if (game.winner && !this.modalLaunched) {
            this.modalLaunched = true;
            if (game.winner === this.player.id) {
              this.gameOver(this.enemy.name, true);
            }
            else {
              this.gameOver(this.enemy.name, false);
            }
          }
        });
    }
  }

  getPlayer(game: any, playerId: string) {
    return _.find(game.players, {'id': playerId});
  }

  getEnemy(game: any, playerId: string) {
    return _.find(game.players, function(player) {
      return player.id != playerId;
    });
  }

  exit() {
    // if you leave, the other player wins automatically
    this.modalLaunched = true; // short-circuit modal
    this.gameDoc.update({winner: this.enemy.id});
    this.navCtrl.pop();
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  isMyTurn() {
    if(this.player){
      return (this.player.color === 'white' && this.whitesTurn) || (this.player.color === 'black' && this.blacksTurn)
    }
    return false;
  }

  gameOver(name: string, didWin: boolean) {
    let modal = this.modalCtrl.create(GameOverModalPage, {name: name, didWin: didWin, player: this.player}, {cssClass: 'game-over-modal'});
    modal.present();
  }
}
