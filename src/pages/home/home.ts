import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { GameplayPage } from '../gameplay/gameplay'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToGameplay() {
    this.navCtrl.push(GameplayPage);
  }

}
