import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Move {
  playerId: number;
  move: string;
}

@Injectable()
export class ChessProvider {

  board: any[][];
  selected: any;
  constructor(public http: HttpClient) {
    console.log('Hello ChessProvider Provider');
  }

  getValidMoves(board, selected) {
    let pieceType = this.selected.piece[1];
    this.board = board;
    this.selected = selected;
    let moves = null;
    switch (pieceType) {
      case 'r': {
        moves =  this.getRookLegalMove();
        break;
      }
      case 'b': {
        moves = this.getBishopLegalMove();
        break;
      }
      case 'k': {
        moves = this.getKnightLegalMove();
        break;
      }
      case 'p': {
        moves = this.getPawnLegalMove();
        break;
      }
    }
    this.board = null;
    this.selected = null;
    return moves;
  }


  getRookLegalMove() {
    // for(let row = this.selected.yS; row = (row+1));
  }

  getBishopLegalMove() {

  }

  getKnightLegalMove() {
    //
    let legalMoves = [];
    let color = this.selected.piece[0];

    let possible = this.checkSpace(this.selected.xS+2,this.selected.yS+1,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS-2,this.selected.yS+1,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS+2,this.selected.yS-1,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS-2,this.selected.yS-1,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS+1,this.selected.yS+2,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS-1,this.selected.yS+2,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS+1,this.selected.yS-2,color);
    if(possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS-1,this.selected.yS-2,color);
    if(possible) legalMoves.push(possible);

    return legalMoves;
  }

  getPawnLegalMove() {
    let legalMoves = [];
    let color = this.selected.piece[0];
    let direction = this.selected.piece[2];
    let x, y;

    if (direction === 'u') {
      x = this.selected.xS - 1;
    } else {
      x = this.selected.xS + 1;
    }

    //forward
    y = this.selected.yS;
    let possible = this.checkSpace(x, y,color);
    if(possible) legalMoves.push(possible);

    //forward left/right
    y=this.selected.yS+1;
    possible = this.checkSpace(x,y,color);
    if(possible && possible.o) legalMoves.push(possible);

    //forward left/right
    y=this.selected.yS-1;
    possible = this.checkSpace(x,y,color);
    if(possible && possible.o) legalMoves.push(possible);

    return legalMoves;
  }

  checkSpace(x, y, color) {
    if(!this.moveIsOnBoard(x,y)) return null;
    if (this.board[x][y] === '') {
      return { x: x, y: y, o:true}; //pass back space as empty
    } else if (this.board[x][y][0] !== color) {
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
