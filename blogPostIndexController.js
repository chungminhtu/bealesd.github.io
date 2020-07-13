import { BlogPostIndexRepo } from './blogPostIndexRepo.js';

import { Toasts } from './toasts.js';
import { Utilities } from './utilites.js';

export class BlogPostIndexController {
	constructor(router, sidebar) {
		return (async () => {
			if (!BlogPostIndexController.instance) {
				this.allPosts = [];
				this.filteredPosts = [];
				this.orderProperty = 'timestamp';
				this.ascending = false;

				this.searchTerm = "";
				this.tag = "";

				this.pageNumber = 1;
				this.postsPerPage = 3;

				this.router = router;
				this.router.routes[''] = () => { this.onListPostsLoad(); };
				this.router.routes['blog'] = () => { this.onListPostsLoad(); };

				this.sidebar = sidebar;

				this.postsRepo = await new BlogPostIndexRepo();
				this.toasts = new Toasts();
				this.utilities = new Utilities();

				BlogPostIndexController.instance = this;
			}
			return BlogPostIndexController.instance;
		})();

	}

	getAllPosts() {
		return this.postsRepo.blogPostIndex;
	}

	setupPageNumbers() {
		let pageCount = 0;
		if (this.filteredPosts.length === 0)
			pageCount = 0;
		else
			pageCount = Math.ceil(this.filteredPosts.length / this.postsPerPage);

		this.positionPageNumbers();

		this.drawPageNumbers(pageCount);

		if (pageCount > 0) {
			this.utilities.managedResize('pageNumbersResize', () => {
				this.positionPageNumbers();
			});

			this.onClickPage();
			this.changeActivePageLink();
		}
	}

