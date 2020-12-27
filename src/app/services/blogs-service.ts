import { Injectable } from '@angular/core';
import { Utilities } from '../helpers/utilites'

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    utilities: any;
    blogs: any[] = [];
    filters = { tag: '', words: '' };
    sort = {
        current: 'name',
        name: true,
        tag: false,
        timestamp: false,
    }

    constructor() {
        this.utilities = new Utilities();
    }

    sortByDisplayName(blogs, ascending: boolean) {
        const blogByName = this.sortPostsByProperty(blogs, 'displayname', 'timestamp', ascending);
        return blogByName;
    }

    sortByDate(blogs, ascending: boolean) {
        const blogByName = this.sortPostsByProperty(blogs, 'timestamp', 'timestamp', ascending);
        return blogByName;
    }

    sortByTag(blogs, ascending: boolean) {
        const blogByName = this.sortPostsByProperty(blogs, 'tag', 'displayname', ascending);
        return blogByName;
    }

    sortPostsByProperty(posts, propertyOne = 'timestamp', propertyTwo = 'displayname', propertyOneAscending = true) {
        // TODO use updated instead of timestamp for date sort.
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
        let post_A_key_1 = postA[key1].toLowerCase();
        let post_B_key_1 = postB[key1].toLowerCase();

        let post_A_key_2 = postA[key2].toLowerCase();
        let post_B_key_2 = postB[key2].toLowerCase();


        if (key1 === 'timestamp') {
            post_A_key_1 = new Date(post_A_key_1);
            post_B_key_1 = new Date(post_B_key_1);
        }

        if (key2 === 'timestamp') {
            post_A_key_2 = new Date(post_A_key_2);
            post_B_key_2 = new Date(post_B_key_2);
        }

        const post_A_before_post_B = -1;
        const post_B_before_post_A = 1;

        const post_A_before_post_B_for_key_1 = key1Ascending ? post_A_before_post_B : post_B_before_post_A;
        const post_A_before_post_B_for_key_2 = key2Ascending ? post_A_before_post_B : post_B_before_post_A;

        if (post_A_key_1 < post_B_key_1) return post_A_before_post_B_for_key_1;
        if (post_A_key_1 > post_B_key_1) return post_A_before_post_B_for_key_1 * -1;

        if (post_A_key_2 < post_B_key_2) return post_A_before_post_B_for_key_2;
        if (post_A_key_2 > post_B_key_2) return post_A_before_post_B_for_key_2 * -1;

        return 0;
    }

    async getCurrentBlogs() {
        let blogs = await this.getBlogInfo();

        // filter blogs
        blogs = this.filterPostsByWord(blogs, this.filters.words);
        blogs = this.filterPostsByTag(blogs, this.filters.tag);

        // sort blogs
        if (this.sort.current === 'name')
            blogs = this.sortByDisplayName(blogs, this.sort.name);
        else if (this.sort.current === 'tag')
            blogs = this.sortByTag(blogs, this.sort.tag);
        else if (this.sort.current === 'timestamp')
            blogs = this.sortByDate(blogs, this.sort.timestamp);

        return blogs;
    }

    async getBlogInfo() {
        const response = await fetch(`/assets/blogs/blogPostsIndex.json`);
        let json = {};
        if (response.ok)
            json = await response.json();
        else
            console.error('Failed to fetch blogPostsIndex.json');

        let blogPostIndexArray = []
        Object.keys(json).forEach((id) => {
            let index = json[id];
            if (this.utilities.dateInFuture(new Date(index['timestamp']))) {
                //dont add future date
            } else {
                index['id'] = id;
                blogPostIndexArray.push(index);
            }
        });

        return blogPostIndexArray;
    }

    async getPostByTags() {
        const blogs = await this.getBlogInfo();
        const postsByDisplayName = await this.sortByDisplayName(blogs, true);

        let postsByTag = {};
        for (let i = 0; i < blogs.length; i++) {
            const post = postsByDisplayName[i];
            if (post['tag'] in postsByTag) {
                postsByTag[post['tag']].push(post)
            } else {
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
        console.log(orderedPostsByTag);
        return orderedPostsByTag;
    }

    filterPostsByWord(blogs, word: string): any[] {
        if (word === null || word === undefined || word === '')
            return blogs;

        let postsByWord = [];
        for (let i = 0; i < blogs.length; i++) {
            const post = blogs[i];
            if (post['displayname'].toLocaleLowerCase().includes(word.toLocaleLowerCase()))
                postsByWord.push(post);
        }
        return postsByWord;
    }

    filterPostsByTag(blogs, tag: string): any[] {
        if (tag === null || tag === undefined || tag === '')
            return blogs;

        let postsByTag = [];
        for (let i = 0; i < blogs.length; i++) {
            const post = blogs[i];
            if (post['tag'].toLocaleLowerCase() === tag.toLocaleLowerCase())
                postsByTag.push(post);
        }
        return postsByTag;
    }

    //blog checks for the search filter, tags filter and any other filter.THen return results, so when asking for blogs, filters auto applied.
    //filter is updated on search input and tag changes

}