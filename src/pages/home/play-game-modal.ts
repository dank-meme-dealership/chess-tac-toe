import { Component } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { User } from "./home";
import { Observable } from "rxjs/Observable";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { GameplayPage } from "../gameplay/gameplay";
import { Move } from "../../providers/chess/chess";
import { QueuePage } from "../queue/queue";
import { BotProvider } from "../../providers/bot/bot";

const moment = require('moment');

export interface Game {
  players: any[];
  turns: any[];
  messages?: any[];
  outcomes?: any;
  timestamp: number;
  lastMove: any;

  privateGame: boolean;
  boardState?: any;
  winner?: string;
}

@Component({
  selector: 'play-game-modal',
  template: `
    <ion-content>
      <div class="button-container">
        <button class="chess-button" ion-button (click)="goToGameplay('matchmaking')" [disabled]="buttonClicked">Matchmaking</button>
        <div text-center>Play against a random opponent</div>

        <button margin-top class="chess-button" ion-button (click)="goToGameplay('private')" disabled>Private
        </button>
        <div text-center>Create a private game and invite a friend</div>
      </div>
    </ion-content>
  `
})
export class PlayGameModal {
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  private buttonClicked: boolean;

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController, private afs: AngularFirestore, private botProvider: BotProvider) {
    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
    this.buttonClicked = false;
  }

  goToGameplay(type: string) {
    // set buttonClicked to true so the html can key off 
    // of this and disable any subsequent button clicks
    this.buttonClicked = true;

    let name = this.params.get('name');
    let uid = localStorage.getItem('uid');
    if (uid) {
      this.joinQueue({ name: name, id: uid }, type);
    }
    else {
      this.addUser(name).then(function (uid) {
        localStorage.setItem('uid', uid);
        this.joinQueue({ name: name, id: uid }, type);
      }.bind(this));
    }
  }

  addUser(name: string) {
    return this.usersCollection.add({ name: name, timestamp: moment().unix() }).then(function (response) {
      return response.id;
    });
  }

  joinQueue(player: any, type: string) {
    this.navCtrl.push(QueuePage, { player: player, type: type });
    this.viewCtrl.dismiss();
  }
}
