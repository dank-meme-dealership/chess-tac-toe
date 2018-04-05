import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Game} from "../home/play-game-modal";
import {GameplayPage} from "../gameplay/gameplay";
import {AngularFirestore} from 'angularfire2/firestore';

const moment = require("moment");

@IonicPage()
@Component({
  selector: 'page-queue',
  templateUrl: 'queue.html',
})
export class QueuePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QueuePage');
    if (this.navParams.data.type === 'private') {
      this.joinGame(this.navParams.data.player, true);
    }
  }

  joinGame(player: any, privateGame: boolean) {
    this.afs.collection<Game>('games')
      .add({
        players: [player],
        turns: [],
        queueTimestamp: moment().unix(),
        privateGame: privateGame,
      })
      .then(game => {
        // nav to this game
        this.navCtrl.push(GameplayPage, {gameId: game.id});
      });
  }

  invitePlayerToGame(gameId: string) {
    // TODO: Invite a player in the queue to the game
    // once they've responded that they've seen it, 
    // remove both players from the queue and they will
    // both transition into the game
  }

}
