import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  private game: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.game = {
      turns: [
        {
          board: ['','','','', '','','','', '','','','', '','','',''],
          whiteTray: ['wpd', 'wk', 'wb', 'wr'],
          blacktray: ['bpu', 'bk', 'bb', 'br']
        }
      ],
      messages: [{
        player: "Roger",
        message: "i am roger",
        timestamp: 1903283022
      }],
      timestamp: 1903283012,
      privateGame: false,
      lastMove: {
        oldPos: {
          x: 0,
          y: 3
        },
        newPos: {
          x: 2,
          y: 2
        }
      },
      players: [
        {
          color: "white",
          id: "3QRd5yJN8FwL6rYeJmrR",
          name: "Roger"
        },
        {
          color: "black",
          id: "YwgAgrMqH5ptKodkd4Ds",
          name: "Matt"
        }
      ]
    };
  }
}
