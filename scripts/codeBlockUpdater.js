
export class CodeBlockUpdater {
    // this class will work with raw Markown from Marked.js, and update <pre><code> block with styling based on the plugins
    // pass in classes that adhere to the following contract: getSettings cb, updateBlock cb, position, id
    // position is from list of values.

    constructor() {
        this.updateHookOrders = { 'beforeLineBreaks': 1, 'afterLineBreaks': 2 };

        this.getSettingsHooks = {};

        this.updateHooks = {};
        this.updateHooks[this.updateHookOrders.beforeLineBreaks] = {};
        this.updateHooks[this.updateHookOrders.afterLineBreaks] = {};
    }

    registerClass(plugin) {
        const getSettingsHook = plugin.getSettings();
        const updateHook = plugin.updateBlock();
        const position = plugin.position;
        const id = plugin.id;

        if (updateHook === null || updateHook === undefined)
            throw ('No setter added for code block hook.');

        if (id === null || id === '' || id === undefined)
            throw ('No id added for code block hook.');

        if (getSettingsHook !== null && Object.keys(this.updateHookOrders).includes(position) === -1)
            throw ('Invalid setter hook option.');

        if (getSettingsHook !== null)
            this.getSettingsHooks[id] = { 'hook': getSettingsHook, 'result': null };

        this.updateHooks[this.updateHookOrders[position]][id] = updateHook;
    }

    update(rawMarkdown) {
        const tokens = marked.lexer(rawMarkdown);
        const codeTokens = tokens.filter(token => { return token.type === 'code'; });

        this.getHookSettings(codeTokens);

        this.resetCodeBlockLanguage(codeTokens);

        const htmlString = this.runUpdateHooks(tokens);
        return htmlString;
    }

    getHookSettings(codeTokens) {
        const hookIds = Object.keys(this.getSettingsHooks);
        for (let i = 0; i < hookIds.length; i++) {
            const hookId = hookIds[i];
            const hookObject = this.getSettingsHooks[hookId];
            const hook = hookObject['hook'];
            hookObject['result'] = hook(codeTokens);
        }
    }

    resetCodeBlockLanguage(tokens) {
        tokens.forEach((token) => {
            token['lang'] = token['lang'].split(' ')[0];
        });
    }

    runUpdateHooks(tokens) {
        let htmlString = marked.parser(tokens);

        const updateHookOrderValues = Object.values(this.updateHookOrders);
        for (let i = 0; i < updateHookOrderValues.length; i++) {
            const updateHookOrder = updateHookOrderValues[i];
            const hookIds = Object.keys(this.updateHooks[updateHookOrder]);

            for (let j = 0; j < hookIds.length; j++) {
                const hookId = hookIds[j];
                const setterHook = this.updateHooks[updateHookOrder][hookId];

                if (this.getSettingsHooks.hasOwnProperty(hookId)) {
                    const hookArg = this.getSettingsHooks[hookId]['result'];
                    htmlString = setterHook(hookArg, htmlString);
                }
                else
                    htmlString = setterHook(htmlString);
            }
        }
        return htmlString;
    }
}