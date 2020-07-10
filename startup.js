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
		console.log('in startup js');
		this.router = new Router();
		console.log('router done');
		this.blogPostIndexRepo = new BlogPostIndexRepo();		
		console.log('blogPostIndexRepo done');
		this.sidebar = new Sidebar(this.router, this.blogPostIndexRepo.blogPostIndex);
		console.log('sidebar done');
		this.blogPostController = new BlogPostController(this.sidebar, this.router, this.blogPostIndexRepo.blogPostIndex);
		console.log('blogPostController done');
		new BlogPostIndexController(this.router, this.sidebar);
		console.log('BlogPostIndexController done');
		this.utilities = new Utilities();
		this.toasts = new Toasts();
		console.log('toasts done');
		window.addEventListener('DOMContentLoaded', async () => {
			window.events = window.events || {};
			const orderedPostsByTag = this.blogPostIndexRepo.getPostByTags();
			this.sidebar.setup(orderedPostsByTag);
			console.log('sidebar setup done');
			await this.router.routeUrl();
		});

		window.onpopstate = async function () {
			await this.router.routeUrl();
		};
	}
}