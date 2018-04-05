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
  // game firebase magic
  private gameDoc: AngularFirestoreDocument<Game>;
  game: any; //Observable<Game>
  private ngUnsubscribe: Subject<void> = new Subject();
  private thisPlayer: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public botProvider: BotProvider, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    let gameId = this.navParams.get('gameId');
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
          if (!this.thisPlayer) {
            this.thisPlayer = this.getPlayer(game);
          }
        });
    }
  }

  getPlayer(game: any) {
    console.log(game);
    return null;
  }

  exit() {
    this.navCtrl.pop();
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
