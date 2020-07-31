
CodeBlockUpdater = function () {
    class CodeBlockUpdater {
        // dependencies; Marked.js must be loaded before using.
        // 
        // updates <pre><code> blocks with styling based on code block plugins
        //
        // pass in classes that adhere to the following contract: 
        //   getSettings callback - getting the plugin settings needed for the ublock update to work.
        //   updateBlock callback - what the plugin will do to the block.
        //   id - a unique string.
        //   position - two options, before <br> have been addded and after. If plugin relies on new line characters, the before, else after.

        // TODO - plugins should stop reading indexes in code block, use key value instead
        // move this all into a new repo
        // get marked from cdn if not available.

        constructor() {
            if (!CodeBlockUpdater.instance) {
                this.updateHookOrders = { 'beforeLineBreaks': 1, 'afterLineBreaks': 2 };

                this.getSettingsHooks = {};

                this.updateHooks = {};
                this.updateHooks[this.updateHookOrders.beforeLineBreaks] = {};
                this.updateHooks[this.updateHookOrders.afterLineBreaks] = {};

                CodeBlockUpdater.instance = this;
            }
            return CodeBlockUpdater.instance;
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
    return new CodeBlockUpdater();
}();