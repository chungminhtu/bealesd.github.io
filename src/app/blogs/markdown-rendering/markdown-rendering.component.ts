import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-markdown-rendering',
  templateUrl: './markdown-rendering.component.html',
  styleUrls: ['./markdown-rendering.component.css']
})
export class MarkdownRenderingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window['Prism'].highlightAll();
  }

}
