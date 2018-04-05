import {Component} from "@angular/core";
import {AngularFirestoreCollection, AngularFirestore} from "angularfire2/firestore";
import {User} from "./home";
import {Observable} from "rxjs/Observable";
import {NavController, NavParams, ViewController} from "ionic-angular";
import {GameplayPage} from "../gameplay/gameplay";

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
    let uid = localStorage.getItem('uid');
    if (uid) {
      this.joinQueue(uid, type);
    }
    else {
      this.addUser(this.params.get('name')).then(function (uid) {
        localStorage.setItem('uid', uid);
        this.joinQueue(uid, type);
      }.bind(this));
    }
  }

  addUser(name: string) {
    return this.usersCollection.add({name: name}).then(function (response) {
      return response.id;
    });
  }

  joinQueue(uid: string, type: string) {
    // TODO: Add uid to the queue of the right type
    this.navCtrl.push(GameplayPage);
    this.viewCtrl.dismiss();
  }
}
