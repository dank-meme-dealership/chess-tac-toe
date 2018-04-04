import {Component} from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent {

  boardState: string[][];

  constructor() {
    console.log('Hello BoardComponent Component');
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
    this.boardState[x][y] = 'wr';
  }

}
