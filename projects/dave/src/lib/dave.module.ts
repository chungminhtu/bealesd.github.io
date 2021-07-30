import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DaveComponent } from './dave.component';
// import { DaveService } from './dave.service';


@NgModule({
  declarations: [
    DaveComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DaveComponent,
  ],

})
export class DaveModule { }
