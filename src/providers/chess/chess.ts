import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    var legalMoves = [];
    var color = selected.piece[0];
    var direction = selected.piece[2];
    var x, y;
    if (direction === 'u') {
      x = selected.xS - 1;
    } else {
      x = selected.xS + 1;
    }

    for (y = selected.yS - 1; y <= selected.yS + 1; y++) {
      if (x === 0 || x === 5 || y === -1 || y == 4) {
        return [];
      }
    }
  }

  checkSpace(x, y, color, board) {
    
    if (board[x][y] === '') {
      return { x: x, y: y, o:true}; //pass back space as empty
    } else if (board[x][y][0] !== color) {
      return { x: x, y: y, o:false}; //pass back space as occupied if it has opponent
    }
    return []; // otherwise pass back not a valid move;
  }
}
