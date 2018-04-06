import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {PlayGameModal} from "../pages/home/play-game-modal";
import {GameplayPage} from "../pages/gameplay/gameplay";
import {BotProvider} from '../providers/bot/bot';
import {ComponentsModule} from "../components/components.module";

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestore} from "angularfire2/firestore";
import { ChessProvider } from '../providers/chess/chess';
import { QueuePage } from '../pages/queue/queue';
import { HttpClientModule } from '@angular/common/http';
import { ProfilePage } from '../pages/profile/profile';
import { GameOverModalPage } from '../pages/game-over-modal/game-over-modal';

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
    PlayGameModal,
    QueuePage,
    GameplayPage,
    ProfilePage,
    GameOverModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'md-arrow-back',
      iconMode: 'md',
      pageTransition: 'md-transition',
      pageTransitionDelay: 96,
      modalEnter: 'modal-md-slide-in',
      modalLeave: 'modal-md-slide-out',
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PlayGameModal,
    QueuePage,
    GameplayPage,
    ProfilePage,
    GameOverModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BotProvider,
    ChessProvider
  ]
})
export class AppModule {
}
