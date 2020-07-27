# The Async Constructor

## The Problem
You want to run some asynchronous code in your class constructor. You wisely believe that adding **async** before the word **constructor** will work, as shown below (figure 1).

#### Figure 1 - async constructor (not working)
```javascript exampleBad
class GoogleClass {
    async constructor() {
            const response = await fetch('https://www.google.com');
            ...some logic;
        }
}
```

Alas, your class fails to build, you get an error: **Uncaught SyntaxError: Class constructor may not be an async method**.

---

## The Solution

So there is a really simple solution, return a function in the constructor, i.e. a closure. In this case (figure 2), we create an annoymous async function, that we instantly return on newing up the class with the *new* operator.

#### Figure 2 - async constructor (working)
```javascript exampleGood
class GoogleClass {
    constructor() {
        return (async () => {
                    const response = await fetch('https://www.google.com');
                    ...some logic;
                })();
    }
}
```