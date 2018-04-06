import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Game } from '../home/play-game-modal';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  gameCollection: any;
  games: any;
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    this.name = this.navParams.get('id');

    this.gameCollection = this.afs.collection<Game>('games');
    this.games = this.gameCollection.valueChanges();
  }

}