	drawPageNumbers(pageCount) {
		const div = document.querySelector('.pageNumber');
		let anchor = '';
		for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
			anchor += `<a data-page="${pageNumber}">${pageNumber}</a>`;
		}
		div.innerHTML = anchor;
	}

	positionPageNumbers() {
		let spacing = getComputedStyle(document.documentElement).getPropertyValue('--page-number-width-spacing').trim();
		spacing = parseInt(spacing.slice(0, spacing.length - 2));

		let pageNumberWidth = getComputedStyle(document.documentElement).getPropertyValue('--page-number-width').trim();
		pageNumberWidth = parseInt(pageNumberWidth.slice(0, pageNumberWidth.length - 2));

		let totalPageNumberWidth = this.pageNumber * (pageNumberWidth + spacing);

		let sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
		sidebarWidth = parseInt(sidebarWidth.slice(0, sidebarWidth.length - 2));

		let marginLeft = sidebarWidth + ((window.innerWidth - (sidebarWidth + totalPageNumberWidth)) / 2)
		marginLeft = window.innerWidth < 700 ? 'auto' : `${marginLeft}px`;
		document.querySelector('.pageNumber').style.marginLeft = marginLeft;
	}

	changeActivePageLink() {
		document.querySelectorAll('.pageNumber > a').forEach((pageNumber) => {
			pageNumber.classList.remove("active");
		});

		const pageNumber = document.querySelector(`.pageNumber > [data-page="${this.pageNumber}"]`);
		pageNumber.classList.add("active");
	}

	onClickPage() {
		document.querySelectorAll('.pageNumber > a').forEach((anchor) => {
			anchor.addEventListener('click', () => {
				this.pageNumber = parseInt(anchor.dataset.page) ? parseInt(anchor.dataset.page) : 0;
				this.reloadPageContent(this.tag, this.searchTerm);
			});
		});
	}

	setupBlogPostLinks(posts) {
		this.drawBlogPostLinks(posts);
		document.querySelector('#blogPostSort').hidden = false;
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
				post['displayname'],
				post['tag']);

			postsHtml += postHtml;
		}
		return postsHtml;
	}

	generateBlogPostLinkHtml(timestamp, id, displayName, tag, index) {
		const uuid = this.utilities.uuidv4();
		const tagId = `tag-${tag}-${uuid}`;
		return `
			<div class="postLinkDiv">
				<p class="timestamp">${timestamp}</p>
				<a class="postLink" id="postLink-${id}">${displayName}</a>
				<div class="tags">
					<em id='${tagId}'>#${tag}</em>
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
			document.querySelector('#pageContent').prepend(blogPostLink);
		}
	}

	registerBlogPostLinkEvents() {
		this.registerBlogPostTagClickEvent();
		this.registerBlogPostLinkClickEvent();
		this.registerBlogPostSortEvents();
	}

	registerBlogPostTagClickEvent() {
		this.utilities.removeEventKeys('tag-');

		document.querySelectorAll('.tags > em').forEach((tag) => {
			this.utilities.removeEvent(tag, tag.id);
			this.utilities.addEvent(tag.id, "click", tag, (event) => {
				this.onBlogPostTagClick();
			});
		});
	}

	registerBlogPostSortEvents() {
		document.querySelectorAll('#blogPostSort > .sort').forEach((sortProperty) => {
			this.utilities.addEvent(sortProperty.id, "click", sortProperty, (event) => {
				this.onBlogPostSortClick();
			});
		});
	}

	onBlogPostSortClick() {
		document.querySelectorAll('#blogPostSort > .sort').forEach((sortProperty) => {
			sortProperty.classList.remove('sortActive');
			sortProperty.querySelector('span').hidden = true;
		});

		event.srcElement.classList.add('sortActive');

		const arrowUp = '&#8638';
		const arrowDown = '&#8642';

		const arrow = event.srcElement.querySelector('span');
		arrow.hidden = false;

		const arrowType = arrow.classList[0];
		arrow.className = "";

		if (arrowType === 'up') {
			arrow.classList.add('down');
			arrow.innerHTML = arrowDown;
		}

		else {
			arrow.classList.add('up');
			arrow.innerHTML = arrowUp;
		}


		const previousOrderProperty = this.orderProperty;
		this.orderProperty = event.srcElement.id.substring('sort-'.length).toLowerCase();

		if (this.orderProperty === previousOrderProperty)
			this.ascending = !this.ascending;
		else
			this.ascending = true;

		this.reloadPageContent();
	}

	onBlogPostTagClick() {
		let tagName = event.srcElement.id.split('tag-')[1].split('-')[0]
		const isTagActive = this.toasts.toasts.map((t) => { return t.split(':')[0] }).includes(tagName);
		if (isTagActive) {
			const toastId = this.toasts.toasts.filter((t) => { return t.split(':')[0] === tagName })[0];
			this.toasts.removeToast(toastId);
			this.tag = '';
			this.reloadPageContent();
		}
		else {
			this.tag = tagName;
			this.toasts.addToast('alert-info', `Tag: ${this.tag}`, this.tag, () => {
				this.tag = '';
				this.reloadPageContent();
			});
			this.reloadPageContent();
		}
	}

	registerBlogPostLinkClickEvent() {
		document.querySelectorAll('.postLink').forEach((blogPostLink) => {
			this.utilities.removeEvent(blogPostLink, blogPostLink.id);
			this.utilities.addEvent(blogPostLink.id, "click", blogPostLink, async (event) => {
				this.router.changeUri(`blog/${event.srcElement.id}`);
				this.router.routeUrl();
			});
		})
	}

	reloadPageContent() {
		this.filteredPosts = this.postsRepo.filterPosts(this.allPosts, this.tag, this.searchTerm);
		const sortedPosts = this.postsRepo.sortPostsByProperty(this.filteredPosts, this.orderProperty.toLowerCase(), undefined, this.ascending);

		document.querySelectorAll('#blogPostSort > .sort').forEach((sortProperty) => { sortProperty.classList.remove('sortActive'); });
		document.querySelector(`#sort-${this.orderProperty.toLowerCase()}`).classList.add('sortActive');

		let currentPagePosts = this.postsRepo.filterPostsByPage(sortedPosts, this.pageNumber, this.postsPerPage);

		if (currentPagePosts.length === 0) {
			this.pageNumber = 1;
			currentPagePosts = this.postsRepo.filterPostsByPage(this.filteredPosts, this.pageNumber, this.postsPerPage);
		}

		this.utilities.clearPageContent();
		this.setupBlogPostLinks(currentPagePosts);
		this.setupPages();
	}

	setupPages() {
		this.setupChangePage();
		this.setupPageNumbers();
	}

	setupChangePage() {
		if (this.filteredPosts.length > 0) {
			const paginateHtml = `
				<div class='paginate'>
					<div id='paginate-later' class='later'>previous</div>				
					<div id='paginate-earlier' class='earlier'>next</div>
				</div>
		
				<div class='pageNumber'>
				</div>
			`;
			this.utilities.appendPageContent(paginateHtml);
			this.registerChangePageClick();
		}
	}

	onListPostsLoad() {
		this.allPosts = this.postsRepo.blogPostIndex;

		this.router.changeUri('blog');

		this.updateSearchInput();
		this.reloadPageContent();

		this.registerSearchInputEvent();
	}

	updateSearchInput() {
		const input = document.querySelector(`#searchInput`);
		input.hidden = false;
		input.focus();
		input.value = '';
		input.value = this.searchTerm;
	}

	registerSearchInputEvent() {
		const input = document.querySelector(`#searchInput`);
		this.utilities.addEvent(input.id, 'input', input, (event) => {
			this.searchTerm = event.srcElement.value;
			this.reloadPageContent();
		});
	}

	registerChangePageClick() {
		document.querySelectorAll('.paginate > div').forEach((paginate) => {
			this.utilities.removeEvent(paginate, paginate.id);

			this.utilities.addEvent(paginate.id, "click", paginate, (event) => {
				if (event.srcElement.classList.contains('later'))
					this.onLoadPreviousPage();
				else if (event.srcElement.classList.contains('earlier'))
					this.onLoadNextPage();
			});
		});
	}

	onLoadPreviousPage() {
		const currentPage = this.pageNumber;
		if (currentPage === 1) {
			alert('No older posts!');
		}
		else {
			this.pageNumber--;
			this.reloadPageContent();
		}
	}

	onLoadNextPage() {
		const filteredPostsCount = this.filteredPosts.length;
		const currentPage = this.pageNumber;
		if (currentPage * this.postsPerPage >= filteredPostsCount) {
			alert('No newer posts!');
		}
		else {
			this.pageNumber++;
			this.reloadPageContent();
		}
	}
}