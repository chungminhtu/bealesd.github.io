import { BlogPostIndex } from "./blogPostIndex.js";

export class BlogPostIndexRepo {
	constructor() {
		if (!BlogPostIndexRepo.instance) {
			this.blogPostIndex = new BlogPostIndex().get();

			BlogPostIndexRepo.instance = this;
		}
		return BlogPostIndexRepo.instance;
	}

	filterPosts(posts, tag, search_term) {
		let filteredPosts = [];
		if (tag && !search_term) {
			filteredPosts = this.filterPostsByTag(posts, tag);
		}
		else if (tag && search_term) {
			filteredPosts = this.filterPostsByTag(posts, tag);
			filteredPosts = this.filterPostsByWord(filteredPosts, search_term);
		}
		else {
			filteredPosts = this.filterPostsByWord(posts, search_term);
		}
		return filteredPosts;
	}

	filterPostsByTag(posts, tag) {
		let postsByTag = [];
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			if (post['tag'].toLocaleLowerCase() === tag.toLocaleLowerCase())
				postsByTag.push(post);
		}
		return postsByTag;
	}

	filterPostsByWord(posts, word) {
		let postsByWord = [];
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];
			if (post['displayName'].toLocaleLowerCase().includes(word.toLocaleLowerCase()))
				postsByWord.push(post);
		}
		return postsByWord;
	}

	filterPostsByRange(posts, start, end) {
		return posts.slice(start, end);
	}

	filterPostsByPage(posts, page, postsPerPage) {
		if (posts === null || posts === undefined || posts.length === 0)
			return [];

		const startIndex = (page * postsPerPage) - postsPerPage;
		const endIndex = startIndex + postsPerPage;
		let paginatedPosts = this.filterPostsByRange(posts, startIndex, endIndex);

		return paginatedPosts;
	}

	soughtPostsByProperty(property) {
		// deep copy posts
		return [...this.blogPostIndex].sort((a, b) => {
			let x, y;
			if (property === 'timestamp') {
				x = Date.parse(a['timestamp']) * -1;
				y = Date.parse(b['timestamp']) * -1;
			}
			else {
				x = a[property].toLowerCase();
				y = b[property].toLowerCase();
			}

			return x < y ? -1 : x > y ? 1 : 0;
		})
	}

	getPostByTags() {
		// sought by displayName
		const postsByDisplayName = this.soughtPostsByProperty('displayName');

		let postsByTag = {};
		for (let i = 0; i < postsByDisplayName.length; i++) {
			const post = postsByDisplayName[i];
			if (post['tag'] in postsByTag) {
				postsByTag[post['tag']].push(post)
			}
			else {
				postsByTag[post['tag']] = [post];
			}
		}
		//group by tag
		const orderedTags = Object.keys(postsByTag).sort((a, b) => {
			let x = a.toLowerCase();
			let y = b.toLowerCase();
			return x < y ? -1 : x > y ? 1 : 0;
		})
		let orderedPostsByTag = {};
		for (let i = 0; i < orderedTags.length; i++) {
			const orderedTag = orderedTags[i];
			orderedPostsByTag[orderedTag] = postsByTag[orderedTag];
		}

		return orderedPostsByTag;
	}
}