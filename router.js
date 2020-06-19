export class Router {
    constructor(postsJson, onLoadPost, onLoadPosts) {
        if (!Router.instance) {
            this.postsJson = postsJson;
            this.onLoadPost = onLoadPost;
            this.onLoadPosts = onLoadPosts;

            Router.instance = this;
        }
        return Router.instance;     
    }

    async routeUrl() {
		const suffix = this.getUrlSuffix();
		const page = this.postsJson.filter((p) => { return p['id'] === suffix; });

		if (suffix && suffix === 'blog')
			this.onLoadPosts();
		else if (suffix && page.length === 1)
			await this.onLoadPost(page[0]['id']);
		else
			this.onLoadPosts();
	}

    getUrlSuffix() {
        let url = window.location.href;
        let urlSuffixRegex = url.match(/[A-Za-z]+\.html/);
        return urlSuffixRegex !== null ? urlSuffixRegex[0].slice(0, -5) : "";
    }

    getUrlPrefix() {
        let url = window.location.href;
        let urlPrefixRegex = url.match(/[A-Za-z]+\.html/);
        return urlPrefixRegex !== null ? url.substring(0, url.indexOf(urlPrefixRegex)) : url;
    }

    changeUri(uri) {
		history.pushState({}, null, `${uri}.html`);
	}
}