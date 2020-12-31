import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-javascript-variables-and-scope',
  templateUrl: './javascript-variables-and-scope.component.html',
  styleUrls: ['./javascript-variables-and-scope.component.css']
})
export class JavascriptVariablesAndScopeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
