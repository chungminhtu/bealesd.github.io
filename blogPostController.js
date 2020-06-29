import { Utilities } from './utilites.js';
import { Toasts } from './toasts.js';

export class BlogPostController {
	constructor() {
		if (!BlogPostController.instance) {
			this.toasts = new Toasts();
			this.utilities = new Utilities();

			BlogPostController.instance = this;
		}
		return BlogPostController.instance;
	}
	async loadPostContent(id, showPostInSidebarCb) {
		this.utilities.removeResize('pageNumbersResize');
		this.toasts.clearToasts();

		this.utilities.updatePageContent('<div class="postContent"></div>');
		await this.loadPostMarkdownHtml(id);

		showPostInSidebarCb(id);

		document.querySelector('#searchInput').hidden = true;
	}

	async loadPostMarkdownHtml(pageName) {
		const response = await fetch(`/${pageName}.md`);
		const text = await response.text();

		marked.setOptions({
			renderer: new marked.Renderer(),
			highlight: function (code, language) {
				return Prism.highlight(code, Prism.languages.javascript, 'javascript');
			},
			pedantic: false,
			gfm: true,
			breaks: false,
			sanitize: false,
			smartLists: true,
			smartypants: false,
			xhtml: false
		});

		document.querySelector('.postContent').innerHTML = marked(text);
    }
    
}