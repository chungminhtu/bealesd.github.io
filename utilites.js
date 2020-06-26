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
        let oldCb = window.events[key];
        window.removeEventListener('resize', oldCb);
    
        let cb = () => {
            let resizeTimeout;
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    callback();
                }, 66);
            }
        };
    
        window.addEventListener('resize', cb);
        window.events[key] = cb;
    }

    removeResize(key) {
        let oldCb = window.events[key];
        window.removeEventListener('resize', oldCb);
    }

    addEvent(eventType, element, callback, callbackArgs) {
        const id = element.id;
        window.events[id] = window.events[id] === undefined || window.events[id][eventType] === undefined ?
            { [eventType]: [callback] } :
            { [eventType]: [...window.events[id][eventType], callback] }

        element.addEventListener(eventType, callback, callbackArgs);
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

    updateTemplate(html) {
		document.querySelector('#template').innerHTML = html;
    }
}