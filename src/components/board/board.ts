import { Component } from '@angular/core';
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

  boardState: string[][];
  selected: any;
  moveTo: any;
  moves: any[];
  highlighted: any[];

  // game firebase magic
  private gameDoc: AngularFirestoreDocument<Game>;
  game: any; //Observable<Game>
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(public chessProvider: ChessProvider, private navParams: NavParams, private afs: AngularFirestore) {

    let gameId = this.navParams.get('gameId');
    if (gameId) {
      this.gameDoc = this.afs.doc<Game>('games/' + gameId);
      this.game = this.gameDoc.valueChanges()
        .takeUntil(this.ngUnsubscribe)
        .subscribe(game => {
          // set the board on the client when it's updated
          this.boardState = JSON.parse(game.boardState);
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
    // if nothing is selected yet and we click a spot with a piece, update this.selected
    if (this.selected === null && this.boardState[x][y] !== '') {
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
    this.deselectPiece();
    
    // update the board in firebase
    this.gameDoc.update({boardState: JSON.stringify(this.boardState)});
  }

  highlightMoves() {

    let element;

    if (this.chessProvider.isNotInTray(this.selected.xS)) {
      this.moves.forEach(e => {
        element = document.getElementById("r" + e.x + "c" + e.y);
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
    element = document.getElementById("r" + this.selected.xS + "c" + this.selected.yS);
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
    this.selected = {
      xS: x,
      yS: y,
      piece: this.boardState[x][y]
    };
    this.moves = this.chessProvider.getValidMoves(this.boardState, this.selected);
    this.highlightMoves();
  }
}
