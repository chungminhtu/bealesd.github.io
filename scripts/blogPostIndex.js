export class BlogPostIndex {
    constructor() {
        if (!BlogPostIndex.instance) {
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
            index['id'] = id;
            blogPostIndexArray.push(index);
        });

        return blogPostIndexArray;
    }
}