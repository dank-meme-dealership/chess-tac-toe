import {Component} from "@angular/core";
import {AngularFirestoreCollection, AngularFirestore} from "angularfire2/firestore";
import {User} from "./home";
import {Observable} from "rxjs/Observable";
import {NavController, NavParams, ViewController} from "ionic-angular";
import {GameplayPage} from "../gameplay/gameplay";
import {Move} from "../../providers/chess/chess";
import {QueuePage} from "../queue/queue";

const moment = require('moment');

export interface Game {
  players: any[];
  turns: any[];
  outcomes?: any;
  queueTimestamp: number;
  startedTimestamp?: number;
  privateGame: boolean;
  boardState?: any;
}

@Component({
  selector: 'play-game-modal',
  template: `
    <ion-content>
      <div class="button-container">
        <button class="chess-button" ion-button (click)="goToGameplay('matchmaking')">Matchmaking</button>
        <div text-center>Play against a random opponent</div>

        <button margin-top class="chess-button" ion-button (click)="goToGameplay('private')">Private</button>
        <div text-center>Create a private game and invite a friend</div>
        
        <button margin-top class="chess-button" ion-button (click)="goToGameplay('bots')">Bot vs. Bot</button>
        <div text-center>Watch two bots battle it out!</div>
      </div>
    </ion-content>
  `
})
export class PlayGameModal {
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController, private afs: AngularFirestore) {
    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
  }

  goToGameplay(type: string) {
    let name = this.params.get('name');
    let uid = localStorage.getItem('uid');
    if(type === 'bots') {
      this.navCtrl.push(GameplayPage, {gameId: 'bots' + new Date().getMilliseconds});
      this.viewCtrl.dismiss();
    }
    else if (uid) {
      this.joinQueue({name: name, id: uid}, type);
    }
    else {
      this.addUser(name).then(function (uid) {
        localStorage.setItem('uid', uid);
        this.joinQueue({name: name, id: uid}, type);
      }.bind(this));
    }
  }

  addUser(name: string) {
    return this.usersCollection.add({name: name, timestamp: moment().unix()}).then(function (response) {
      return response.id;
    });
  }

  joinQueue(player: any, type: string) {
    this.navCtrl.push(QueuePage, {player: player, type: type});
    this.viewCtrl.dismiss();
  }
}
