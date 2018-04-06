import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { QueuePage } from '../queue/queue';
import { HomePage } from '../home/home';

/**
 * Generated class for the GameOverModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game-over-modal',
  templateUrl: 'game-over-modal.html',
})
export class GameOverModalPage {
  name: string;
  didWin: boolean;
  player: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.name = this.navParams.get('name') || 'Anonymous';
    this.didWin = this.navParams.get('didWin');
    this.player = this.navParams.get('player');
  }

  playAgain() {
    this.navCtrl.push(QueuePage, {player: this.player, type: 'public'});
    this.viewCtrl.dismiss();
  }

  exit() {
    this.navCtrl.push(HomePage);
    this.viewCtrl.dismiss();
  }

}
