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
    
    this.selected = selected;
    this.board = board;

    let pieceType = this.selected.piece[1];
    let moves = null;
    switch (pieceType) {
      case 'r': {
        moves = this.getRookLegalMove();
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
    let legalMoves = [];
    let color = this.selected.piece[0];

    //RIGHT
    for (let x = this.selected.xS + 1; x < 5; x++) {
      let possible = this.checkSpace(x, this.selected.yS, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    //LEFT
    for (let x = this.selected.xS - 1; x > 0; x--) {
      let possible = this.checkSpace(x, this.selected.yS, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    //UP
    for (let y = this.selected.yS - 1; y >= 0; y--) {
      let possible = this.checkSpace(this.selected.xS, y, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    //DOWN
    for (let y = this.selected.yS + 1; y < 4; y++) {
      let possible = this.checkSpace(this.selected.xS, y, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }
    return legalMoves;
  }

  getBishopLegalMove() {

    let legalMoves = [];
    let color = this.selected.piece[0];

    // //UP RIGHT
    for (let i = 1; i < 4; i++) {
      let possible = this.checkSpace(this.selected.xS+i, this.selected.yS+i, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    // //UP LEFT
    for (let i = 1; i < 4; i++) {
      let possible = this.checkSpace(this.selected.xS-i, this.selected.yS+i, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    // //DOWN RIGHT
    for (let i = 1; i < 4; i++) {
      let possible = this.checkSpace(this.selected.xS+i, this.selected.yS-i, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    // //DOWN LEFT
    for (let i = 1; i < 4; i++) {
      let possible = this.checkSpace(this.selected.xS-i, this.selected.yS-i, color)
      if (possible) {
        legalMoves.push(possible);
        if (possible.o) break;
      }
    }

    return legalMoves;
  }

  getKnightLegalMove() {
    //
    let legalMoves = [];
    let color = this.selected.piece[0];

    let possible = this.checkSpace(this.selected.xS + 2, this.selected.yS + 1, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS - 2, this.selected.yS + 1, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS + 2, this.selected.yS - 1, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS - 2, this.selected.yS - 1, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS + 1, this.selected.yS + 2, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS - 1, this.selected.yS + 2, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS + 1, this.selected.yS - 2, color);
    if (possible) legalMoves.push(possible);

    possible = this.checkSpace(this.selected.xS - 1, this.selected.yS - 2, color);
    if (possible) legalMoves.push(possible);

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
    let possible = this.checkSpace(x, y, color);
    if (possible) legalMoves.push(possible);

    //forward left/right
    y = this.selected.yS + 1;
    possible = this.checkSpace(x, y, color);
    if (possible && possible.o) legalMoves.push(possible);

    //forward left/right
    y = this.selected.yS - 1;
    possible = this.checkSpace(x, y, color);
    if (possible && possible.o) legalMoves.push(possible);

    return legalMoves;
  }

  checkSpace(x, y, color) {
    if (!this.moveIsOnBoard(x, y)) return null;
    if (this.board[x][y] === '') {
      return { x: x, y: y, o: false }; //pass back space as empty
    } else if (this.board[x][y][0] !== color) {
      return { x: x, y: y, o: true }; //pass back space as occupied if it has opponent
    }
    return null; // otherwise pass back not a valid move;
  }

  moveIsOnBoard(x, y) {
    if (this.isNotInTray(x) && y < this.board[x].length && y >= 0) {
      return true;
    } else {
      return false;
    }
  }

  isNotInTray(x) {
    return x < 5 && x > 0;
  }
}
