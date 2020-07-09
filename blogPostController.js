import { Utilities } from './utilites.js';
import { Toasts } from './toasts.js';

export class BlogPostController {
	constructor(sidebar, router, blogPostIndex) {
		if (!BlogPostController.instance) {
			this.toasts = new Toasts();
			this.utilities = new Utilities();
			this.sidebar = sidebar;
			this.router = router;

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