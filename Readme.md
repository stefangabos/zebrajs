[Download](https://stefangabos.github.io/zebrajs/download/)

# ZebraJS

A modular JavaScript micro-library for modern browsers (IE 9+) meant to simplify the interaction with the DOM in the *post-jQuery* world, now that there are there are less and less differences between how browsers handle various JavaScript-related aspects and offer native support for most of the things that [jQuery](http://jquery.com/) had to tackle and take care for us, behind the scenes, since its first release [back in 2006](https://en.wikipedia.org/wiki/JQuery).

Nevertheless, the need for a library to handle common tasks needed when interacting with the DOM becomes obvious for anyone writing JavaScript on a daily basis, as there's quite some code to write to handle various aspects of DOM manipulation.

**ZebraJS** retains [jQuery](http://jquery.com/)'s intuitive and simple syntax but the code behind is largely inspired from the excellent [You Don't Need jQuery](https://github.com/oneuijs/You-Dont-Need-jQuery) GitHub repository as well as the documentation on [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web), and makes use of the modern browsers' improved support for manipulating DOM elements. Also, in line with the modern age's pursuit for byte saving, ZebraJS allows you to build customized version of the library and include just the bits you need.

## Examples

The most important thing this library does, similarly to jQuery, is to simplify the process of selecting DOM elements by providing a unified wrapper for JavaScript's [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) and [getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) via a shorthand function called, by default, `$` (dollar sign) and which can be renamed to whatever character or string allowed by JavaScript.

```javascript
// always cache selectors
// to avoid scanning the DOM over and over again
var elements = $('selector')
```

As with both querySelector and querySelectorAll, the `selector` string may contain one or more CSS selectors separated by commas:

```javascript
var elements = $('div.authentication .form-container.authentication input[type=text]');
```

> I cannot stress enough how important it is to understand the fact that **everytime** you call the **$** global function you will create a new object that will take up memory - ZebraJS does not cache selectors! Therefore, you should **never** use it in an event handler or a function that gets called multiple times over the lifetime of a page and instead **cache those selectors outside those functions!** Yes, this true for jQuery, also.

Once you grab hold of one or more elements (we call this *wrapping elements* because we *wrap* the ZebraJS object over the selected elements) you can call any of ZebraJS's methods.

## Where to use ZebraJS

I use this to fuel my (small) pet projects where jQuery is overkill and plain JavaScript is too verbose. Also, more often than not, I just need very little from jQuery, and hence the modular approach.

Keep in mind that this library is currently in its infancy so adjust your expectations accordingly.


## Installing

Download the full library from GitHub or go on and get your customized version.

## Contributing

Make sure you have installed [Node.js, npm](https://docs.npmjs.com/getting-started/installing-node) and [Grunt](http://gruntjs.com/). Once you have those, open up a terminal in the project's folder and run `npm install`. Next time you'll just have to type `grunt` in your terminal while in the project's folder.

From this point on, when you edit the project's files in the `/src` folder, Grunt will automatically run tasks that will check whether you follow the project's coding standards via [ESLint](http://eslint.org/docs/about/), will do static code analysis via [JSHint](http://jshint.com/about/), will use [Uglify](https://github.com/mishoo/UglifyJS) on the code and will generate the documentation with [JSDoc](https://github.com/jsdoc3/jsdoc) (documentation follows JavaDoc standards)

You can help by writing actual code for the methods listed in the `/src` folder and which don't have yet been written. The methods are included in the main `_$.js` file via comments looking like `// import "_methodName.js"`.

Alternatively, you can help improving the library's website in the `/site` folder. This implies altering JavaScript and CSS files in the `/site/assets_src` folder and the actual `index.html` in `/site`.
