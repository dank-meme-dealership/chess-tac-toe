import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from "angularfire2/firestore";
import { Subject } from "rxjs/Subject";
import _ from 'lodash';
import { ProfilePage } from "../profile/profile";

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
        var data = user.payload.doc.data();
        return _.extend(data, {
          id: user.payload.doc.id
        });
      })
      .filter(function (user) {
        return user.wins > 0;
      });
  }

  goToProfile(player: any) {
    this.navCtrl.push(ProfilePage, { id: player.id, name: player.name });
  }

}
