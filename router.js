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
        let urlSuffix = window.location.pathname.split('\/')[window.location.pathname.split('\/').length - 1].match(/(?<=-|_).*/);
        return urlSuffix ? urlSuffix[0].match(/[\w]+(?=\.html)/)[0] : '';
    }

    getFullUrlSuffix() {
        return window.location.pathname;
    }

    getUrlPrefix() {
        return window.location.origin;
    }

    changeUri(uri) {
        uri = this.getUrlPrefix() + "/" + `${uri}.html`;
        history.pushState({}, null, uri);
    }
}