import {NgModule} from '@angular/core';
import {BoardComponent} from './board/board';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule],
  exports: [BoardComponent]
})
export class ComponentsModule {
}
