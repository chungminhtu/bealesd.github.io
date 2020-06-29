import { BlogPostIndexRepo } from './blogPostIndexRepo.js';

import { Toasts } from './toasts.js';
import { Utilities } from './utilites.js';

export class BlogPostIndexController {
	constructor(router, sidebar) {
		if (!BlogPostIndexController.instance) {
			this.allPosts = [];

			this.searchTerm = "";
			this.tag = "";

			this.page = 1;
            this.postsPerPage = 3;
            
			this.router = router;
			this.router.routes[''] = () => { this.onListPostsLoad(); };
			this.router.routes['blog'] = () => { this.onListPostsLoad(); };

			this.sidebar = sidebar;

            this.postsRepo = new BlogPostIndexRepo();
			this.toasts = new Toasts();
			this.utilities = new Utilities();

			BlogPostIndexController.instance = this;
		}
		return BlogPostIndexController.instance;
	}

	getAllPosts() {
		return this.postsRepo.blogPostIndex;
	}

	setupPageNumbers(posts) {
		let pages = 0;
		if (posts === null || posts === undefined || posts.length === 0)
			pages = 0;
		else
			pages = Math.ceil(posts.length / this.postsPerPage);

		this.positionPageNumbers();

		const div = document.querySelector('.pageNumber');
		let anchor = '';
		for (let p = 1; p <= pages; p++) {
			anchor += `<a data-page="${p}">${p}</a>`;
		}
		div.innerHTML = anchor;

		this.utilities.managedResize('pageNumbersResize', () => {
			this.positionPageNumbers();
		});

		this.onClickPage();
		this.changeActivePageLink();
	}

	positionPageNumbers() {
		let spacing = getComputedStyle(document.documentElement).getPropertyValue('--page-number-width-spacing').trim();
		spacing = parseInt(spacing.slice(0, spacing.length - 2));

		let pageNumberWidth = getComputedStyle(document.documentElement).getPropertyValue('--page-number-width').trim();
		pageNumberWidth = parseInt(pageNumberWidth.slice(0, pageNumberWidth.length - 2));

		let totalPageNumberWidth = this.page * (pageNumberWidth + spacing);

		let sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
		sidebarWidth = parseInt(sidebarWidth.slice(0, sidebarWidth.length - 2));

		let marginLeft = sidebarWidth + ((window.innerWidth - (sidebarWidth + totalPageNumberWidth)) / 2)
		marginLeft = window.innerWidth < 700 ? 'auto' : `${marginLeft}px`;
		document.querySelector('.pageNumber').style.marginLeft = marginLeft;
	}

	changeActivePageLink() {
		document.querySelectorAll('.pageNumber > a').forEach((anchor) => {
			anchor.classList.remove("active");
		});

		const anchor = document.querySelector(`.pageNumber > [data-page="${this.page}"]`);
		anchor.classList.add("active");
	}

	onClickPage() {
		document.querySelectorAll('.pageNumber > a').forEach((anchor) => {
			anchor.addEventListener('click', () => {
				const page = parseInt(anchor.dataset.page) ? parseInt(anchor.dataset.page) : 0;
				this.page = page;
				this.reloadMain(this.tag, this.searchTerm);
			});
		});
	}

	setupBlogPostLinks(posts) {
		this.drawBlogPostLinks(posts);
		this.registerBlogPostLinkEvents();
	}

