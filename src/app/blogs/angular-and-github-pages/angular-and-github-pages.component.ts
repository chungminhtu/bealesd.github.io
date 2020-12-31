import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-angular-and-github-pages',
  templateUrl: './angular-and-github-pages.component.html',
  styleUrls: ['./angular-and-github-pages.component.css']
})
export class AngularAndGithubPagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
