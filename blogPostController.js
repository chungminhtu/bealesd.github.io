import { Utilities } from './utilites.js';
import { Toasts } from './toasts.js';

export class BlogPostController {
	constructor(sidebar, router, blogPostIndex) {
		if (!BlogPostController.instance) {
			this.sidebar = sidebar;
			this.router = router;
			this.toasts = new Toasts();
			this.utilities = new Utilities();

			this.blogPostIndex = blogPostIndex;

			this.registerBlogPostLoadRoutes();

			BlogPostController.instance = this;
		}
		return BlogPostController.instance;
	}

	registerBlogPostLoadRoutes() {
		for (let i = 0; i < this.blogPostIndex.length; i++) {
			const postJson = this.blogPostIndex[i];
			const routeId = postJson['id'];
			const language = postJson['tag'].toLowerCase();
			this.router.routes[routeId] = () => {
				this.loadPostContent(routeId, language, () => {
					this.sidebar.showPostInSidebar(routeId)
				});
			}
		}
	}

	async loadPostContent(id, language, showPostInSidebarCb) {
		this.utilities.removeResize('pageNumbersResize');
		this.toasts.clearToasts();

		this.utilities.updatePageContent('<div class="postContent"></div>');
		await this.loadPostMarkdownHtml(id, language);

		showPostInSidebarCb(id);

		document.querySelector('#searchInput').hidden = true;
		document.querySelector('#blogPostSort').hidden = true;
	}

	async loadPostMarkdownHtml(pageName, language) {
		const languageSelector = {
			'javascript': () => { return Prism.languages.javascript; }
		}

		const response = await fetch(`/${pageName}.md`);
		let text = '';
		if (!response.ok)
			text = "# Page not found!"
		else
			text = await response.text();

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

		document.querySelector('.postContent').innerHTML = marked(text, 'javascript');
	}

}