import { NgModule } from '@angular/core';

import { DragDropService } from './drag-drop.service';
import { DragDirective } from './drag-drop/drag.directive';
import { DropDirective } from './drag-drop/drop.directive';
import { IdentityDirective } from './identity.directive';

@NgModule({
  declarations: [
    DragDirective,
    DropDirective,
    IdentityDirective,
  ],
  exports: [
    DragDirective,
    DropDirective,
    IdentityDirective,
  ],
  providers: [
    DragDropService
  ]
})
export class DirectiveModule { }
