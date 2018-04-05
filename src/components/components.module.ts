import {NgModule} from '@angular/core';
import {BoardComponent} from './board/board';
import {CommonModule} from '@angular/common';
import { ChessProvider } from '../providers/chess/chess';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule],
  exports: [BoardComponent],
  providers:[ChessProvider]
})
export class ComponentsModule {
}
