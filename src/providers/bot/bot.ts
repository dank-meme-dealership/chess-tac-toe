import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ChessProvider} from "../chess/chess"

@Injectable()
export class BotProvider {

  //ordered by power
  private pieces: ['r', 'b', 'k', 'p'];
  private color: string;
  private board: any[][]; //not sure if this declaration or VVVV below
  // private weights: number[][]; //not sure if this declaration or VVVV below
  private availablePieces: Array<string>;
  private chessProvider: ChessProvider;

  constructor(public http: HttpClient) {
  }

  public makeMove(state: any) {
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

    let tempWeights = this.getWeightedBoard(board, color);
    let availableMoves = null;

    if(this.board[playerPieceRow][playerPieceCol][1] === 'p') {
      availableMoves = this.chessProvider.getRookLegalMove();
    } else if(this.board[playerPieceRow][playerPieceCol][1] === 'k') {
      availableMoves = this.chessProvider.getKnightLegalMove();
    } else if(this.board[playerPieceRow][playerPieceCol][1] === 'r') {
      availableMoves = this.chessProvider.getRookLegalMove();
    } else if(this.board[playerPieceRow][playerPieceCol][1] === 'b') {
      availableMoves = this.chessProvider.getBishopLegalMove();
    }

    let highWeight = 0;
    var bestMove = null;
    for(let move of availableMoves) {
      if(tempWeights[move.x][move.y] > highWeight) {
        highWeight = tempWeights[move.x][move.y];
        bestMove = move;
      }
    }

    this.movePiece(board, color, playerPieceRow, playerPieceCol, bestMove.x, bestMove.y);
    return this.board;
  }



  protected movePiece(board: any[][], color: string,fromRow: number, fromColumn: number, toRow: number, toColumn: number )
  {
    let deadPiece = board[toRow][toColumn];
    board[toRow][toColumn] = board[fromRow][fromColumn];
    board[fromRow][fromColumn] = '';

    if(deadPiece !== '') {
      this.addPieceBackToTray(deadPiece);
    }
    //get best unused piece

    //do more stuff with the piece we just found;
  }

  protected addPieceBackToTray(deadPiece: any) {
    let trayIndex = null;
    if(deadPiece[0] === 'w') {
      trayIndex = 0;
    } else if(deadPiece[0] === 'b') {
      trayIndex = 5;
    }

    for(let i = 0; i < this.board[trayIndex].length; i++) {
        if(this.board[trayIndex][i]=== '') {
          this.board[trayIndex][i] = deadPiece;
          break;
        }
    }
  }

  protected getWeightedBoard(board: string[][], color: string){
    var weights = this.getEmptyMultiArray();
    for(let row=0; row < this.board.length; row++) {
      for(let col=0; col < this.board[row].length; col++) {
        //if it's one of our pieces...
        if(board[row][col][0] === color[0]) {
          weights[row][col]-=100; //a piece occupies this spot
          this.updateWeights(row,col, weights); //add one to each cell UDLR from this location.
        }

        //what about if it's one of thier pieces?
      }
    }
    return weights;
  }

  protected updateWeights(row: number, col: number, weights: number[][]): any {
    //update the row
    for(let i = 0 ; i< this.board[row].length; i++) {
      weights[row][i] += 1;
    }
    //update the column
    for(let j = 0; j< this.board.length; j++) {
      weights[j][col] += 1;
    }
  }

  protected getEmptyMultiArray(): number[][] {
    var array= new Array<Array<number>>();
    for(var i=0;i<4;i++) {
      array[i]= new Array<number>();
      for(var j=0;j<4;j++) {
        array[i][j] = 0;
      }
    }
    return array;
  }

}
