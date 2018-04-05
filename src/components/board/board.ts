import { Component } from '@angular/core';
import { ChessProvider } from '../../providers/chess/chess';

@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent {

  boardState: string[][];
  selected: any;
  moveTo: any;
  moves: any[];
  highlighted: any[];

  constructor(public chessProvider: ChessProvider) {
    console.log('Hello BoardComponent');
    this.selected = null;
    this.boardState = [
      ['wr', 'wpd', 'wk', 'wb'],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['br', 'bpu', 'bk', 'bb'],
    ]
    this.highlighted = [];
    this.moves = [];
  }

  onClick(x, y): void {
    // if nothing is selected yet and we click a spot with a piece, update this.selected
    if (this.selected === null && this.boardState[x][y] !== '') {
      this.selected = {
        xS: x,
        yS: y,
        piece: this.boardState[x][y]
      };
      this.moves = this.chessProvider.getValidMoves(this.boardState, this.selected);
      if (this.chessProvider.isNotInTray(x)) {
        this.highlightMoves();
      }
    } else if (this.selected !== null) { // if we already have a piece selected then see if we clicked a valid square. If so move piece, else do nothing.
      for (let space of this.moves) {
        if (space.x === x && space.y === y) {
          this.movePiece(x, y, space.o);
        }
      }
    }
  }

  movePiece(x, y, occupied) {
    this.moveTo = {
      xS: x,
      yS: y,
      piece: this.boardState[x][y]
    };
    if (occupied) { // do logic to move a piece
      let playerArray;

      if (this.moveTo.piece[0] == 'b') { //check where to place taken piece
        playerArray = 5;
      } else {
        playerArray = 0;
      }

      let c = 0;
      while (this.boardState[playerArray][c] !== '' && c < 4) {
        c++;
      }
      this.boardState[x][y] = this.selected.piece;
      this.boardState[this.selected.xS][this.selected.yS] = '';
      this.boardState[playerArray][c] = this.moveTo.piece;
    } else { // just move it!
      this.boardState[x][y] = this.selected.piece;
      this.boardState[this.selected.xS][this.selected.yS] = '';
    }
    this.unHighlightMoves();
    this.selected = null;
    this.moveTo = null;
    this.moves = [];
    this.highlighted = [];
  }

  highlightMoves() {

    this.moves.forEach(e => {
      let element = document.getElementById("r" + e.x + "c" + e.y);
      let className;
      if (e.o) {
        className = "validEnemy";
      } else {
        className = "valid";
      }
      element.classList.add(className);
      this.highlighted.push(element);
    });
  }

  unHighlightMoves() {
    this.highlighted.forEach(e => {
      e.classList.remove('valid','validEnemy');
    });
  }
}
