import { Injectable } from '@angular/core';
import { Utilities } from '../helpers/utilites'

enum NodeType {
    'text' = 3, 'element' = 1
}

@Injectable({
    providedIn: 'root',
})
export class PrismWrapper {
    prism: any;
    utilities: any;
    languageSelector: { c: () => any; csharp: () => any; git: () => any; html: () => any; javascript: () => any; markdown: () => any; python: () => any; powershell: () => any; typescript: () => any; webassembly: () => any; yaml: () => any; };

    constructor() {
        this.utilities = new Utilities();

        this.prism = window['Prism'];

        if (this.prism === undefined) {
            this.loadScriptBrowser('../assets/prism/core/prism.js');
            this.loadCss('../assets/prism/core/prism.css');
            this.prism = window['Prism'];
        }
        this.loadCss('../assets/prism-js-wrapper.css');
    }

    loadScriptBrowser(url) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.querySelector('head').appendChild(script);
    }

    loadCss(href) {
        const link = document.createElement("link");

        link.type = "text/css";
        link.rel = "stylesheet";
        link.media = "screen,print";
        link.href = href;

        document.querySelector("head").appendChild(link);
    }

    highlightAll(html, options) {
        const args = options || {};
        const linesNumbers = args.linesNumbers || false;
        const lineHighlighter = args.lineHighlighter || false;

        html = this.highlightSyntax(html);

        if (linesNumbers || lineHighlighter)
            html = this.addLineNumbersMetadata(html);

        if (linesNumbers)
            html = this.addLineNumbers(html);

        if (lineHighlighter)
            html = this.highlightLine(html);

        return html;
    }

    highlightSyntax(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;

        div.querySelectorAll('pre code').forEach((code: HTMLPreElement) => {
            const languageKey = [...(<any>code.classList)].find(val => val.startsWith('language-'))?.split('-')[1]?.toLocaleLowerCase();
            let language = this.prism.languages[languageKey];
            if (language === undefined) language = this.prism.languages.javascript;

            let codeInnerHtml;

            codeInnerHtml = this.htmlDecode(code.innerHTML);

            const sytaxHighlighted = this.prism.highlight(codeInnerHtml, language);
            code.innerHTML = sytaxHighlighted;

            this.addCodeToolbar((code.parentElement as HTMLPreElement), languageKey);
        });
        return div.outerHTML;
    }

    htmlDecode(value: string): string {
        const div = document.createElement('div');
        div.innerHTML = value;
        return div.childNodes[0].nodeValue;
    }

    addCodeToolbar(pre: HTMLPreElement, language: string) {
        const codeToolbar = document.createElement('div');
        codeToolbar.classList.add('code-toolbar');
        codeToolbar.innerHTML = `<div class="toolbar">
                                    <div class="toolbar-item">
                                        <span>${language}</span>
                                    </div>
                                </div>`;

        this.replaceElement(pre, codeToolbar);
        codeToolbar.appendChild(pre);
    }

    addLineNumbersMetadata(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre: HTMLPreElement) => {
            const language = [...(<any>pre.querySelector('code[class*=language]').classList)].find((className) => { return className.includes('language'); });
            pre.classList.add(`${language}`);

            let linesHtml = '';
            let lines = pre.querySelector('code').innerHTML.split('\n');
            for (const i in lines) {
                const line = lines[i];
                const lineDiv = document.createElement('div');
                lineDiv.dataset.lineNumber = `${i}`;

                lineDiv.innerHTML = line;
                linesHtml += lineDiv.outerHTML;
            }
            pre.querySelector('code').innerHTML = linesHtml;
        });

        return div.innerHTML;
    }

    addLineNumbers(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll("pre>code div[data-line-number]").forEach((div) => {
            div.classList.add('line-container');
        });
        return div.innerHTML;
    }

    highlightLine(htmlString: string) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre) => {
            this.convertTextNodesToElementNodes(pre);

            pre.querySelectorAll("code [data-line-number]>span").forEach((span) => {
                const rawRowNumbers = pre.dataset.line;
                if (rawRowNumbers === undefined) return;

                const nestedRows = rawRowNumbers.split(',').map(val => val.split('-'));
                const rowsToHighlight = [];
                for (const nestedRow of nestedRows) {
                    if (nestedRow.length === 1)
                        rowsToHighlight.push(parseInt(nestedRow[0]));
                    else if (nestedRow.length === 2)
                        this.range(parseInt(nestedRow[0]), parseInt(nestedRow[1])).forEach(r => rowsToHighlight.push(r));
                }

                const rowNumber = parseInt(span.parentElement.dataset.lineNumber);
                if (rowsToHighlight.includes(rowNumber)) span.classList.add('highlightedCode');
            });
        });

        return div.innerHTML;
    }

    range(start: number, end: number): number[] {
        length = end - start
        return Array.from({ length }, (_, i) => start + i);
    }

    convertTextNodesToElementNodes(current) {
        for (const childNode of current.childNodes) {
            if (childNode.nodeType === NodeType.text) {
                const newNode = this.convertTextNodeToElementNode(childNode);
                this.replaceElement(childNode, newNode);
            }
            else if (childNode.nodeType === NodeType.element && !childNode.classList.contains('line-numbers-rows'))
                this.convertTextNodesToElementNodes(childNode);
        }
    }

    replaceElement(oldElement, newElement) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
    }

    convertTextNodeToElementNode(node) {
        const nodeElementsInOrder = [];
        const nodeValue = node.nodeValue;
        for (const char of nodeValue) {
            if (char === "\n") {
                nodeElementsInOrder.push(document.createElement('br'));
            } else {
                const textDiv = document.createElement('span');
                textDiv.innerHTML = char;
                (<any>textDiv).class = 'text';
                nodeElementsInOrder.push(textDiv);
            }
        }

        const elementTextNode = document.createElement('span')
        elementTextNode.append(...nodeElementsInOrder);
        return elementTextNode;
    }
}