	drawBlogPostLinks(posts) {
		let html = this.generateBlogPostLinksHtml(posts);
		this.updateBlogPostLinks(html);
	}
	generateBlogPostLinksHtml(posts) {
		let postsHtml = '';
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			const postHtml = this.generateBlogPostLinkHtml(
				post['timestamp'],
				post['id'],
				post['displayName'],
				post['tag']);

			postsHtml += postHtml;
		}
		return postsHtml;
	}

	generateBlogPostLinkHtml(timestamp, id, displayName, tag) {
		return `
			<div class="postLinkDiv">
				<p class="timestamp">${timestamp}</p>
				<a class="postLink" id="${id}">${displayName}</a>
				<div class="tags">
					<em id='${tag}'>#${tag}</em>
				</div>
			</div>
			`;
	}

	updateBlogPostLinks(blogPostLinksHtml) {
		document.querySelectorAll('.postLinkDiv').forEach((postLinkDiv) => {
			postLinkDiv.remove();
		});

		const div = document.createElement('div');
		div.innerHTML = blogPostLinksHtml;

		const blogPostLinkDivs = div.querySelectorAll('.postLinkDiv');
		for (let i = blogPostLinkDivs.length - 1; i >= 0; i--) {
			const blogPostLink = blogPostLinkDivs[i];
			document.querySelector('#template').prepend(blogPostLink);
		}
	}

	registerBlogPostLinkEvents() {
		this.registerBlogPostTagClickEvent();
		this.registerBlogPostLinkClickEvent();
	}

	registerBlogPostTagClickEvent() {
		document.querySelectorAll('.tags > em').forEach((tag) => {
			this.utilities.addEvent("click", tag, (event) => {
				if (this.toasts.toasts.map((t) => { return t.split(':')[0] }).includes(event.srcElement.id)) {
					const toastId = this.toasts.toasts.filter((t) => { return t.split(':')[0] === event.srcElement.id })[0];
					this.toasts.removeToast(toastId);
					this.reloadMain('', this.searchTerm);
				}
				else {
					this.tag = event.srcElement.id;
					this.toasts.addToast('alert-info', `Tag: ${this.tag}`, this.tag, (tag) => { this.reloadMain(tag, this.searchTerm); });
				}
			});
		});
	}

	registerBlogPostLinkClickEvent() {
		document.querySelectorAll('.postLink').forEach((blogPostLink) => {
			this.utilities.addEvent("click", blogPostLink, async (event) => {
				this.router.changeUri(`blog\\${event.srcElement.id}`);
				this.router.routeUrl();
			});
		})
	}

	reloadMain(tag, searchTerm) {
		this.tag = tag;
		this.searchTerm = searchTerm;

		let posts = this.postsRepo.filterPosts(this.allPosts, this.tag, this.searchTerm);

		let paginatedPosts = this.postsRepo.filterPostsByPage(posts, this.page, this.postsPerPage);
		if (paginatedPosts.length === 0) {
			this.page = 1;
			paginatedPosts = this.postsRepo.filterPostsByPage(posts, this.page, this.postsPerPage);
		}

		this.setupBlogPostLinks(paginatedPosts);

		this.setupPageNumbers(posts);
	}

	onListPostsLoad() {
		this.allPosts = this.postsRepo.soughtPostsByProperty('timestamp');

		this.router.changeUri('/blog');

		const paginateHtml =
			`
			<div class='paginate'>
				<div class='later'>previous</div>				
				<div class='earlier'>next</div>
			</div>
	
			<div class='pageNumber'>
			</div>
			`;

		this.utilities.updateTemplate(paginateHtml);

		const input = document.querySelector(`#searchInput`);
		input.hidden = false;
		input.focus();
		input.value = '';
		input.value = this.searchTerm;

		this.reloadMain(this.tag, input.value);

		this.registerSearchInputEvent();
		this.registerChangePageClick();
	}

	registerSearchInputEvent() {
		this.utilities.addEvent('input', document.querySelector(`#searchInput`), (event) => {
			this.searchTerm = event.srcElement.value;
			this.reloadMain(this.tag, this.searchTerm);
		});
	}
	registerChangePageClick() {
		document.querySelectorAll('.paginate').forEach((paginate) => {
			this.utilities.addEvent("click", paginate, (event) => {
				if (event.srcElement.classList.contains('later')) {
					// backwards
					const currentPage = this.page;

					if (currentPage === 1) {
						alert('No older posts!');
					}
					else {
						this.page--;
						this.reloadMain(this.tag, this.searchTerm);
					}
				}
				else if (event.srcElement.classList.contains('earlier')) {
					// forwards
					const posts = this.postsRepo.filterPosts(this.allPosts, this.tag, this.searchTerm);
					const postsCount = posts.length;

					const currentPage = this.page;
					if (currentPage * this.postsPerPage >= postsCount) {
						alert('No newer posts!');
					}
					else {
						this.page++;
						this.reloadMain(this.tag, this.searchTerm);
					}
				}
			});
		});
	}
}