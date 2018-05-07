import { Component } from "@angular/core";
import { AngularFirestoreCollection, AngularFirestore } from "angularfire2/firestore";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { PrivateRoomPage } from "../private-room/private-room";

@Component({
  selector: 'private-room-modal',
  template: `
    <ion-content>
      <div class="button-container">
        <button class="chess-button" ion-button (click)="createRoom()" [disabled]="buttonClicked">Create Room</button>
        <div text-center>Create a private room that others can join</div>

        <button margin-top class="chess-button" ion-button (click)="joinRoom(joinRoomID)">Join Room
        </button>
        <ion-input type="text" class="room-id" [(ngModel)]="joinRoomID">
        </ion-input>
        <div text-center>Join an existing private room</div>
      </div>
    </ion-content>
  `
})
export class PrivateRoomModal {
  private buttonClicked: boolean;

  constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController, private afs: AngularFirestore) {
    this.buttonClicked = false;
  }

  createRoom() {
    this.buttonClicked = true;
    
    this.navCtrl.push(PrivateRoomPage, { mode: 'create' })
  }

  joinRoom(joinRoomID: string) {
    this.buttonClicked = true;
    
    this.navCtrl.push(PrivateRoomPage, { mode: 'join', joinRoomID: joinRoomID })
  }
}