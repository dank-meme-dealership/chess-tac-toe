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
            if (game.players.length > 0) {
              this.whiteName = game.players[0].name;
            }
            if (game.players.length > 1) {
              this.blackName = game.players[1].name;
            }
          }
          this.whitesTurn = game.turns.length % 2 === 0;
          this.blacksTurn = !this.whitesTurn;
        });
    }
  }

  getPlayer(game: any, playerId: string) {
    return _.find(game.players, {'id': playerId});
  }

  exit() {
    this.navCtrl.pop();
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
