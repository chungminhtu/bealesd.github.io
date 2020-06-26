import { Router } from './router.js';

import { BlogPostController } from './blogPostController.js';
import { BlogPostIndexRepo } from './blogPostIndexRepo.js';

import { Sidebar } from './sidebar.js';
import { BlogPostIndexController } from './blogPostIndexController.js';

import { Toasts } from './toasts.js';
import { Utilities } from './utilites.js';

// TODO add posts per page option, it would reset to page one, but keep the current search and tags

export class Startup {
	constructor() {
		this.router = new Router();

		this.blogPostController = new BlogPostController();
		this.blogPostIndexRepo = new BlogPostIndexRepo();		

		this.sidebar = new Sidebar(this.blogPostIndexRepo.blogPostIndex, this.router, this.blogPostController);
		new BlogPostIndexController(this.router, this.sidebar, this.blogPostController);

		this.utilities = new Utilities();
		this.toasts = new Toasts();

		window.addEventListener('DOMContentLoaded', async () => {
			window.events = window.events || {};
			const orderedPostsByTag = this.blogPostIndexRepo.getPostByTags();
			this.sidebar.setup(orderedPostsByTag);
			await this.router.routeUrl();
		});

		window.onpopstate = async function () {
			await this.router.routeUrl();
		};
	}
}