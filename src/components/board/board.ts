import { Component, Input } from '@angular/core';
import { ChessProvider } from '../../providers/chess/chess';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Game } from '../../pages/home/play-game-modal';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent {
  @Input() player: any;

  boardState: string[][];
  selected: any;
  moveTo: any;
  moves: any[];
  highlighted: any[];
  firebaseGame: any;
  gameId: string;

  // game firebase magic
  private gameDoc: AngularFirestoreDocument<Game>;
  game: any; //Observable<Game>
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(public chessProvider: ChessProvider, private navParams: NavParams, private afs: AngularFirestore) {

    let gameId = this.navParams.get('gameId');
    this.gameId = gameId;
    if (gameId) {
      this.gameDoc = this.afs.doc<Game>('games/' + gameId);
      this.game = this.gameDoc.valueChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(game => {
          // set the board on the client when it's updated
          this.boardState = JSON.parse(game.boardState);
          this.firebaseGame = game;
        });
    }

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
    // if we click a spot with one of our pieces, update this.selected
    // even if we have a piece selected already, clicking our own piece should change the selection
    if (this.boardState[x][y][0] === this.player.color.toLowerCase()[0]) {
      this.deselectPiece(); // if we are selecting a new piece, ditch the old selection (this is a nop if nothing is selected)
      this.selectPiece(x, y);
    } else if (this.selected !== null) { // if we already have a piece selected then see if we clicked a valid square. If so move piece, else do deselect piece.
      for (let space of this.moves) {
        if (space.x === x && space.y === y) {
          this.movePiece(x, y, space.o);
          return;
        }
      }
      this.deselectPiece(); //if we did not click a valid move deselct the piece;
    }
  }

  movePiece(x, y, occupied) {
    this.moveTo = {
      xS: x,
      yS: y,
      piece: this.boardState[x][y]
    };
    this.updatePawnIfNeeded();
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

      // set pawns back to their original directional state
      if (this.moveTo.piece[1] === 'p') this.moveTo.piece = playerArray === 0 ? 'wpd' : 'bpu';

      this.boardState[playerArray][c] = this.moveTo.piece;
    } else { // just move it!
      this.boardState[x][y] = this.selected.piece;
      this.boardState[this.selected.xS][this.selected.yS] = '';
    }
    let victory = this.chessProvider.checkForWin(this.boardState, this.selected.piece[0]);
    this.deselectPiece();
    if (victory) {
      this.gameDoc.update({ winner: this.player.id });
    };

    // update the board in firebase
    let boardString = JSON.stringify(this.boardState)
    this.firebaseGame.turns.push(boardString);
    this.gameDoc.update({ boardState: boardString, turns: this.firebaseGame.turns });
  }


  // Highlights all possible moves and currently selected piece
  highlightMoves() {

    let element;

    if (this.chessProvider.isNotInTray(this.selected.xS)) {
      this.moves.forEach(e => {
        element = document.getElementById("r" + e.x + "c" + e.y + ' ' + this.gameId);
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
    element = document.getElementById("r" + this.selected.xS + "c" + this.selected.yS + ' ' + this.gameId);
    element.classList.add("selected");
    this.highlighted.push(element)
  }

  unHighlightMoves() {
    this.highlighted.forEach(e => {
      e.classList.remove('valid', 'validEnemy', 'selected');
    });
  }

  deselectPiece() {
    this.unHighlightMoves();
    this.selected = null;
    this.moveTo = null;
    this.moves = [];
    this.highlighted = [];
  }

  selectPiece(x, y) {
    let trayIndex;
    let numOnBoard = 0;
    if (this.player.color[0] === 'b') {
      trayIndex = 5;
    } else {
      trayIndex = 0;
    }
    for (let c = 0; c < 4; c++) {
      if (this.boardState[trayIndex][c] === '') numOnBoard++;
    }
    if (numOnBoard < 3 && x !== trayIndex) {
      return; // do not select anything if we have less than three pieces on the board;
    }

    this.selected = {
      xS: x,
      yS: y,
      piece: this.boardState[x][y]
    };
    this.moves = this.chessProvider.getValidMoves(this.boardState, this.selected);
    this.highlightMoves();
  }

  updatePawnIfNeeded() {
    if (this.selected.piece.substring(1, 3) === 'pd' && this.moveTo.xS === 4) this.selected.piece = this.selected.piece[0] + 'pu';
    if (this.selected.piece.substring(1, 3) === 'pu' && this.moveTo.xS === 1) this.selected.piece = this.selected.piece[0] + 'pd';
  }
}
