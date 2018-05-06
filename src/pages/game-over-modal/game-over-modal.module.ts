import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameOverModalPage } from './game-over-modal';

@NgModule({
  declarations: [
    GameOverModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GameOverModalPage),
  ],
})
export class GameOverModalPageModule { }
