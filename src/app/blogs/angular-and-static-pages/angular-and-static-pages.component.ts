import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-angular-and-static-pages',
  templateUrl: './angular-and-static-pages.component.html',
  styleUrls: ['./angular-and-static-pages.component.css']
})
export class AngularAndStaticPagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
