import { Component, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'game',
  templateUrl: 'game.html'
})
export class GameComponent {
  @Input() game: any;
  private board = ['','','','','','','','','','','','','','','',''];

  constructor() {
    
  }

  ngOnChanges(changes: any) {
    // make sure the change was to the game and that it's not undefined
    if (changes.game && changes.game.currentValue !== undefined) {
      
      // set the board to the last turn
      if (this.game.turns.length > 0) {
        this.board = this.game.turns[this.game.turns.length - 1];
      }
    }
  }

  isBlack(i: number) {
    return Math.floor(i / 4) == i % 4 || (Math.floor(i / 4) - i % 4) % 2 == 0;
  }

}
