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

    //forward
    y = selected.yS;
    let possible = this.checkSpace(x, y,color,board);
    if(possible) legalMoves.push(possible);

    //forward left/right
    y=selected.yS+1;
    possible = this.checkSpace(x,y,color,board)
    if(possible && possible.o) legalMoves.push(possible);

    //forward left/right
    y=selected.yS-1;
    possible = this.checkSpace(x,y,color,board)
    if(possible && possible.o) legalMoves.push(possible);

    return legalMoves;
  }

  checkSpace(x, y, color, board) {
    if(!this.moveIsOnBoard(x,y)) return null;
    if (board[x][y] === '') {
      return { x: x, y: y, o:true}; //pass back space as empty
    } else if (board[x][y][0] !== color) {
      return { x: x, y: y, o:false}; //pass back space as occupied if it has opponent
    }
    return null; // otherwise pass back not a valid move;
  }

  moveIsOnBoard(x,y){
    if (x < 5 && x > 0 && y < 4 && y >= 0){
      return true;
    } else{
      return false;
    }
  }
}
