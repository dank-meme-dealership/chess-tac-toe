import { Component } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent {

  boardState: string[][];
  selected: any;
  moveTo: any;

  constructor() {
    console.log('Hello BoardComponent Component');
    this.selected = null;
    this.boardState = [
      ['wr', 'wp', 'wk', 'wb'],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['br', 'bp', 'bk', 'bb'],
    ]
  }

  onClick(x, y): void {
    //if nothing is selected yet and we click a spot with a piece, update this.selected
    if (this.selected === null && this.boardState[x][y] !== '') {
      this.selected = {
        xS: x,
        yS: y,
        piece: this.boardState[x][y]
      };
    } else if(this.selected !== null){ // if we already have a piece selected then
      this.moveTo = {
        xS: x,
        yS: y,
        piece: this.boardState[x][y]
      }
      if (this.moveTo.piece !==''){
        //check to see if you are moving out of a tray. if so do nothing. you cannot capture a piece while placing
        if(this.selected.xS === 0 || this.selected.xS === 5){
          return;
        }

        if(this.selected.piece[0]!== this.moveTo.piece[0]){
          var playerArray;
          if (this.moveTo.piece[0] =='b'){
            playerArray = 5;
          } else {
            playerArray = 0;
          }
          var c = 0;
          while(this.boardState[playerArray][c]!==''){
            c++;
          }
          this.boardState[x][y] = this.selected.piece;
          this.boardState[this.selected.xS][this.selected.yS] = '';
          this.boardState[playerArray][c] = this.moveTo.piece;
        }
      } else {
        this.boardState[x][y] = this.selected.piece;
        this.boardState[this.selected.xS][this.selected.yS] = '';
      }
      this.selected = null;
      this.moveTo = null;
    }


  }

}
