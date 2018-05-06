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
  }

  getValidMoves(board, selected) {
    
    this.selected = selected;
    this.board = board;

    let pieceType = this.selected.piece[1];
    let moves = [];

    if (selected.xS === 0 || selected.xS === 5) { // special logic for the placement from the tray
      for (let x = 1; x < 5; x++) {
        for (let y = 0; y < 4; y++) {
          if (this.board[x][y] === '') {
            moves.push({ x: x, y: y, o: false });
          }
        }
      }
      return moves; // return here!!
    }

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
      let onBoardSpace = this.checkSpace(x, this.selected.yS, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break; // we hit a friendly and can't go farther. Break and do not add to legal moves
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break; // we hit aan enemy and can't go farther, but we added him already as a valid move.
      }
    }

    //LEFT
    for (let x = this.selected.xS - 1; x > 0; x--) {
      let onBoardSpace = this.checkSpace(x, this.selected.yS, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break; 
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;  
      }
    }

    //UP
    for (let y = this.selected.yS - 1; y >= 0; y--) {
      let onBoardSpace = this.checkSpace(this.selected.xS, y, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break; 
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;
      }
    }

    //DOWN
    for (let y = this.selected.yS + 1; y < 4; y++) {
      let onBoardSpace = this.checkSpace(this.selected.xS, y, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break;
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;
      }
    }
    return legalMoves;
  }

  getBishopLegalMove() {

    let legalMoves = [];
    let color = this.selected.piece[0];

    // //UP RIGHT
    for (let i = 1; i < 4; i++) {
      let onBoardSpace = this.checkSpace(this.selected.xS + i, this.selected.yS + i, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break;
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;
      }
    }

    // //UP LEFT
    for (let i = 1; i < 4; i++) {
      let onBoardSpace = this.checkSpace(this.selected.xS - i, this.selected.yS + i, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break;
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;
      }
    }

    // //DOWN RIGHT
    for (let i = 1; i < 4; i++) {
      let onBoardSpace = this.checkSpace(this.selected.xS + i, this.selected.yS - i, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break;
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;
      }
    }

    // //DOWN LEFT
    for (let i = 1; i < 4; i++) {
      let onBoardSpace = this.checkSpace(this.selected.xS - i, this.selected.yS - i, color)
      if (onBoardSpace) {
        if(onBoardSpace.f) break;
        legalMoves.push(onBoardSpace);
        if (onBoardSpace.o) break;
      }
    }

    return legalMoves;
  }

  getKnightLegalMove() {
    //
    let legalMoves = [];
    let color = this.selected.piece[0];

    let onBoardSpace = this.checkSpace(this.selected.xS + 2, this.selected.yS + 1, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS - 2, this.selected.yS + 1, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS + 2, this.selected.yS - 1, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS - 2, this.selected.yS - 1, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS + 1, this.selected.yS + 2, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS - 1, this.selected.yS + 2, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS + 1, this.selected.yS - 2, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

    onBoardSpace = this.checkSpace(this.selected.xS - 1, this.selected.yS - 2, color);
    if (onBoardSpace && !onBoardSpace.f) legalMoves.push(onBoardSpace);

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
    let onBoardSpace = this.checkSpace(x, y, color);
    if (onBoardSpace && !onBoardSpace.f && !onBoardSpace.o) legalMoves.push(onBoardSpace);

    //forward left/right
    y = this.selected.yS + 1;
    onBoardSpace = this.checkSpace(x, y, color);
    if (onBoardSpace && onBoardSpace.o) legalMoves.push(onBoardSpace);

    //forward left/right
    y = this.selected.yS - 1;
    onBoardSpace = this.checkSpace(x, y, color);
    if (onBoardSpace && onBoardSpace.o) legalMoves.push(onBoardSpace);

    return legalMoves;
  }

  checkSpace(x, y, color) {
    if (!this.moveIsOnBoard(x, y)) return null;
    if (this.board[x][y] === '') {
      return { x: x, y: y, o: false , f:false}; //pass back space as empty
    } else if (this.board[x][y][0] !== color) {
      return { x: x, y: y, o: true, f:false }; //pass back space as occupied if it has opponent
    } else {
      return { o: false, f:true};
    }
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


  checkForWin(board, color){

    for (let x = 1; x < 5; x++){ // check rows
      let piecesInColumn = 0;

      for (let y = 0; y < 4; y ++){
        if(color === board[x][y][0])piecesInColumn++; 
      }

      if( piecesInColumn === 4) return true;
    }

    for(let y = 0; y < 4; y ++){ // check columns
      let piecesInRow = 0;

      for (let x = 1; x < 5; x++){
        if(color === board[x][y][0]) piecesInRow++;
      }

      if (piecesInRow === 4) return true;
    }

    let y = 0;
    let x = 1;
    let piecesInDiagonal = 0;
    while (y < 4){ // check 1 diagonal
      if (color === board[x][y][0]){
        piecesInDiagonal++;
      }
      y++;
      x++;
    }

    if (piecesInDiagonal == 4) return true;

    y = 3;
    x = 1;
    piecesInDiagonal = 0;
    while (y >= 0){
      if (color === board[x][y][0]){
        piecesInDiagonal++;
      }
      y--;
      x++;
    }

    if (piecesInDiagonal == 4) return true;
    return false;
  }
}
