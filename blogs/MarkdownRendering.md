# Rendering Markdown in the Browser

## Overview

Right now your viewing *Markdown* in the browser. This article explains how.

---

## Approach

First we need a markdown renderer. My requirements:
  - Lightwight renderer.
  - [GFM](https://github.github.com/gfm/) (Github Flavored Markup) support.
  - Prism for the code blocks highlighting<sup>1</sup>.
  - Easy to use.

The choice [MarkedJs](https://marked.js.org/#/README.md#README.md), for matching all of the criteria.

<span style=" font-size:11px;"><sup>1</sup> Mozilla use Prism for styling all of there code block examples on the [MDN](https://developer.mozilla.org/en-US/) website.</span>

---

## Basics

*Marked* is staright-forward to use. Import marked into your html project, Figure 1, using a cdn<sup>2</sup>.



#### Figure 1 - index.html - Getting marked
```html
<head>
  <script src="https://cdn.jsdelivr.net/gh/markedjs/marked@a9384eea7ae8bea6ef8a95470b315c73fdb3c189/marked.min.js"></script>;
</head>
```

We now have access to a global variable, *marked*. Figure 2 shows how to use *marked* to parse raw markdown into actual markdown.

#### Figure 2 - Parsing markdown into html
```javascript
  const rawMarkdown = await getRawMarkdown();

  const tokens = marked.lexer(rawMarkdown);
  const htmlString = marked.parser(tokens);

  document.querySelector('body').innerHTML = htmlString;
```


<span style=" font-size:11px;"><sup>2</sup> This cdn is dynamically created from the *marked* github repository using *jsdelivr*. The hash after the ampersand, sets the version of *marked*, so any breaking changes will not affect you.</span>

---

## Prism Code Block Highlighting

We have covered the basics, now lets look at using *Prism* with *marked*.

To remind you, Prism is used for code styling. You select the language for the code block in markdown, and Prism will apply code styling to that language.

Before we use it we need to download the *js* and *css* from [here](https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript). Stick with default settings if unsure. Simply import *Prism* inside your html head tag (Figure 3), once you have it locally.

#### Figure 3 - index.html - Getting Prism
```html
<head>
    <script src="/scripts/prism.js"></script>
    <link rel="stylesheet" href="/styles/prism.css">
</head>
```

Now we have access to the *Prism* global object. Using the *marked* *setOptions* function, we can add Prism as the code highlighter (figure 4). 

#### Figure 4 - Using Prism with marked
```javascript
  const languageSelector = {
    'html': () => { return Prism.languages.html; },
    'javascript': () => { return Prism.languages.javascript; },
  };

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: (code, language) => {
        return Prism.highlight(code, languageSelector[language]());
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });
```

There is a lot going on here. When you create a code block in mardown, you give it a language, i.e. \```JavaScript```.

There is a *languageSelector* object, that when given a language from the code block (i.e. 'javascript'), it will return the a Prism object for javascript. This object is used by *Prism.highlight* to determine the highlighting syntax for marked.

There are other *marked* setting as well. We will look at some of them, but we won't go through all of them as you can go to the documentation for [marked](https://marked.js.org/#/USING_ADVANCED.md#options).

Gfm (line 12), is GitHub markdown, so I want that on. Sanitize (line 14) is not safe for parsing raw markdown, so I've turned that off.

---

## Complete example of Prism with marked

#### Figure 5 - index.html - Imports
```html
<head>
    <script src="https://cdn.jsdelivr.net/gh/markedjs/marked/marked.min.js"></script>;

    <script src="/scripts/prism.js"></script>
    <link rel="stylesheet" href="/styles/prism.css">
</head>
```


#### Figure 6 - main.js - Script
```javascript
  const languageSelector = {
    'html': () => { return Prism.languages.html; },
    'javascript': () => { return Prism.languages.javascript; },
  };

  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: (code, language) => {
        return Prism.highlight(code, languageSelector[language]());
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });

  const rawMarkdown = await getRawMarkdown();

  const tokens = marked.lexer(rawMarkdown);
  const htmlString = marked.parser(tokens);

  document.querySelector('body').innerHTML = htmlString;
```

---

## Conclusion

  - Marked can be used quickly on it own.
  - Prism can be used as a highlighter for code blocks in marked, with little effort


<span style=" font-size:13px;">
Note I will be writing a follow up on creating custom styling for marked, in-conjunction with Prism, which I have done on this site, but haven't had the time to write up yet!</span>