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
  private gameDoc: AngularFirestoreDocument<Game>;
  game: any; //Observable<Game>
  private ngUnsubscribe: Subject<void> = new Subject();
  gameId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore, private afDB: AngularFireDatabase, public botProvider: BotProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GameplayPage');
    this.gameId = this.navParams.get('gameId');
    
    if (this.gameId) {
      if(this.gameId.includes('bots')) {
        while(true) {
          this.botProvider.makeMove({})
          this.sleep(500);
        }
      }
      this.gameDoc = this.afs.doc<Game>('games/' + this.gameId);
      this.game = this.gameDoc.valueChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(game => {
          console.log(game);
        });
    }
    else { 
      this.exit();      
    }
  }

  exit() {
    this.navCtrl.pop();
  }

  sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
