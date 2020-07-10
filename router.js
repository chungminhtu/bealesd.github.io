export class Router {
    constructor() {
        if (!Router.instance) {
            this.routes = {};
            Router.instance = this;
        }
        return Router.instance;
    }

    async routeUrl() {
		const suffix = this.getUrlSuffix();
       
        this.routes[suffix]();
	}

    getUrlSuffix() {
        let url = window.location.href;
        let urlSuffixRegex = url.match(/[A-Za-z]+\.html/);
        return urlSuffixRegex !== null ? urlSuffixRegex[0].slice(0, -5) : "";
    }

    getFullUrlSuffix() {
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
        let prefix = this.getUrlPrefix().split('\\');

		history.pushState({}, null, `${uri}.html`);
	}
}