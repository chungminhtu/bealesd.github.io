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

        // check prism is imported, if not import it
        this.prism = window['Prism'];

        if (this.prism === undefined) {
            this.loadScriptBrowser('../assets/prism/core/prism.js');
            this.loadCss('../assets/prism/core/prism.css');
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

    highlightSyntax(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;

        div.querySelectorAll('pre code').forEach((code: HTMLPreElement) => {
            const languaugeKey = [...(<any>code.classList)].find(val => val.startsWith('language-'))?.split('-')[1]?.toLocaleLowerCase();
            let language = this.prism.languages[languaugeKey];

            if (language === undefined) language = this.prism.languages.javascript;

            //fix the html syntx
            let a = code.innerHTML;
            let b = a.split('&lt;')
            let c = b.join('<');
            let d = c.split('&gt;');
            let e = d.join('>');
            // e = item.innerHTML;

            //add sytax hihglighting
            let sytaxHighlighted = this.prism.highlight(e, language);

            code.innerHTML = sytaxHighlighted;

            // create the toolbar - doing this makes the code blocks overlap menus!!!
            // let pre = code.parentElement;
            // var parent = pre.parentNode;
            // var wrapper = document.createElement('div');
            // wrapper.classList.add('code-toolbar');
            // wrapper.innerHTML = `<div class="toolbar">
            //                         <div class="toolbar-item">
            //                             <span>${languaugeKey}</span>
            //                         </div>
            //                     </div>`

            // // set the wrapper as child, or parent, remove pre
            // parent.replaceChild(wrapper, pre);
            // // set pre as child of wrapper
            // wrapper.appendChild(pre);

        });

        // div.querySelectorAll('pre').forEach((item: HTMLPreElement) => {
        //     //todo - add code toolbar, won't work as need to wrap pre
        //     let codeToolbar = `<div class="code-toolbar">
        //     ${sytaxHighlighted}
        //         <div class="toolbar-item">
        //             <span>${languaugeKey}</span>
        //         </div>
        //     </div>`
        // });

        return div.outerHTML;
    }

    addLineNumbers(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre: HTMLPreElement) => {
            const language = [...(<any>pre.querySelector('code[class*=language]').classList)].find((className) => { return className.includes('language'); });
            pre.classList.add('line-numbers');
            pre.classList.add(`${language}`);

            let lines = pre.querySelector('code').innerHTML.split('\n');

            let linesHtml = ''
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                const lineDiv = document.createElement('div');
                lineDiv.classList.add('line-container');

                lineDiv.innerHTML = line;
                linesHtml += lineDiv.outerHTML;
            }

            pre.querySelector('code').innerHTML = linesHtml;

        });
        return div.innerHTML;
    }

    highlightLine(htmlString: string): string {
        const div = document.createElement('div');
        div.innerHTML = htmlString;

        div.querySelectorAll('pre').forEach((pre, index) => {
            this.convertTextNodesToElementNodes(pre);
        });

        div.querySelectorAll('pre code').forEach((code, index) => {
            this.addLineNumbersToNodes(code);
        });

        div.querySelectorAll('pre code').forEach((code, index) => {
            let pre = code.parentElement;
            const rows = [];
            if (pre.dataset.line)
                rows.push(parseInt(pre.dataset.line))

            if (rows === []) return;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                let matchingElems = code.querySelectorAll(`[data-line="${row}"]`);
                matchingElems.forEach((elem) => {
                    elem.classList.add('highlightedCode');
                });
            }
        });

        return div.innerHTML;
    }

    addLineNumbersToNodes(codeBlock) {
        codeBlock.querySelectorAll(".line-container").forEach((line, row) => {
            const children = line.childNodes;
            for (let i = 0, len = children.length; i < len; i++) {
                this.getChildren(children[i], row + 1);
            }
        })
    }

    getChildren(child, row) {
        const children = child.childNodes;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            if (childNode.nodeType !== NodeType.element) return;

            if (childNode.children.length > 0) {
                this.getChildren(childNode, row);
            } else {
                childNode.dataset.line = row;
            }
        }
    }

    convertTextNodesToElementNodes(current) {
        const children = current.childNodes;
        for (let i = 0, len = children.length; i < len; i++) {
            const childNode = children[i];
            if (childNode.nodeType === NodeType.text) {
                const newNode = this.convertTextNodeToElementNode(childNode);
                this.replaceElement(childNode, newNode);
            }
            if (childNode.nodeType === NodeType.element && !childNode.classList.contains('line-numbers-rows'))
                this.convertTextNodesToElementNodes(children[i]);
        }
    }

    replaceElement(oldElement, newElement) {
        oldElement.parentNode.replaceChild(newElement, oldElement);
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
                (<any>textDiv).class = 'text';
                nodeElementsInOrder.push(textDiv);
            }
        }

        const elementTextNode = document.createElement('span')
        elementTextNode.append(...nodeElementsInOrder);
        return elementTextNode;
    }


}