import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Game} from '../home/play-game-modal';
import {AngularFirestoreDocument, AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {Subject} from "rxjs/Subject";
import { BotProvider } from '../../providers/bot/bot';

@IonicPage()
@Component({
  selector: 'page-gameplay',
  templateUrl: 'gameplay.html',
})
export class GameplayPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameplayPage');
    let gameId = this.navParams.get('gameId');
    if (!gameId) {
      this.exit();
    }

    if (gameId) {
      if(gameId.includes('bots')) {
        while(true) {
          this.botProvider.makeMove({})
          this.sleep(500);
        }
      }
    }
  }

  exit() {
    this.navCtrl.pop();
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
