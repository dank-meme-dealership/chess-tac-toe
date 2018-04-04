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
  selector: 'page-home',
  template: `
    <ion-content>
      <button class="chess-button" ion-button (click)="goToGameplay('matchmaking')">Matchmaking</button>
      <button class="chess-button" ion-button (click)="goToGameplay('private')">Private</button>
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
