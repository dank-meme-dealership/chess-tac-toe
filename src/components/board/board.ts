import { Component } from '@angular/core';

/**
 * Generated class for the BoardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'board',
  templateUrl: 'board.html'
})
export class BoardComponent {

  boardState: string[][];

  constructor() {
    console.log('Hello BoardComponent Component');
    this.boardState = [
      ['wr','wp','wk','wb'],
      ['','','',''],
      ['','','',''],
      ['','','',''],
      ['','','',''],
      ['br','bp','bk','bb'],
    ]
  }

  onClick(x,y): void{
    this.boardState[x][y] = 'wr';
  }

}
