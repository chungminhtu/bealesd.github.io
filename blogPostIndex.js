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
                'displayName': 'Variables And Scope',
                'tag': 'JavaScript',
                'subtags': '',
                'timestamp': '13 Apr 2018'
                // TODO get timestamp dynamically
            },
            {
                'id': 'JavaScriptPromises',
                'displayName': 'Promises',
                'tag': 'JavaScript',
                'subtags': '',
                'timestamp': '13 May 2018'
            },
            {
                'id': 'AzureVariables',
                'displayName': 'Variables',
                'tag': 'Azure',
                'subtags': '',
                'timestamp': '13 May 2020'
            },
            {
                'id': 'AzureVariables2',
                'displayName': 'Variables2',
                'tag': 'Azure',
                'subtags': '',
                'timestamp': '13 May 2020'
            },
            {
                'id': 'AzureVariables3',
                'displayName': 'Variables3',
                'tag': 'Azure',
                'subtags': '',
                'timestamp': '13 May 2020'
            }
        ];
        return blogPostIndex;
    }
}