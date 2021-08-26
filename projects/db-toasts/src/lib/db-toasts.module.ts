import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DbToastsComponent } from './db-toasts.component';

@NgModule({
  declarations: [
    DbToastsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DbToastsComponent,
  ],

})
export class DbToastsModule { }
