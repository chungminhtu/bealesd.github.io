import { Utilities } from './utilites.js';
import { Toasts } from './toasts.js';

export class BlogPostController {
    constructor(sidebar, router, blogPostIndex) {
        if (!BlogPostController.instance) {
            this.sidebar = sidebar;
            this.router = router;
            this.toasts = new Toasts();
            this.utilities = new Utilities();

            this.blogPostIndex = blogPostIndex;

            this.registerBlogPostLoadRoutes();

            BlogPostController.instance = this;
        }
        return BlogPostController.instance;
    }

    registerBlogPostLoadRoutes() {
        for (let i = 0; i < this.blogPostIndex.length; i++) {
            const postJson = this.blogPostIndex[i];
            const routeId = postJson['id'];
            this.router.routes[routeId] = () => {
                this.loadPostContent(routeId, () => {
                    this.sidebar.showPostInSidebar(routeId)
                });
            }
        }
    }

    async loadPostContent(id, showPostInSidebarCb) {
        this.utilities.removeResize('pageNumbersResize');
        this.toasts.clearToasts();

        this.utilities.updatePageContent('<div class="postContent"></div>');
        await this.loadPostMarkdownHtml(id);

        showPostInSidebarCb(id);

        document.querySelector('#searchInput').hidden = true;
        document.querySelector('#blogPostSort').hidden = true;
    }

