import { Utilities } from "./utilites.js";

export class Sidebar {
    constructor(blogPostIndex, router, blogPostController) {
        if (!Sidebar.instance) {
            this.blogPostIndex = blogPostIndex;
            this.router = router;
            this.blogPostController = blogPostController;

            this.utilities = new Utilities();

            Sidebar.instance = this;
        }
        return Sidebar.instance;
    }

    setup(orderedPostsByTag) {
        this.addBlogPostLoadRoutes();

        document.querySelector('.sidebar').innerHTML = this.drawSidebar(orderedPostsByTag);

        this.registerHomePageClick();
        this.registerBlogPostClick();

        this.registerAccordionEvents();
        this.registerHamburgerEvents();

        this.registerResizeEvents();
    }

    addBlogPostLoadRoutes(){
        for (let i = 0; i < this.blogPostIndex.length; i++) {
            const postJson = this.blogPostIndex[i];
            const routeId = postJson['id'];
            this.router.routes[routeId] = () => {
                this.blogPostController.loadPostContent(routeId, () => {
                    this.showPostInSidebar(routeId)
                });
            }
        }
    }

    registerHamburgerEvents() {
        //TODO container is a poor name for hamburger
        this.utilities.addEvent('click', document.querySelector('.container'), () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar.style.display === 'block')
                sidebar.style.display = 'none';
            else
                sidebar.style.display = 'block';

            let hamburgerSlices = document.querySelector('.container').children;
            for (let i = 0; i < hamburgerSlices.length; i++) {
                const hamburgerSlice = hamburgerSlices[i];
                if (hamburgerSlice.classList.contains("change"))
                    hamburgerSlice.classList.remove("change");
                else
                    hamburgerSlice.classList.add("change");
            }
        })
    }

    registerHomePageClick() {
        this.utilities.addEvent("click", document.querySelector('#blog'), async () => {
            this.collapseSidebar();
            this.router.changeUri('/blog');
            await this.router.routeUrl();
        });
    }

    registerBlogPostClick() {
        document.querySelectorAll('.bar-link.sub-header').forEach((link) => {
            this.utilities.addEvent("click", link, async (event) => {
                this.router.changeUri(`blog\\${event.srcElement.id}`);
                this.router.routeUrl();
            });
        });
    }

    registerResizeEvents() {
        this.utilities.managedResize('sideBarOn', () => {
            const sidebar = document.querySelector('.sidebar');
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            let sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-off-width').trim();
            sidebarWidth = sidebarWidth.slice(0, sidebarWidth.length - 2);

            if (sidebar.style.display === 'none' && width > sidebarWidth)
                document.querySelector('.container').click();
        })
    }

    registerAccordionEvents() {
        document.querySelectorAll('.accordion').forEach((link) => {
            this.utilities.addEvent("click", link, () => {
                //shown sublinks
                if (!link.nextSibling.classList.contains("show")) {
                    link.nextSibling.classList.add("show");
                    link.querySelector('span').classList.add("down");

                    link.nextSibling.classList.remove("hide");
                    link.querySelector('span').classList.remove("up");
                }
                //hide sublinks
                else if (link.nextSibling.classList.contains("show")) {
                    link.nextSibling.classList.remove("show")
                    link.querySelector('span').classList.remove("down");

                    link.nextSibling.classList.add("hide");
                    link.querySelector('span').classList.add("up");
                }
            });
        });
    }

    drawSidebar(orderedPostsByTag) {
        let html = `<a class='bar-item bar-link header' id='blog'>Home</a>`;
        const orderedPostsByTagKeys = Object.keys(orderedPostsByTag);
        for (let i = 0; i < orderedPostsByTagKeys.length; i++) {
            const orderedPostsByTagKey = orderedPostsByTagKeys[i];
            const postArray = orderedPostsByTag[orderedPostsByTagKey];
            html += `<a class='bar-item header accordion' data-id='${orderedPostsByTagKey}'>${orderedPostsByTagKey}<span class='up'>&#10148;</span></a><div class='hide'>`;
            for (let j = 0; j < postArray.length; j++) {
                const postValue = postArray[j];
                html += `<a class='bar-item bar-link sub-header' id='${postValue['id']}'>${postValue['displayName']}</a>`
            }
            html += '</div>';
        }
        return html;
    }

    showPostInSidebar(postId) {
        const tag = this.blogPostIndex.filter((post) => { return post.id === postId })[0].tag;
        const menuHeader = document.querySelector(`[data-id="${tag}"]`);

        menuHeader.nextSibling.classList.remove("hide");
        menuHeader.nextSibling.classList.add("show");

        menuHeader.querySelector('span').classList.remove("up");
        menuHeader.querySelector('span').classList.add("down");

        document.querySelectorAll(`.activated-link`).forEach((al) => { al.classList.remove('activated-link') });
        document.querySelector(`#${postId}`).classList.add('activated-link');
    }

    collapseSidebar() {
        document.querySelectorAll(`.sidebar span`).forEach((span) => {
            span.classList.remove("down");
            span.classList.add("up");
        })

        document.querySelectorAll(`.sidebar .show`).forEach((subHeaders) => {
            subHeaders.classList.remove("show");
            subHeaders.classList.add("hide");
        })

        document.querySelectorAll(`.activated-link`).forEach((al) => { al.classList.remove('activated-link') });
    }

    exapndSidebar() {
        document.querySelectorAll(`.sidebar span`).forEach((span) => {
            span.classList.remove("up");
            span.classList.add("down");
        })

        document.querySelectorAll(`.sidebar .hide`).forEach((subHeaders) => {
            subHeaders.classList.remove("hide");
            subHeaders.classList.add("show");
        })
    }

}