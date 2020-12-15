// ordering by fields of blogs
// return list of blogs
// allow filtering of blogs

import { Injectable } from '@angular/core';
import { Utilities } from '../helpers/utilites'

@Injectable({
    providedIn: 'root',
})
export class BlogService {
    utilities: any;
    blogs: any[] = [];

    constructor() {
        this.utilities = new Utilities();
    }

    // displayname: "Variables And Scope"
    // id: "JavaScriptVariablesAndScope"
    // subtags: ""
    // tag: "JavaScript"
    // timestamp: "13 Jun 2020"
    // updated: ""

    async sortByDisplayName(ascending: boolean) {
        const blogs = await this.getBlogInfo();
        const blogByName = this.sortPostsByProperty(blogs, 'displayname', 'timestamp', ascending);
        return blogByName;
    }

    async sortByDate(ascending: boolean) {
        const blogs = await this.getBlogInfo();
        const blogByName = this.sortPostsByProperty(blogs, 'timestamp', 'timestamp', ascending);
        return blogByName;
    }

    async sortByTag(ascending: boolean) {
        const blogs = await this.getBlogInfo();
        const blogByName = this.sortPostsByProperty(blogs, 'tag', 'timestamp', ascending);
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
        const postsByDisplayName = await this.sortByDisplayName(true);

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
}