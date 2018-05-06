import { Component } from '@angular/core';
import { Modal, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/take";
import { PlayGameModal } from "./play-game-modal";
import { ProfilePage } from '../profile/profile';
import { LeaderboardPage } from '../leaderboard/leaderboard';

export interface User {
  name: string;
  timestamp: number;
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
  uid: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, private afs: AngularFirestore) {
    this.name = localStorage.getItem('name');
  }

  ionViewDidLoad() {
    this.uid = localStorage.getItem('uid');
    if (this.uid) {
      this.userDoc = this.afs.doc<User>('users/' + this.uid);
      this.user = this.userDoc.valueChanges();
      this.user.take(1).subscribe(user => {
        if (user) {
          this.name = user.name;
          localStorage.setItem('name', user.name);
        }
        else {
          this.removeLocalUser();
        }
      });
    }
  }

  updateName() {
    let uid = localStorage.getItem('uid');
    if (uid) {
      if (!this.userDoc) {
        this.userDoc = this.afs.doc<User>('users/' + uid);
        this.user = this.userDoc.valueChanges();
      }
      this.userDoc.update({ name: this.name }).catch(this.removeLocalUser.bind(this));
      localStorage.setItem('name', this.name);
    }
  }

  removeLocalUser() {
    this.user = null;
    this.userDoc = null;
    localStorage.setItem('uid', '');
  }

  showModal() {
    this.modal = this.modalCtrl.create(PlayGameModal, { name: this.name || '' }, { cssClass: 'play-game-modal' });
    this.modal.present();
  }

  goToLeaderboard() {
    this.navCtrl.push(LeaderboardPage);
  }

  goToProfile() {
    this.navCtrl.push(ProfilePage, { id: this.uid, name: this.name });
  }
}
