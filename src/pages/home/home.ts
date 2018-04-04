'use strict'

import {Component} from '@angular/core';
import {Modal, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';

import {GameplayPage} from '../gameplay/gameplay'
import "rxjs/add/operator/take";

export interface User {
  name: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private userDoc: AngularFirestoreDocument<User>;
  user: Observable<User>;
  modal: Modal;
  name: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private afs: AngularFirestore) {
    this.name = localStorage.getItem('name');
  }

  ionViewDidLoad() {
    let uid = localStorage.getItem('uid');
    if (uid) {
      this.userDoc = this.afs.doc<User>('users/' + uid);
      this.user = this.userDoc.valueChanges();
      this.user.take(1).subscribe(user => {
        let uid = localStorage.getItem('uid');
        if (uid) {
          if (user) {
            this.name = user.name;
            localStorage.setItem('name', user.name);
          }
          else {
            this.name = null;
            localStorage.setItem('uid', null);
          }
        }
      });
    }
  }

  showModal() {
    this.modal = this.modalCtrl.create(PlayGameModal, {name: this.name || 'Anonymous'}, {cssClass: 'play-game-modal'});
    this.modal.present();
  }
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
    let uid = localStorage.getItem('uid');
    if (uid === null || uid === 'null') {
      let that = this; // hack, anyone know the es6 way?
      this.addUser(this.params.get('name')).then(function (uid) {
        localStorage.setItem('uid', uid);
        that.joinQueue(uid, type);
      });
    }
    else {
      this.joinQueue(uid, type);
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
