import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { HomePage } from "../home/home";

@IonicPage()
@Component({
  selector: 'page-private-room',
  templateUrl: 'private-room.html',
})
export class PrivateRoomPage {

  private ngUnsubscribe: Subject<void> = new Subject();

  message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateRoomPage');
    if (this.navParams.data.mode === 'create') {
      this.message = 'Your room'
    } else {
      this.message = `Joined room ${this.navParams.data.joinRoomID}`
    }
  }

  exit() {
    //TODO: unsubscribe from... something
    this.navCtrl.push(HomePage);
  }

  doNothing() {
    // do nothing with the error message
  }
}
