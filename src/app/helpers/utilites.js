import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root',
//   })
export class Utilities {
    constructor() {  }

    // invertJsonKeyValues(json) {
    //     // one layer deep
    //     var key, invertedJson = {};
    //     for (key in json) {
    //         if (json.hasOwnProperty(key))
    //             invertedJson[json[key]] = key;
    //     }
    //     return invertedJson;
    // }

    // addProtoypeMethods() {
    //     Array.prototype.removeItem = function(indexToRemove) {
    //         let newArray = [];
    //         for (let i = 0; i < this.length; i++) {
    //             if (i !== indexToRemove) {
    //                 newArray.push(this[i]);
    //             }
    //         }
    //         return newArray;
    //     };
    // }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    dateInFuture(date) {
        return date.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    }

    // async loadScript(url) {
    //     return new Promise((resolve, reject) => {
    //         const script = document.createElement('script');
    //         script.type = 'text/javascript'
    //         script.onload = () => { resolve(script); };
    //         script.src = url;
    //         document.querySelector('head').appendChild(script);
    //     });
    // }
}