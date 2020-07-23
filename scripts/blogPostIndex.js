import { Utilities } from './utilites.js';

export class BlogPostIndex {
    constructor() {
        if (!BlogPostIndex.instance) {
            this.utilities = new Utilities();

            BlogPostIndex.instance = this;
        }
        return BlogPostIndex.instance;
    }
    async get() {
        const response = await fetch(`/blogIndex/blogPostsIndex.json`);
        let json = {};
        if (response.ok)
            json = await response.json();

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
}