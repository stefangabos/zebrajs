<img src="https://raw.githubusercontent.com/stefangabos/zebrajs/master/docs/images/logo.png" alt="zebrajs" align="right">

# ZebraJS &nbsp;[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=A+modular,+jQuery+compatible,+ultra+light-weight+JavaScript+micro-library+for+modern+browsers&url=https://github.com/stefangabos/zebrajs&via=stefangabos&hashtags=jquery,javascript)

*A modular, jQuery compatible, ultra light-weight JavaScript micro-library for modern browsers*

[![npm](https://img.shields.io/npm/v/@stefangabos/zebra_js)](https://www.npmjs.com/package/@stefangabos/zebra_js) [![Total](https://img.shields.io/npm/dt/@stefangabos/zebra_js)](https://www.npmjs.com/package/@stefangabos/zebra_js) [![Monthly](https://img.shields.io/npm/dm/@stefangabos/zebra_js)](https://www.npmjs.com/package/@stefangabos/zebra_js) [![](https://data.jsdelivr.com/v1/package/npm/@stefangabos/zebra_js/badge)](https://www.jsdelivr.com/package/npm/@stefangabos/zebra_js) [![License](https://img.shields.io/npm/l/@stefangabos/zebra_js)](https://github.com/stefangabos/@stefangabos/zebra_js/blob/master/LICENSE.md)

**ZebraJS** is a truly modular, jQuery-compatible, ultra-lightweight (**~20Kb minified, ~7Kb gzipped**) JavaScript micro-library designed for modern browsers. It brings the familiar, intuitive syntax of jQuery to the modern web while leveraging native browser capabilities for superior performance and a dramatically smaller footprint.

In today's web development landscape, browsers have converged on standards and natively support many features that jQuery pioneered. However, writing vanilla JavaScript for DOM manipulation remains verbose and repetitive. ZebraJS bridges this gap perfectly - offering jQuery's developer-friendly API powered by modern, efficient native browser methods.

## :zap: Why ZebraJS?

### Lightweight & Modular
- **Drastically smaller** than jQuery - full library is only ~20Kb minified (~7Kb gzipped)
- **Truly modular** - build custom versions with only the methods you need via the [online builder](https://stefangabos.github.io/zebrajs/download/)
- **Tree-shakeable** when used with modern bundlers
- Perfect for projects where jQuery is overkill but vanilla JS is too verbose

### jQuery-Compatible Syntax
- **Familiar API** - if you know jQuery, you know ZebraJS
- **Drop-in replacement** for many common jQuery use cases
- **Easy migration** from jQuery projects without rewriting your code
- Retains the intuitive chaining and selector syntax developers love

### Modern & Performant
- **Native browser APIs** under the hood for optimal performance
- **Modern ES6+ syntax** - leverages arrow functions, template literals, and other modern JavaScript features
- Built for **modern browsers** without legacy baggage
- Leverages **querySelector/querySelectorAll** for fast, standards-based DOM selection
- Clean, maintainable codebase inspired by [You Don't Need jQuery](https://github.com/oneuijs/You-Dont-Need-jQuery)

### Production-Ready
- **Well-documented** with comprehensive API documentation
- **Actively maintained** with regular updates
- **NPM package** available for easy integration
- **CDN-hosted** via JSDelivr for quick prototyping

## :notebook_with_decorative_cover: Documentation

Check out the [awesome documentation](https://stefangabos.github.io/zebrajs/index.html)!

## :floppy_disk: Custom build

Build a [customized version](https://stefangabos.github.io/zebrajs/download/) of the library and include just the bits you need

## 🎂 Support the development of this project

Your support means a lot and it keeps me motivated to keep working on open source projects.<br>
If you like this project please ⭐ it by clicking on the star button at the top of the page.<br>
If you are feeling generous, you can buy me a coffee by donating through PayPal, or you can become a sponsor.<br>
Either way - **Thank you!** 🎉

[<img src="https://img.shields.io/github/stars/stefangabos/zebrajs?color=green&label=star%20it%20on%20GitHub" width="132" height="20" alt="Star it on GitHub">](https://github.com/stefangabos/zebrajs) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9563UHJR67EVE) [<img src="https://img.shields.io/badge/-Sponsor-fafbfc?logo=GitHub%20Sponsors">](https://github.com/sponsors/stefangabos)

## Installation

Download the [full library](https://github.com/stefangabos/zebrajs/archive/master.zip) from GitHub (and use either `dist/zebra.min.js` or `/dist/zebra.src.js`), or go on and [get your customized version](https://stefangabos.github.io/zebrajs/download/).

zebraJS is also available as a [npm package](https://www.npmjs.com/package/@stefangabos/zebra_js). To install it use:

```bash
# the "--save" argument adds the plugin as a dependency in packages.json
npm install @stefangabos/zebra_js --save
```

Alternatively, you can load zebraJS from [JSDelivr CDN](https://www.jsdelivr.com/package/npm/zebra_transform) like this:
```html
<!-- for the most recent version, not recommended in production -->
<script src="https://cdn.jsdelivr.net/npm/@stefangabos/zebra_js@latest/dist/zebra.min.js"></script>

<!-- for a specific version -->
<script src="https://cdn.jsdelivr.net/npm/@stefangabos/zebra_js@1.0.2/dist/zebra.min.js"></script>

<!-- replacing "min" with "src" will serve you the non-compressed version -->
```

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

Once you grab hold of one or more elements (we call this *wrapping elements* because we *wrap* the ZebraJS object over the selected elements) you can call any of [ZebraJS's methods](https://stefangabos.github.io/zebrajs/index.html).

## Where to use ZebraJS

I use this to fuel my (small) pet projects where jQuery is overkill and plain JavaScript is too verbose. Also, more often than not, I just need very little from jQuery, and hence the modular approach.

Keep in mind that this library is currently work-in-progress so adjust your expectations accordingly.

## Contributing

Make sure you have installed [Node.js, npm](https://docs.npmjs.com/getting-started/installing-node) and [Grunt](http://gruntjs.com/). Once you have those, open up a terminal in the project's folder and run `npm install`. Next time you'll just have to type `grunt` in your terminal while in the project's folder.

From this point on, when you edit the project's files in the `/src` folder, Grunt will automatically run tasks that will check whether you follow the project's coding standards via [ESLint](http://eslint.org/docs/about/), will do static code analysis via [JSHint](http://jshint.com/about/), will use [Uglify](https://github.com/mishoo/UglifyJS) on the code and will generate the documentation with [JSDoc](https://github.com/jsdoc3/jsdoc) (documentation follows JavaDoc standards)

You can help by writing actual code for the methods listed in the `/src` folder and which don't have yet been written. The methods are included in the main `$.js` file via comments looking like `// import "methodName.js"`.

Alternatively, you can help improving the library's website in the `/docs/download` folder. This implies altering JavaScript and CSS files in the `/docs/download/assets_src` folder and the actual `index.html` in `/docs/download`.
