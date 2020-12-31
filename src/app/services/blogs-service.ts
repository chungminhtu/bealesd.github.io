import { Injectable } from '@angular/core';
import { Utilities } from '../helpers/utilites'
import { BlogRepo } from './blogRepo';

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    utilities: any;
    blogs: any[] = [];
    filters = { tags: [], words: '' };
    sort = {
        current: 'timestamp',
        name: false,
        tag: false,
        timestamp: false,
    }

    constructor(public blogRepo: BlogRepo) {
        this.utilities = new Utilities();
    }

    resetFilters() {
        this.filters = { tags: [], words: '' };
        this.blogs = [];
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

    getCurrentBlogs() {
        let blogs = this.blogRepo.getPostsBySearchTermAndTag(this.filters.words, this.filters.tags);

        // sort blogs
        if (this.sort.current === 'name')
            blogs = this.sortByDisplayName(blogs, this.sort.name);
        else if (this.sort.current === 'tag')
            blogs = this.sortByTag(blogs, this.sort.tag);
        else if (this.sort.current === 'timestamp')
            blogs = this.sortByDate(blogs, this.sort.timestamp);

        return blogs;
    }

    getBlogInfo() {
        return this.blogRepo.blogs;
    }

}