    async loadPostMarkdownHtml(pageName) {
        const languageSelector = {
            'c': () => { return Prism.languages.c; },
            'csharp': () => { return Prism.languages.csharp; },
            'git': () => { return Prism.languages.git; },
            'html': () => { return Prism.languages.html; },
            'javascript': () => { return Prism.languages.javascript; },
            'markdown': () => { return Prism.languages.markdown; },
            'python': () => { return Prism.languages.python; },
            'powershell': () => { return Prism.languages.powershell; },
            'typescript': () => { return Prism.languages.typescript; },
            'webassembly': () => { return Prism.languages.webassembly; },
            'yaml': () => { return Prism.languages.yaml; },
        }

        const response = await fetch(`/blogs/${pageName}.md`);
        let rawMarkdown = '';
        if (!response.ok)
            rawMarkdown = '# Page not found!';
        else
            rawMarkdown = await response.text();

        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: (code, language) => {
                return Prism.highlight(code, languageSelector[language](), language);
            },
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });

        document.querySelector('.postContent').innerHTML = this.parseMardown(rawMarkdown);
    }

    parseMardown(rawMarkdown) {
        const tokens = marked.lexer(rawMarkdown);
        const codeTokens = tokens.filter(token => { return token.type === 'code'; });

        const codeBlockExampleType = this.getCodeBlockExampleType(codeTokens);
        const codeBlockHiglights = this.getCodeBlockHiglights(codeTokens);

        this.updateCodeBlockTokens(codeTokens);

        let htmlString = marked.parser(tokens);

        htmlString = this.setCodeBlockExampleType(codeBlockExampleType, htmlString);
        htmlString = this.setCodeBlockLineNumbers(htmlString);
        htmlString = this.setCodeBlockHighlights(codeBlockHiglights, htmlString);

        return htmlString;
    }

    updateCodeBlockTokens(tokens) {
        tokens.forEach((token) => {
            token['lang'] = token['lang'].split(' ')[0];
        });
    }

    getCodeBlockExampleType(tokens) {
        let codeBlockExampleType = {};
        tokens.forEach((token, index) => {
            let exampleType = 'example';
            if (token['lang'].split(' ').length > 1 && token['lang'].split(' ')[1] !== null)
                exampleType = token['lang'].split(' ')[1];
            codeBlockExampleType[`${index}`] = { 'exampleType': exampleType };
        });
        return codeBlockExampleType;
    }

    getCodeBlockHiglights(tokens) {
        let codeBlockHiglights = {};
        //TODO defines rules for different row separators, i.e. 1-5; 1,2,3; 2-; 1-5 6,7; 5;
        tokens.forEach((token, index) => {
            let rows = null;
            if (token['lang'].split(' ').length > 2 && token['lang'].split(' ')[2] !== null)
                rows = token['lang'].split(' ')[2];
            codeBlockHiglights[`${index}`] = { 'rows': rows };
        });
        return codeBlockHiglights;
    }

    setCodeBlockExampleType(codeBlockExampleType, htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre, index) => {
            const exampleType = codeBlockExampleType[`${index}`]['exampleType'];
            pre.classList.add(exampleType);
        });
        return div.innerHTML;
    }

    convertTextNodeToElementNode(node) {
        const nodeElementsInOrder = [];
        const nodeValue = node.nodeValue;
        for (let j = 0; j < nodeValue.length; j++) {
            const char = nodeValue[j];
            if (char === "\n") {
                nodeElementsInOrder.push(document.createElement('br'));
            } else {
                const textDiv = document.createElement('span');
                textDiv.innerHTML = char;
                textDiv.class = 'text';
                nodeElementsInOrder.push(textDiv);
            }
        }

        const elementTextNode = document.createElement('span')
        elementTextNode.append(...nodeElementsInOrder);
        return elementTextNode;
    }

    swapChildren(newParent, oldParent) {
        while (oldParent.childNodes.length > 0) {
            newParent.appendChild(oldParent.childNodes[0]);
        }
    }

    replaceElement(oldElement, newElement) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

    convertTextNodesToElementNodes(current) {
        const nodeTypeEnum = { 'text': 3, 'element': 1 };

        const children = current.childNodes;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            if (childNode.nodeType === nodeTypeEnum.text) {
                let newNode = this.convertTextNodeToElementNode(childNode);
                this.replaceElement(childNode, newNode);
            }
            if (childNode.nodeType === nodeTypeEnum.element && !childNode.classList.contains('line-numbers-rows'))
                this.convertTextNodesToElementNodes(children[i]);
        }
    }

    addLineNumbersToNodes(current, lineNumber) {
        const nodeTypeEnum = { 'text': 3, 'element': 1 };
        const children = current.childNodes;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            if (childNode.nodeType === nodeTypeEnum.element) {
                const isNotlineNumberRows = !childNode.classList.contains('line-numbers-rows');
                if (childNode.nodeName === 'BR')
                    lineNumber.value++;
                else if (isNotlineNumberRows) {
                    childNode.dataset.line = lineNumber.value;
                    this.addLineNumbersToNodes(childNode, lineNumber);
                }
            }
        }
    }

    setCodeBlockHighlights(codeBlockHighlights, htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre, index) => {
            this.convertTextNodesToElementNodes(pre, 0);
        });

        div.querySelectorAll('pre code').forEach((code, index) => {
            const lineNumber = { value: 1 };
            this.addLineNumbersToNodes(code, lineNumber);

        });

        //highlight rows with codeBlockHighlights
        div.querySelectorAll('pre code').forEach((code, index) => {
            const row = codeBlockHighlights[index].rows;
            if (row !== null) {
                let matchingElems = code.querySelectorAll(`[data-line="${row}"]`);
                matchingElems.forEach((elem) => {
                    elem.classList.add('highlightedCode');
                });
            }
        });

        return div.innerHTML;
    }

    setCodeBlockLineNumbers(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre) => {
            const language = [...pre.querySelector('code[class*=language]').classList].find((className) => { if (className.includes('language')) { return className; } });
            pre.classList.add(['line-numbers']);
            pre.classList.add([`${language}`]);
            const lineCount = pre.innerText.split('\n').length;

            let linesHtml = '<span aria-hidden="true" class="line-numbers-rows">'
            for (let i = 0; i < lineCount; i++)
                linesHtml += '<span></span>';
            linesHtml += '</span>';

            pre.querySelector('code').lastElementChild.insertAdjacentHTML('afterEnd', linesHtml);
        });

        return div.innerHTML;
    }
}