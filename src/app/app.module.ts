import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GameplayPage } from "../pages/gameplay/gameplay";
import { BotProvider } from '../providers/bot/bot';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyD2OLU1f78pWLsMO-NwIfBJfRRJp4Hlg1k",
  authDomain: "chess-tac-toe.firebaseapp.com",
  databaseURL: "https://chess-tac-toe.firebaseio.com",
  projectId: "chess-tac-toe",
  storageBucket: "chess-tac-toe.appspot.com",
  messagingSenderId: "571314774422"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GameplayPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GameplayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BotProvider
  ]
})
export class AppModule {}
