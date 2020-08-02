import { BlogPostIndexRepo } from './blogPostIndexRepo.js';

import { Toasts } from './toasts.js';
import { Utilities } from './utilites.js';

export class BlogPostIndexController {
    constructor(router, sidebar) {
        return (async() => {
            if (!BlogPostIndexController.instance) {
                this.pageNumberElement = '.pageNumber';
                this.blogPostSortElement = '#blogPostSort';
                this.postLinkDivContainerElement = '#postLinkDivContainer';
                this.postPerPageInputElement = '#postPerPageInput';
                this.postsPerPageContainerElement = '#postsPerPageContainer';
                this.postsPerPageElement = '#postsPerPage';
                this.searchInputElement = '#searchInput';
                this.paginateElement = '.paginate';

                this.allPosts = [];
                this.filteredPosts = [];
                this.orderProperty = 'timestamp';
                this.ascending = false;

                this.searchTerm = "";
                this.tag = "";

                this.pageNumber = 1;
                this.postPerPageSteps = [1, 3, 5, 10, 25, 50];
                this.postsPerPageStep = 1;
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

        this.drawPageNumbers(pageCount);

        if (pageCount > 0) {
            this.onClickPage();
            this.changeActivePageLink();
        }
    }

    drawPageNumbers(pageCount) {
        const startPage = this.pageNumber - 5 > 0 ? this.pageNumber - 5 : 1;
        const endPage = startPage + 9 <= pageCount ? startPage + 9 : pageCount;
        const div = document.querySelector(this.pageNumberElement);
        for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            const anchor = document.createElement('a');
            anchor.setAttribute('data-page', `${pageNumber}`);
            anchor.innerHTML = `${pageNumber}`
            div.append(anchor);
        }
    }

    changeActivePageLink() {
        document.querySelectorAll(`${this.pageNumberElement} > a`).forEach((pageNumber) => {
            pageNumber.classList.remove('active');
        });

        const pageNumber = document.querySelector(`${this.pageNumberElement} > [data-page="${this.pageNumber}"]`);
        pageNumber.classList.add('active');
    }

    onClickPage() {
        document.querySelectorAll(`${this.pageNumberElement} > a`).forEach((anchor) => {
            anchor.addEventListener('click', () => {
                this.pageNumber = parseInt(anchor.dataset.page) ? parseInt(anchor.dataset.page) : 0;
                this.reloadPageContent(this.tag, this.searchTerm);
            });
        });
    }

    setupBlogPostLinks(posts) {
        this.drawBlogPostLinks(posts);
        document.querySelector(`${this.blogPostSortElement}`).hidden = false;
        this.registerBlogPostLinkEvents();
    }

    drawBlogPostLinks(posts) {
        let html = this.generateBlogPostLinksHtml(posts);
        this.updateBlogPostLinks(html);
    }

    generateBlogPostLinksHtml(posts) {
        let postsHtml = '<div id="postLinkDivContainer">';
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            const postHtml = this.generateBlogPostLinkHtml(
                post['timestamp'],
                post['updated'],
                post['id'],
                post['displayname'],
                post['tag']);

            postsHtml += postHtml;
        }
        postsHtml += '</div>'
        return postsHtml;
    }

    generateBlogPostLinkHtml(timestamp, updated, id, displayName, tag, index) {
        const uuid = this.utilities.uuidv4();
        const tagId = `tag-${tag}-${uuid}`;
        let time = '';
        if (updated.length > 0) {
            time = `${timestamp}&nbsp&nbsp<i>updated: ${updated}</i>`;
        } else {
            time = timestamp;
        }
        return `
			<div class="postLinkDiv">
				<p class="timestamp">${time}</p>
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

        const blogPostLinkDivs = div.querySelectorAll('#postLinkDivContainer');
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

    registerChangeNumberOfPostsPerPageEvent() {
        const input = document.querySelector(`${this.postsPerPageContainerElement}>form>input`);
        const label = document.querySelector(`${this.postsPerPageElement} label`);
        this.utilities.removeEvent(input, `${input.id}-label`);
        this.utilities.removeEvent(input, `${input.id}-value`);

        // input.addEventListener("input", event => {
        //     const value = Number(input.value) / 100;
        //     input.style.setProperty("--thumb-rotate", `${value * 720}deg`);
        //     label.innerHTML = Math.round(value * 50);
        //   });

        this.utilities.addEvent(`${input.id}-label`, 'input', input, (event) => {
            label.innerHTML = this.postPerPageSteps[input.value];
        });

        this.utilities.addEvent(`${input.id}-value`, 'change', input, (event) => {
            this.postsPerPageStep = input.value;
            this.postsPerPage = this.postPerPageSteps[this.postsPerPageStep];
            this.onChangeNumberOfPostsPerPageClick();
        });
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

    onChangeNumberOfPostsPerPageClick() {
        // this.postsPerPage = parseInt(event.srcElement.value);
        this.reloadPageContent();
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
        arrow.className = '';

        if (arrowType === 'up') {
            arrow.classList.add('down');
            arrow.innerHTML = arrowDown;
        } else {
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
        } else {
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
            this.utilities.addEvent(blogPostLink.id, "click", blogPostLink, async(event) => {
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

        this.updatePostPerPageInput();
        this.registerChangeNumberOfPostsPerPageEvent();
    }

    setupChangePage() {
        if (this.filteredPosts.length > 0) {
            const paginateHtml = `
                <div id='pageControls'>
                    <div id='${this.postsPerPageContainerElement.slice(1)}'>
                        <form id="${this.postsPerPageElement.slice(1)}">
                            <input id="${this.postPerPageInputElement.slice(1)}" type="range" min="0" max="${this.postPerPageSteps.length - 1}" value='2'>
                            
                            <div class="module-border-wrap"><div class="module">
                                <label for="${this.postPerPageInputElement.slice(1)}">0</label>
                            </div></div>

                        </form>
                    </div>
                    
                    <div class='paginate'>
                        <a id='paginate-later' class='later'>prev</a>
                        <div class='pageNumber'></div>				
                        <a id='paginate-earlier' class='earlier'>next</a>
                    </div>
                    
                </div>
            `;



            this.utilities.appendPageContent(paginateHtml);

            const label = document.querySelector(`${this.postsPerPageElement} label`);

            label.innerHTML = this.postPerPageSteps[this.postsPerPageStep];

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

    updatePostPerPageInput() {
        const input = document.querySelector(this.postPerPageInputElement);
        input.hidden = false;
        input.value = '';
        input.value = this.postsPerPageStep;
    }

    updateSearchInput() {
        const input = document.querySelector(this.searchInputElement);
        input.hidden = false;
        input.focus();
        input.value = '';
        input.value = this.searchTerm;
    }

    registerSearchInputEvent() {
        const input = document.querySelector(this.searchInputElement);
        this.utilities.addEvent(input.id, 'input', input, (event) => {
            this.searchTerm = event.srcElement.value;
            this.reloadPageContent();
        });
    }

    registerChangePageClick() {
        document.querySelectorAll(`${this.paginateElement} > a`).forEach((paginate) => {
            this.utilities.removeEvent(paginate, paginate.id);

            this.utilities.addEvent(paginate.id, 'click', paginate, (event) => {
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
        } else {
            this.pageNumber--;
            this.reloadPageContent();
        }
    }

    onLoadNextPage() {
        const filteredPostsCount = this.filteredPosts.length;
        const currentPage = this.pageNumber;
        if (currentPage * this.postsPerPage >= filteredPostsCount) {
            alert('No newer posts!');
        } else {
            this.pageNumber++;
            this.reloadPageContent();
        }
    }
}