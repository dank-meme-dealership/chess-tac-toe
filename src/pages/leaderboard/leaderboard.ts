import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from "angularfire2/firestore";
import {Subject} from "rxjs/Subject";
import _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  private ngUnsubscribe: Subject<void> = new Subject();
  players;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    this.afs.collection<any>('users')
      .snapshotChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(users => {
        this.players = _.reverse(_.sortBy(this.filterUsers(users), 'wins'));
      });
  }

  filterUsers(users: any) {
    return (users)
      .map(function (user) {
        return user.payload.doc.data();
      })
      .filter(function (user) {
        return user.wins > 0;
      });
  }

}
