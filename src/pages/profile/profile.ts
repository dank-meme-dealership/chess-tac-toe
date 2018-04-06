import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Game } from '../home/play-game-modal';
import { Subject } from 'rxjs/Subject';
import _ from 'lodash';
const moment = require("moment");

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private ngUnsubscribe: Subject<void> = new Subject();
  gameCollection: any;
  games: any;
  name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    this.name = this.navParams.get('name');
    let playerId = this.navParams.get('id');

    this.gameCollection = this.afs.collection<Game>('games');
    this.gameCollection.snapshotChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(games => {
          this.games = _.reverse(_.sortBy(this.filterGames(games, playerId), 'timestamp'));
        });
  }

  filterGames(games: any, playerId: string) {
    return (games)
      .map(function (game) {
        var data = game.payload.doc.data();
        return _.extend(data, {
          id: game.payload.doc.id,
          timeString: moment.unix(data.timestamp).format("MM/DD/YYYY, h:mm:ss a")
        });
      })
      .filter(function (game) {
        return _.includes(_.map(game.players, 'id'), playerId);
      });
  }
}
