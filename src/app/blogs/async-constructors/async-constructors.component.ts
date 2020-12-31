import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-async-constructors',
  templateUrl: './async-constructors.component.html',
  styleUrls: ['./async-constructors.component.css']
})
export class AsyncConstructorsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
