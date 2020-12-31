import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-crud',
  templateUrl: './event-crud.component.html',
  styleUrls: ['./event-crud.component.css']
})
export class EventCrudComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
