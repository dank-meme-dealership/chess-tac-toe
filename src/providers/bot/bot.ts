import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the BotProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BotProvider {
  private color: string;
  private board: any;
  private availablePieces: Array<string>;

  constructor(public http: HttpClient) {
    console.log('Hello BotProvider Provider');
  }

  getMove(state) {
    this.color = state.color;
    this.board = state.board;
    this.availablePieces = [];
    return this.board;

  }

}
