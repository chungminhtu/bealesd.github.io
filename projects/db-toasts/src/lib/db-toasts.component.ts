import { Component, OnInit } from '@angular/core';
import { ToastEvents, ToastType } from './db-toasts.service';

@Component({
  selector: 'db-toasts',
  templateUrl: './db-toasts.component.html',
  styleUrls: ['./db-toasts.component.css']

})
export class DbToastsComponent implements OnInit {

  constructor(public toastEvents: ToastEvents,
    ) {
  }

  public get toastType(): typeof ToastType {
    return ToastType;
  }

  ngOnInit(): void {
  }

}
