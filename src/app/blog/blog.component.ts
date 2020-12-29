import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrismWrapper } from '../helpers/prism-js-wrapper';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  html: any

  constructor(
    private route: ActivatedRoute,
    private prismWrapper: PrismWrapper
  ) {
    this.route.paramMap.subscribe(params => {
      this.loadPostContent(params.get('blogName'));
    });
  }

  ngOnInit(): void { }

  async loadPostContent(id) {
    const div = document.createElement('div');
    let html = await this.loadPostHtml(id);
    div.innerHTML = html;

    html = await this.prismWrapper.highlightAll(html, { 'linesNumbers': true, 'lineHighlighter': true });
    this.html = html;
  }

  async loadPostHtml(pageName) {
    const response = await fetch(`/assets/blogs/${pageName}.html`);
    let html = response.ok ? await response.text() : '# Page not found!';
    return html;
  }
}
