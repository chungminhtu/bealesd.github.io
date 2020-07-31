import { Utilities } from './utilites.js';
import { Toasts } from './toasts.js';

export class BlogPostController {
    constructor(sidebar, router, blogPostIndex) {
        if (!BlogPostController.instance) {
            this.sidebar = sidebar;
            this.router = router;

            this.toasts = new Toasts();
            this.utilities = new Utilities();

            this.markdownCodeBlockStyler = MarkdownCodeBlockStyler;
            this.blockHighlighter = BlockHighlighter;
            this.lineHighlighter = LineHighlighter;
            this.lineNumberer = LineNumberer;

            this.blogPostIndex = blogPostIndex;
            this.markedJsUrl = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';

            this.registerPlugins();
            this.registerBlogPostLoadRoutes();

            BlogPostController.instance = this;
        }
        return BlogPostController.instance;
    }

    registerPlugins() {
        this.markdownCodeBlockStyler.registerClass(this.lineHighlighter);
        this.markdownCodeBlockStyler.registerClass(this.blockHighlighter);
        this.markdownCodeBlockStyler.registerClass(this.lineNumberer);
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

        await this.utilities.loadScript(this.markedJsUrl, () => {});

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

        document.querySelector('.postContent').innerHTML = await this.markdownCodeBlockStyler.update(rawMarkdown);
    }
}