export class BlockHighlighter {
    constructor() {
        this.id = 'blockHighlighter';
        this.position = 'afterLineBreaks';
        this.exampleType = ['exampleGood', 'exampleBad', 'example'];
    }

    getSettings() {
        return (codeTokens) => {
            return this.getCodeBlockExampleType(codeTokens)
        };
    }

    updateBlock() {
        return (codeBlockExampleType, htmlString) => {
            return this.setCodeBlockExampleType(codeBlockExampleType, htmlString)
        };
    }
    getCodeBlockExampleType(tokens) {
        let codeBlockExampleType = {};
        tokens.forEach((token, index) => {
            let exampleType = 'example';
            if (token['lang'].split(' ').length > 1 && token['lang'].split(' ')[1] !== null && this.exampleType.includes(token['lang'].split(' ')[1]))
                exampleType = token['lang'].split(' ')[1];

            codeBlockExampleType[`${index}`] = { 'exampleType': exampleType };
        });
        return codeBlockExampleType;
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
}