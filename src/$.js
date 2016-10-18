/**
 *
 *  @fileOverview
 *  @name       ZebraJS
 *  @author     Stefan Gabos <contact@stefangabos.ro>
 *  @version    0.0.1 (last revision: October 17th, 2016)
 *  @copyright  (c) 2016 Stefan Gabos
 *  @license    LGPL-3.0
 */

/**
 *  Creates a "$" object which provides methods meant for simplifying the interaction with the set of elements matched
 *  by the `selector` argument. This is refered to as `wrapping` those elements.
 *
 *  @param  {string|object|node}    selector
 *  @class
 */
$ = function(selector, parent, first_only) {

    'use strict';

    // if called without the "new" keyword
    if (!(this instanceof $)) {

        // if selector is given as a string
        if (typeof selector === 'string') {

            // if we called the method to *create* an HTML node
            if (selector.indexOf('<') === 0) {

                // create a dummy container
                parent = document.createElement('div');

                // set its body to the string
                parent.innerHTML = selector;

                // create and return an $ object
                return new $(parent.firstChild);

            }

            // if parent is not given, consider "document" to be the parent
            if (!parent) parent = document;

            // if parent is set but is a "$" object, refer to the DOM elements instead of the "$" object
            else if (parent instanceof $) parent = parent.get()[0];

            // if the selector is an ID
            // select the matching element and create and return a new "$" object
            if (selector.match(/^\#[^\s]+$/)) return new $(parent.getElementById(selector.substr(1)));

            // if the "first_only" argument is set
            else if (first_only)

                // try
                try {

                    // select the matching element and create and return a new "$" object
                    return new $(parent.querySelector(selector));

                // if something went wrong (not a valid CSS selector)
                } catch (e) {

                    // return false
                    return false;

                }

            // otherwise
            try {

                // select the matching elements and create and return a new "$" object
                return new $(Array.prototype.slice.call(parent.querySelectorAll(selector)));

            // if something went wrong (not a valid CSS selector)
            } catch (e) {

                // return false
                return false;

            }

        // if selector is a DOM node, the Document or Window object, wrap it and return the new "$" object
        } else if (typeof selector === 'object' && (selector instanceof Element || selector instanceof Document || selector instanceof Window)) return new $(selector);

        // if we're calling $() on an "$" object, simply return the original object
        else if (selector instanceof $) return selector;

        // bogus selector, return false
        return false;

    // if called with the "new" keyword
    } else {    // eslint-disable-line no-else-return

        // if no elements found, return now
        if (!selector) return;

        // private properties
        // reference to the "$" object
        var $this = this,

            // the set of matched elements
            elements = (selector instanceof Element ? [selector] : [].concat(selector));

        /**
         *  @todo   Needs documentation!
         *
         *  @access public
         */
        this.get = function() {
            return elements;
        }

        // import "addClass.js"
        // import "ajax.js"
        // import "append.js"
        // import "attr.js"
        // import "css.js"
        // import "data.js"
        // import "each.js"
        // import "first.js"
        // import "hasClass.js"
        // import "height.js"
        // import "html.js"
        // import "insertAfter.js"
        // import "insertBefore.js"
        // import "mq.js"
        // import "off.js"
        // import "offset.js"
        // import "on.js"
        // import "outerHeight.js"
        // import "outerWidth.js"
        // import "parent.js"
        // import "position.js"
        // import "ready.js"
        // import "remove.js"
        // import "removeClass.js"
        // import "scrollLeft.js"
        // import "scrollTop.js"
        // import "serialize.js"
        // import "text.js"
        // import "toggleClass.js"
        // import "trigger.js"
        // import "unwrap.js"
        // import "val.js"
        // import "width.js"
        // import "wrap.js"

    }

}
