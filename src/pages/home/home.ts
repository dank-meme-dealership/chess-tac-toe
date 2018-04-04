import {Component} from '@angular/core';
import {Modal, ModalController, NavController} from 'ionic-angular';

import {GameplayPage} from '../gameplay/gameplay'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  modal: Modal;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
    this.modal = this.modalCtrl.create(PlayGameModal);
  }

  showModal() {
    this.modal.present();
  }
}

@Component({
  selector: 'play-game-modal',
  template: `
    <ion-content>
      <div class="button-container">
        <button class="chess-button" ion-button (click)="goToGameplay('matchmaking')">Matchmaking</button>
        <div text-center>Play against a random opponent</div>

        <button margin-top class="chess-button" ion-button (click)="goToGameplay('private')">Private</button>
        <div text-center>Create a private game and invite a friend</div>
      </div>
    </ion-content>
  `
})
export class PlayGameModal {

  constructor(public navCtrl: NavController) {
  }

  goToGameplay(type: string) {
    console.log(type);
    this.navCtrl.push(GameplayPage);
  }

}
