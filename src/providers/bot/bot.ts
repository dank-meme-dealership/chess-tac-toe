import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BotProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BotProvider {

  constructor(public http: HttpClient) {
    console.log('Hello BotProvider Provider');
  }

  getMove(state) {
    color = state.color;
    board = state.board;
    available_pieces = [];
    return board;

  }

}
