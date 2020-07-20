export class Utilities {
    constructor() {
        if (!Utilities.instance) {
            Utilities.instance = this;

            this.addProtoypeMethods();
        }
        return Utilities.instance;
    }

    invertJsonKeyValues(json) {
        // one layer deep
        var key, invertedJson = {};
        for (key in json) {
            if (json.hasOwnProperty(key))
                invertedJson[json[key]] = key;
        }
        return invertedJson;
    }

    managedResize(key, callback) {
        this.removeEvent(window, key);

        let cb = () => {
            let resizeTimeout;
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    callback();
                }, 66);
            }
        };

        this.addEvent(key, 'resize', window, cb)
    }

    removeResize(key) {
        let oldCb = window.events[key];
        window.removeEventListener('resize', oldCb);
    }

    addEvent(id, eventType, element, callback, callbackArgs) {
        if (window.events[id] === undefined) {
            const events = {};
            events[`${eventType}`] = () => { callback(callbackArgs) };
            window.events[id] = events;
            element.addEventListener(eventType, callback, callbackArgs)
        }
    }

    removeEvent(element, id) {
        if (window.events[id] !== undefined) {
            const eventType = Object.keys(window.events[id])[0];
            const callback = window.events[id][eventType]
            element.removeEventListener(eventType, callback);
            window.events[id] = undefined;
        }
    }

    removeEvents(eventType, element) {
        const id = element.id;
        if (window.events[id] !== undefined && window.events[id][eventType] !== undefined) {
            for (let i = 0; i < window.events[id][eventType].length; i++) {
                element.removeEventListener(eventType, window.events[id][eventType][i]);
                window.events[id][eventType].pop(window.events[id][eventType][i]);
            }
        }
    }

    removeEventKeys(pattern) {
        Object.keys(window.events).forEach((e) => { if (e.includes(pattern)) delete window.events[e]; })
    }

    addProtoypeMethods() {
        Array.prototype.removeItem = function (indexToRemove) {
            let newArray = [];
            for (let i = 0; i < this.length; i++) {
                if (i !== indexToRemove) {
                    newArray.push(this[i]);
                }
            }
            return newArray;
        };
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    updatePageContent(html) {
        // destroys all events
        document.querySelector('#pageContent').innerHTML = html;
    }

    appendPageContent(html) {
        // keep exisiting event
        const div = document.createElement('div');
        div.innerHTML = html;
        document.querySelector('#pageContent').lastElementChild.insertAdjacentElement('afterEnd', div)
        div.replaceWith(...div.childNodes)
    }

    clearPageContent() {
        // destroy all events
        document.querySelector('#pageContent').innerHTML = '';
    }
}