import { Component, OnInit } from '@angular/core';
import { ToastEvents, ToastType } from './dave.service';

@Component({
  selector: 'lib-Dave',
  templateUrl: './dave.component.html',
  styleUrls: ['./dave.component.css']

})
export class DaveComponent implements OnInit {

  constructor(public toastEvents: ToastEvents,
    ) {
  }

  public get toastType(): typeof ToastType {
    return ToastType;
  }

  ngOnInit(): void {
  }

}
