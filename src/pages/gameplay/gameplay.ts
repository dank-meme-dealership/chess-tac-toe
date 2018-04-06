import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Game} from '../home/play-game-modal';
import {AngularFirestoreDocument, AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {Subject} from "rxjs/Subject";
import { BotProvider } from '../../providers/bot/bot';

import _ from "lodash";

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

  whiteName: string;
  whitesTurn: boolean;
  blackName: string;
  blacksTurn: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public botProvider: BotProvider, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    let gameId = this.navParams.get('gameId');
    let playerId = this.navParams.get('playerId');
    // if you got here without a gameId, you're a magician, leave
    if (!gameId) {
      this.exit();
    }
    // carry on
    else {
      // listen to changes in the game
      this.gameDoc = this.afs.doc<Game>('games/' + gameId);
      this.game = this.gameDoc.valueChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(game => {
          if (!this.player) {
            this.player = this.getPlayer(game, playerId);
            this.enemy = this.getEnemy(game, playerId);
            if (game.players.length > 0) {
              this.whiteName = game.players[0].name;
              if (this.player.color === 'white') {
                this.whiteName += ' (You)';
              }
            }
            if (game.players.length > 1) {
              this.blackName = game.players[1].name;
              if (this.player.color === 'black') {
                this.blackName += ' (You)';
              }
            }
          }
          this.whitesTurn = game.turns.length % 2 === 0;
          this.blacksTurn = !this.whitesTurn;

          // check if a winner was set by the board
          if (game.winner) {
            console.log(game.winner === this.player.id ? 'You won!' : 'You lost!');
          }

          // bot stuff
          if(playerId==='bot1'|| playerId === 'bot2') {
            let color = game.players[0].name === playerId ? 'white' : 'black';
            this.botProvider.makeMove({board: game.boardState, color: color})
            this.sleep(500);
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
    this.gameDoc.update({winner: this.enemy.id});
    this.navCtrl.pop();
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  isMyTurn(){
    if(this.player){
      return (this.player.color === 'white' && this.whitesTurn) || (this.player.color === 'black' && this.blacksTurn)
    }
    return false;
  }
}
