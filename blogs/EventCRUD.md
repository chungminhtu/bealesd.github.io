# Event CRUD

## Overview
 Events can be added to HTML content, which is handled by JavaScript.

 For example a button can have a **click** event (figure 1).

 #### Figure 1 - inline click event on DOM element of type button

  ```html
<button onclick="myFunction()">Click Me</button>
```

When the button **Click Me** is clicked, a function called **myFunction** is called. 

Generally, when dealing with applications, you would not want to assign functions to the DOM inline, as your scripts would become unmaintainable and probably not very modular. Instead you would reference the DOM element in JavaScript and add a callback function, (figure 2).

#### Figure 2 - add an event listener to the 1st button found

```javascript
document.querySelector('button').addEventListener('click', myFunction, null);

function myFunction(){
    console.log('hello world');
}
```

Figure 3 shows the contract used by figure 2 for adding an event to an HTML element.

#### Figure 3 - *contract* - add an event listener 

```javascript
element.addEventListener(eventType, callback, callbackArgs);
```

***

### Why

A challenging part of any single page web application (SPA) can be managing events. As you navigate through a SPA, it is common for elements to be removed or hidden and new elements to be added or shown. If an elemnt is removed you will lose all of its event listeners, and need to re-add them. Alternatively if an element is hidden, you might accidently add new event listeners to them.

As you can see in figure 3, there is no protection from adding the same event<sup>1</sup> to an element, which wil cause the event to fire multiple times. This can be very bad, i.e. logic to add or remove a class on an element depending on if that class is on the element or not. If you have an even number of duplicate events added, then your logic will fail, not to mention being inefficient.  

This is where I believe event CRUD can be very useful. The idea is to have an event repository that manages all you SPA events. If a duplicate event is added, the repo will either remove the existing event and add the new one, or keep the old one. If you want to ensure an event is removed, but don't want to delete that element the repo can find that event by id and remove it.

*<sup>1</sup> no event is really the same, but if you've added the same code to an element, then I will consider it the same event.*

***

## Create

Create is the obvious place to start. If we are going to track events in our SPA we will need 2 things;
 - an ID for each event,
 - a key value store for storing the event and its ID.

#### Figure 4 - addEvent function
```javascript
    addEvent(id, eventType, element, callback, callbackArgs) {
        if (window.events[id] === undefined) {
            const events = {};
            events[`${eventType}`] = () => { callback(callbackArgs) };
            window.events[id] = events;
            element.addEventListener(eventType, callback, callbackArgs)
        }
    }
```

So what does the function addEvent do? It has 4 args, where
 - *id* - unique id
 - *eventType* - click, mouseover, focus, etc
 - *element* - the DOM element
 - *callback* - the function to execute on the event firing
 - *callbackArgs* - the args that the callback requires

It uses the global variable *window* as a store for adding a JSON object. This *id* is then added to the JSON object, if the id has not been taken. The value associated to the *id* is then an univoked annoymous function containing the callback and its' args. Only then is the *addEventListener* function invoked with the args.

N.B. This is a quick approach, which works, although if you are implementing this in live code, the *addEvent* function should be in a class. Also there is no need to use the global variable *window* as an events store. Instead use a class variable. In fact, if you used window.event, you would be overriding an in-built variable. So you can see the risk. Also *window* is often used by developers who may not understand scope and therfore always want access to their vairables.

## Delete

Removing an event is now very easy. Just enter the event ID and the element and poof, the event is gone! Figure 4 shows an implentation of this. If the event is found in the global JSON dicitonary, remove it from the both the dictionary and the event from the element.

#### Figure 4 - removeEvent function
```javascript
 removeEvent(element, id) {
        if (window.events[id] !== undefined) {
            const eventType = Object.keys(window.events[id])[0];
            const callback = window.events[id][eventType]
            element.removeEventListener(eventType, callback);
            window.events[id] = undefined;
        }
    }
```

# Conclusion

Tracking events is very easy in JavaScript, with just a little work. I will provide one caveat, if your callback functions don't work properly, you most likely are encountering a scope issue. I tend to avoid this issue by passing in annoymous functions or using the **bind** keyword to bind the current scope to the function.

#### Figure 5 - annoymous function
```javascript
    myFunction(arg1){
    ...some logic;
    }

    ()=>{
        myFunction(arg1);
    }
```

N.B. you may feel cheated, I have not added a read or update event method (yet the post is called event CRUD). To be honest, these would be trivial to implement, and would add little value, so I have left them out. It could be useful to add a *remove all events* method, for an element as well.