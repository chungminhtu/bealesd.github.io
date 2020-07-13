import { BlogPostIndex } from "./blogPostIndex.js";

export class BlogPostIndexRepo {
	constructor() {
		return (async () => {
			if (!BlogPostIndexRepo.instance) {
				this.blogPostIndex = await new BlogPostIndex().get();
	
				BlogPostIndexRepo.instance = this;
			}
			return BlogPostIndexRepo.instance;
		})();
	}

	filterPosts(posts, tag, search_term) {
		tag = tag.toLowerCase();
		search_term = search_term.toLowerCase();

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

		return filteredPosts
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
			if (post['displayname'].toLocaleLowerCase().includes(word.toLocaleLowerCase()))
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

	sortPostsByProperty(posts, propertyOne = 'timestamp', propertyTwo = 'displayname', propertyOneAscending = true) {
		//TODO inidicate if asc or desc as well
		const propertyTwoAscending = true;
		propertyOne = propertyOne.toLowerCase();
		propertyTwo = propertyTwo.toLowerCase();

		let sorter = this.mulitSortCompare(propertyOne, propertyTwo, propertyOneAscending, propertyTwoAscending);
		const sortedPosts = [...posts].sort(sorter);

		return sortedPosts;
	}


	mulitSortCompare(key1, key2, key1Ascending, key2Ascending) {
		return (a, b) => {
			return this.multiSort(a, b, key1, key2, key1Ascending, key2Ascending);
		}
	}

	multiSort(postA, postB, key1, key2, key1Ascending, key2Ascending) {
		const post_A_key_1 = postA[key1].toLowerCase();
		const post_B_key_1 = postB[key1].toLowerCase();

		const post_A_key_2 = postA[key2].toLowerCase();
		const post_B_key_2 = postB[key2].toLowerCase();

		const post_A_before_post_B = -1;
		const post_B_before_post_A = 1;

		const post_A_before_post_B_for_key_1 = key1Ascending ? post_A_before_post_B : post_B_before_post_A;
		const post_A_before_post_B_for_key_2 = key2Ascending ? post_A_before_post_B : post_B_before_post_A;

		if (post_A_key_1 < post_B_key_1) return post_A_before_post_B_for_key_1;
		if (post_A_key_1 > post_B_key_1) return post_A_before_post_B_for_key_1 * -1;

		if (post_A_key_2 < post_B_key_2) return post_A_before_post_B_for_key_2;
		if (post_A_key_2 > post_B_key_2) return !post_A_before_post_B_for_key_2 * -1;

		return 0;
	}

	getPostByTags() {
		const postsByDisplayName = this.sortPostsByProperty(this.blogPostIndex, 'displayname');

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