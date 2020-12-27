LineNumberer = function () {
    class LineNumberer {
        constructor() {
            this.id = 'lineNumber';
            this.position = 'afterLineBreaks';

            const href = 'assets/prism/lineNumberer/lineNumberer.css';
            this.loadCss(href);
        }

        loadCss(href) {
            const link = document.createElement("link");

            link.type = "text/css";
            link.rel = "stylesheet";
            link.media = "screen,print";
            link.href = href;

            document.querySelector("head").appendChild(link);
        }

        getSettings() {
            return null;
        }

        updateBlock() {
            return (htmlString) => {
                return this.setCodeBlockLineNumbers(htmlString)
            };
        }

        setCodeBlockLineNumbers(htmlString) {
            const div = document.createElement('div');
            div.innerHTML = htmlString;

            div.querySelectorAll('pre').forEach((pre) => {
                const language = [...pre.querySelector('code[class*=language]').classList].find((className) => { return className.includes('language'); });
                pre.classList.add(['line-numbers']);
                pre.classList.add([`${language}`]);


                let lines = pre.innerHTML.split('<br>');


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

        setCodeBlockLineNumbers2(htmlString) {
            const div = document.createElement('div');
            div.innerHTML = htmlString;

            div.querySelectorAll('pre').forEach((pre) => {
                const language = [...pre.querySelector('code[class*=language]').classList].find((className) => { return className.includes('language'); });
                pre.classList.add(['line-numbers']);
                pre.classList.add([`${language}`]);

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
    }
    return new LineNumberer();
}()