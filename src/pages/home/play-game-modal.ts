import {Component} from "@angular/core";
import {AngularFirestoreCollection, AngularFirestore} from "angularfire2/firestore";
import {User} from "./home";
import {Observable} from "rxjs/Observable";
import {NavController, NavParams, ViewController} from "ionic-angular";
import {GameplayPage} from "../gameplay/gameplay";
import {Move} from "../../providers/chess/chess";

const moment = require('moment');

export interface Game {
  players: any[];
  turns: Move[];
  outcomes?: any;
  queueTimestamp: number;
  startedTimestamp?: number;
  privateGame: boolean;
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
    if (uid) {
      this.joinQueue(name, uid, type);
    }
    else {
      this.addUser(name).then(function (uid) {
        localStorage.setItem('uid', uid);
        this.joinQueue(name, uid, type);
      }.bind(this));
    }
  }

  addUser(name: string) {
    return this.usersCollection.add({name: name, timestamp: moment().unix()}).then(function (response) {
      return response.id;
    });
  }

  joinQueue(name: string, uid: string, type: string) {
    let games = this.afs.collection<Game>('games');
    let game = {
      players: [{name: name, uid: uid}],
      turns: [],
      queueTimestamp: moment().unix(),
      privateGame: type === 'private',
    };
    console.log(game);
    games.add(game).then(response => {
      console.log(response);

      // nav to this game
      this.navCtrl.push(GameplayPage);
      this.viewCtrl.dismiss();
    });
  }
}
