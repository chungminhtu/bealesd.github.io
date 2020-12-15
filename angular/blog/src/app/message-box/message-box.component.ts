import { Component, OnInit } from '@angular/core';
import { ToastEvents } from '../services/toast-events-service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {
  constructor(public toastEvents: ToastEvents) { }

  ngOnInit(): void {  }

}
