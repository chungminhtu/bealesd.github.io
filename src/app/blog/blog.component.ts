import { AfterContentChecked, AfterViewChecked, Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, AfterViewChecked {
  markdownCodeBlockStyler: any;
  lineNumberer: any;
  blockHighlighter: any;
  lineHighlighter: any;
  prism: any;
  marked: any;

  html: any

  constructor(
    private route: ActivatedRoute
  ) {
    this.markdownCodeBlockStyler = window['MarkdownCodeBlockStyler'];
    this.lineHighlighter = window['LineHighlighter'];
    this.blockHighlighter = window['BlockHighlighter'];
    this.lineNumberer = window['LineNumberer'];
    this.prism = window['Prism'];
    this.marked = window['marked'];

    this.route.paramMap.subscribe(params => {
      this.loadPostContent(params.get('blogName'));
    });
  }

  ngOnInit(): void { }

  ngAfterViewChecked() {
    const id = this.route.snapshot.params.blogName;
    if (id === 'AngularAndGitHubPages') {
      // this.prism.highlightAll();

      // document.querySelectorAll('pre').forEach((item, index) => {
      //   this.prism.highlight(item);
      // });
    }
  }

  registerPlugins() {
    this.markdownCodeBlockStyler.registerClass(this.lineHighlighter);
    this.markdownCodeBlockStyler.registerClass(this.blockHighlighter);
    this.markdownCodeBlockStyler.registerClass(this.lineNumberer);
  }

  async loadPostContent(id) {
    this.registerPlugins();

    if (id === 'AngularAndGitHubPages') {
      const div = document.createElement('div');
      let html = await this.loadPostHtml(id);
      div.innerHTML = html;

      html = await this.markdownCodeBlockStyler.runUpdateHooks2(div);
      // html = this.lineNumberer.setCodeBlockLineNumbers2(html);
      // html = this.lineHighlighter.setCodeBlockHighlights2(html);

      this.html = html;
    }

    else {
      this.html = await this.loadPostMarkdownHtml(id);
    }
  }

  async loadPostHtml(pageName) {
    const response = await fetch(`/assets/blogs/${pageName}.html`);
    let html = response.ok ? await response.text() : '# Page not found!';
    return html;
  }

  async loadPostMarkdownHtml(pageName) {
    const languageSelector = {
      'c': () => { return this.prism.languages.c; },
      'csharp': () => { return this.prism.languages.csharp; },
      'git': () => { return this.prism.languages.git; },
      'html': () => { return this.prism.languages.html; },
      'javascript': () => { return this.prism.languages.javascript; },
      'markdown': () => { return this.prism.languages.markdown; },
      'python': () => { return this.prism.languages.python; },
      'powershell': () => { return this.prism.languages.powershell; },
      'typescript': () => { return this.prism.languages.typescript; },
      'webassembly': () => { return this.prism.languages.webassembly; },
      'yaml': () => { return this.prism.languages.yaml; },
    }

    const response = await fetch(`/assets/blogs/${pageName}.md`);
    let rawMarkdown = response.ok ? await response.text() : '# Page not found!';

    this.marked.setOptions({
      renderer: new this.marked.Renderer(),
      highlight: (code, language) => {
        if (language)
          return this.prism.highlight(code, languageSelector[language]());
        else
          return this.prism.highlight(code, languageSelector['html']);
      },
      pedantic: false,
      gfm: true,
      breaks: true,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });

    return await this.markdownCodeBlockStyler.update(rawMarkdown);
  }

}
