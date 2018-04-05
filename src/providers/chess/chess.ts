import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

export interface Move {
  playerId: number;
  move: string;
}

@Injectable()
export class ChessProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ChessProvider Provider');
  }

  getValidMoves(board, selected) {
    var pieceType = selected.piece[1];
    switch (pieceType) {
      case 'r': {
        return this.getRookLegalMove(board, selected);
      }
      case 'b': {
        this.getBishopLegalMove(board, selected);
        break;
      }
      case 'k': {
        this.getKnightLegalMove(board, selected);
        break;
      }
      case 'p': {
        this.getPawnLegalMove(board, selected);
        break;
      }
    }
  }


  getRookLegalMove(board, selected) {

  }

  getBishopLegalMove(board, selected) {

  }

  getKnightLegalMove(board, selected) {

  }

  getPawnLegalMove(board, selected) {
    var color = selected.piece[0];
    var direction = selected.piece[2];
  }
}
