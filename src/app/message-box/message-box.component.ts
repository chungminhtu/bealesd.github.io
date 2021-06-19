import { Component, OnInit } from '@angular/core';
import { ToastEvents, ToastType } from '../services/toast-events-service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {
  // ToastType = ToastType;
  constructor(public toastEvents: ToastEvents) { }

  public get toastType(): typeof ToastType {
    return ToastType; 
  }

  ngOnInit(): void {  }

}
