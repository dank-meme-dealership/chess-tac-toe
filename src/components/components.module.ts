import { NgModule } from '@angular/core';
import { BoardComponent } from './board/board';
import { CommonModule } from '@angular/common';
import { ChessProvider } from '../providers/chess/chess';
import { GameComponent } from './game/game';

@NgModule({
  declarations: [BoardComponent,
    GameComponent],
  imports: [CommonModule],
  exports: [BoardComponent,
    GameComponent],
  providers: [ChessProvider]
})
export class ComponentsModule {
}
