import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class BotProvider {

  //ordered by power
  private pieces: ['r', 'b', 'k', 'p'];
  private color: string;
  private board: any[][]; //not sure if this declaration or VVVV below
  private availablePieces: Array<string>;

  constructor(public http: HttpClient) {
    console.log('Hello BotProvider Provider');
  }

  getMove(state: any) {
    //collect meta about the state
    this.color = state.color;
    this.board = state.board;
    let availablePieces = this.getAvailablePieces(this.board, this.color);

    if(availablePieces.length > 1) {
      return this.addPiece(this.board, this.color, availablePieces);
    }

    this.availablePieces = [];
    return this.board;
  }

  protected getAvailablePieces(board: any[][], color: string)
  {
    let playerIndex = color==='w'? 0 : 5;
    this.availablePieces = [];
    for(let piece in board[playerIndex]) {
      if(piece !== '' && piece[0]===color[0])
        this.availablePieces.push(piece);
    }
    return this.availablePieces;
  }

  addPiece(board: any[][], color: string, availablePieces: any[]) {
    let powerIndex = 100;
    let playerPieceRow = color[0]=='w' ? 0 : 5;
    let playerPieceCol = 1000;

    //go find the "best" piece to play
    for(let i = 0; i < this.pieces.length; i++) {
      let availablePieceIndex = availablePieces.indexOf(color[0] + this.pieces[i]);
      if(availablePieceIndex != -1) {
        if(powerIndex > i) {
          powerIndex = i;
          playerPieceCol = board[playerPieceRow].indexOf(color[0] + this.pieces[powerIndex])
        }
      }
    }
    //let tempWeights = this.getWeightedBoard(board);
    this.movePiece(board, color, playerPieceRow, playerPieceCol, null, null)
  }



  protected movePiece(board: any[][], color: string, fromColumn: number, fromRow: number, toColumn: number, toRow: number )
  {
    board[toRow][toColumn] = board[fromRow][fromColumn];
    board[fromRow][fromColumn] = '';
    //get best unused piece

    //do more stuff with the piece we just found;
  }

  // protected getWeightedBoard(board: string[][]){
  //   return null;
  // }

}
