import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivateRoomPage } from './private-room';

@NgModule({
  declarations: [
    PrivateRoomPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivateRoomPage),
  ],
})
export class PrivateRoomPageModule {}
