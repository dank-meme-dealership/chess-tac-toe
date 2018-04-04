import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GameplayPage } from './gameplay';

@NgModule({
  declarations: [
    GameplayPage,
  ],
  imports: [
    IonicPageModule.forChild(GameplayPage),
  ],
})
export class GameplayPageModule {}
