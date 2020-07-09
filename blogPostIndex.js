export class BlogPostIndex {
    constructor() {
        if (!BlogPostIndex.instance) {
            BlogPostIndex.instance = this;
        }
        return BlogPostIndex.instance;
    }
    get() {
        const blogPostIndex = [
            {
                'id': 'JavaScriptVariablesAndScope',
                'displayname': 'Variables And Scope',
                'tag': 'JavaScript',
                'subtags': '',
                'timestamp': '13 Apr 2018'
                // TODO get timestamp dynamically
            },
            {
                'id': 'JavaScriptPromises',
                'displayname': 'Promises',
                'tag': 'JavaScript',
                'subtags': '',
                'timestamp': '13 May 2018'
            },
            {
                'id': 'AzureVariables',
                'displayname': 'Variables',
                'tag': 'Azure',
                'subtags': '',
                'timestamp': '13 May 2020'
            },
            {
                'id': 'AzureVariables2',
                'displayname': 'Variables2',
                'tag': 'Azure',
                'subtags': '',
                'timestamp': '13 May 2020'
            },
            {
                'id': 'EventCRUD',
                'displayname': 'Events CRUD',
                'tag': 'JavaScript',
                'subtags': '',
                'timestamp': '13 May 2020'
            }
        ];
        return blogPostIndex;
    }
}