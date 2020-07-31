import { Utilities } from './utilites.js';
import { Toasts } from './toasts.js';

// import { CodeBlockUpdater } from './codeBlockUpdater.js';
import { LineHighlighter } from './codeBlockPlugins/lineHighlighter/lineHighlighter.js'
import { BlockHighlighter } from './codeBlockPlugins/higlighter/blockHighlighter.js'
import { LineNumberer } from './codeBlockPlugins/numberer/lineNumberer.js'

export class BlogPostController {
    constructor(sidebar, router, blogPostIndex) {
        if (!BlogPostController.instance) {
            this.sidebar = sidebar;
            this.router = router;

            this.toasts = new Toasts();
            this.utilities = new Utilities();
            // this.codeBlockUpdater = new CodeBlockUpdater;
            this.codeBlockUpdater = CodeBlockUpdater;

            this.blogPostIndex = blogPostIndex;

            this.registerPlugins();
            this.registerBlogPostLoadRoutes();

            BlogPostController.instance = this;
        }
        return BlogPostController.instance;
    }

    registerPlugins() {
        let lineHighlighter = new LineHighlighter();
        let blockHighlighter = new BlockHighlighter();
        let lineNumberer = new LineNumberer();

        this.codeBlockUpdater.registerClass(lineHighlighter);
        this.codeBlockUpdater.registerClass(blockHighlighter);
        this.codeBlockUpdater.registerClass(lineNumberer);
    }

    registerBlogPostLoadRoutes() {
        for (let i = 0; i < this.blogPostIndex.length; i++) {
            const postJson = this.blogPostIndex[i];
            const routeId = postJson['id'];
            this.router.routes[routeId] = () => {
                this.loadPostContent(routeId, () => {
                    this.sidebar.showPostInSidebar(routeId)
                });
            }
        }
    }

    async loadPostContent(id, showPostInSidebarCb) {
        this.utilities.removeResize('pageNumbersResize');
        this.toasts.clearToasts();

        this.utilities.updatePageContent('<div class="postContent"></div>');
        await this.loadPostMarkdownHtml(id);

        showPostInSidebarCb(id);

        document.querySelector('#searchInput').hidden = true;
        document.querySelector('#blogPostSort').hidden = true;
    }

    async loadPostMarkdownHtml(pageName) {
        (function () {
            if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
                return;
            }
            Prism.hooks.add('before-highlight', function (env) {
                console.log("Hello Prism");
            });
        })();

        const languageSelector = {
            'c': () => { return Prism.languages.c; },
            'csharp': () => { return Prism.languages.csharp; },
            'git': () => { return Prism.languages.git; },
            'html': () => { return Prism.languages.html; },
            'javascript': () => { return Prism.languages.javascript; },
            'markdown': () => { return Prism.languages.markdown; },
            'python': () => { return Prism.languages.python; },
            'powershell': () => { return Prism.languages.powershell; },
            'typescript': () => { return Prism.languages.typescript; },
            'webassembly': () => { return Prism.languages.webassembly; },
            'yaml': () => { return Prism.languages.yaml; },
        }

        const response = await fetch(`/blogs/${pageName}.md`);
        let rawMarkdown = response.ok ? await response.text() : '# Page not found!';

        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: (code, language) => {
                return Prism.highlight(code, languageSelector[language](), language);
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });

        document.querySelector('.postContent').innerHTML = this.codeBlockUpdater.update(rawMarkdown);
    }

    parseMardown(rawMarkdown) {
        return this.codeBlockUpdater.update(rawMarkdown);
    }

    swapChildren(newParent, oldParent) {
        while (oldParent.childNodes.length > 0) {
            newParent.appendChild(oldParent.childNodes[0]);
        }
    }
}