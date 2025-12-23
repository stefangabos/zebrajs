(function() {

    'use strict';

    var

        // we'll use this to keep track of registered event listeners
        // eslint-disable-next-line no-unused-vars
        event_listeners = {},

        // we'll use this when generating random IDs
        // eslint-disable-next-line no-unused-vars
        internal_counter = 0,

        // this is the function used internally to create ZebraJS objects using the given arguments
        // at the end of this file we give it a simpler name, like "$", but internally we'll use it like it is

        /**
        *   Creates a ZebraJS object which provides methods meant for simplifying the interaction with the set of
        *   elements matched by the `selector` argument. This is referred to as `wrapping` those elements.
        *
        *   @example
        *
        *   // select an element by ID
        *   var element = $('#foo');
        *
        *   // select element by class name
        *   var elements = $('.foo');
        *
        *   // select elements by using JavaScript
        *   var elements = $(document.querySelectorAll('.foo'));
        *
        *   // use CSS selectors
        *   var elements = $('input[type=text]');
        *
        *   // create elements
        *   var element = $('<div>').addClass('foo').appendTo($('body'));
        *
        *   @param  {mixed}     selector        A selector to filter DOM elements from the current document. It can be a
        *                                       query selector, a {@link ZebraJS} object, a DOM element, a
        *                                       {@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList NodeList},
        *                                       and array of DOM elements<br><br>Alternatively, it can be a HTML tag
        *                                       to create.
        *
        *   @param  {mixed}     [parent]        A selector to filter DOM elements from the current document, but only
        *                                       those which have as parent the element(s) indicated by this argument. It
        *                                       can be a query selector, a {@link ZebraJS} object, a DOM element, a
        *                                       {@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList NodeList},
        *                                       and array of DOM elements
        *
        *   @param  {boolean}   [first_only]    Setting this argument will instruct the method to return only the first
        *                                       element from the set of matched elements.
        *
        *   @return {array}     Returns a special array holding the matching elements and having all the methods to help
        *                       you work with those elements.
        *
        *   @author     Stefan Gabos <contact@stefangabos.ro>
        *   @version    1.0.3 (last revision May 10, 2024)
        *   @copyright  (c) 2016-2024 Stefan Gabos
        *   @license    LGPL-3.0
        *   @alias      ZebraJS
        *   @class
        */
        $ = function(selector, parent, first_only) {

            var elements = [], property;

            // refer to document.body node if it is the case
            if (typeof selector === 'string' && selector.toLocaleLowerCase() === 'body') selector = document.body;

            // if selector is given as a string
            if (typeof selector === 'string')

                // if it seems that we want to *create* an HTML node
                if (selector.indexOf('<') === 0 && selector.indexOf('>') > 1 && selector.length > 2) {

                    // create a dummy container
                    parent = document.createElement('div');

                    // set its body to the selector string
                    parent.innerHTML = selector;

                    // add created node to the elements array
                    elements.push(parent.firstChild);

                // if we want to select elements
                } else {

                    // if parent is not given, consider "document" to be the parent
                    if (!parent) parent = document;

                    // if parent is set and is a ZebraJS object, refer to the first DOM element from the set instead
                    else if (typeof parent === 'object' && parent.version) parent = parent[0];

                    // if parent is set and is a string, refer to the matching DOM element
                    else if (typeof parent === 'string') parent = document.querySelector(parent);

                    // if the selector is an ID
                    // select the matching element and add it to the elements array
                    if (selector.match(/^\#[^\s]+$/)) elements.push(parent.querySelector(selector));

                    // if the "first_only" argument is set
                    else if (first_only)

                        // try
                        try {

                            // select the matching element and add it to the elements array
                            elements.push(parent.querySelector(selector));

                        // if something went wrong (not a valid CSS selector)
                        // eslint-disable-next-line no-empty
                        } catch (e) {}

                    // if the "first" argument is not set
                    else

                        // try
                        try {

                            // select the matching elements and create and add the to the elements array
                            elements = Array.prototype.slice.call(parent.querySelectorAll(selector));

                        // if something went wrong (not a valid CSS selector)
                        // eslint-disable-next-line no-empty
                        } catch (e) {}

                }

            // if selector is the Document object, the Window object, a DOM node or a text node
            else if (typeof selector === 'object' && (selector instanceof Document || selector instanceof Window || selector instanceof Element || selector instanceof Text))

                // add it to the elements array
                elements.push(selector);

            // if selector is a NodeList (returned by document.querySelectorAll), add items to the elements array
            else if (selector instanceof NodeList) elements = Array.prototype.slice.call(selector);

            // if selector is an array of DOM elements, add them to the elements array
            else if (Array.isArray(selector)) elements = elements.concat(selector);

            // if the selector is a ZebraJS object, simply return it
            else if (typeof selector === 'object' && selector.version) return selector;

            // remove undefined values
            elements = elements.filter(function(value) { return value !== undefined && value !== null; });

            // attach all the ZebraJS methods to the elements array (including plugins, if any)
            for (property in $.fn) elements[property] = $.fn[property];

            // return the elements "array-on-steroids"
            return elements;

        }

    $.fn = {

        // zebrajs version
        version: '1.0.3'

    };

    // import "_helpers.js"
    // import "$.ajax.js"
    // import "$.each.js"
    // import "$.extend.js"
    // import "$.inArray.js"
    // import "$.isArray.js"
    // import "addClass.js"
    // import "after.js"
    // import "animate.js"
    // import "append.js"
    // import "appendTo.js"
    // import "attr.js"
    // import "before.js"
    // import "children.js"
    // import "clone.js"
    // import "closest.js"
    // import "css.js"
    // import "data.js"
    // import "detach.js"
    // import "each.js"
    // import "end.js"
    // import "eq.js"
    // import "find.js"
    // import "first.js"
    // import "get.js"
    // import "hasClass.js"
    // import "height.js"
    // import "hide.js"
    // import "html.js"
    // import "is.js"
    // import "insertAfter.js"
    // import "insertBefore.js"
    // import "next.js"
    // import "not.js"
    // import "off.js"
    // import "offset.js"
    // import "on.js"
    // import "one.js"
    // import "outerHeight.js"
    // import "outerWidth.js"
    // import "parent.js"
    // import "parents.js"
    // import "position.js"
    // import "prepend.js"
    // import "prependTo.js"
    // import "prev.js"
    // import "ready.js"
    // import "remove.js"
    // import "removeClass.js"
    // import "replaceWith.js"
    // import "scrollLeft.js"
    // import "scrollTop.js"
    // import "serialize.js"
    // import "show.js"
    // import "siblings.js"
    // import "text.js"
    // import "toggleClass.js"
    // import "trigger.js"
    // import "unwrap.js"
    // import "val.js"
    // import "width.js"
    // import "wrap.js"
    // for browsers that do not support Element.matches() or Element.matchesSelector(), but carry support for
    // document.querySelectorAll(), a polyfill exists:
    if (!Element.prototype.matches)

        Element.prototype.matches =

            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||

            function(s) {

                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;

                // eslint-disable-next-line no-empty
                while (--i >= 0 && matches.item(i) !== this) {}

                return i > -1;

            };

    // this is where we make the $ object available globally
    window.$ = window.jQuery = $;

})();
