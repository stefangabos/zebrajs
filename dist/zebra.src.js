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

        /**
         *  Adds one or more classes to each element in the set of matched elements.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.add}
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // add a single class
         *  elements.addClass('some-class');
         *
         *  // add multiple classes
         *  elements.addClass('some-class some-other-class');
         *
         *  // since this method returns the set of matched elements, we can use chaining
         *  elements.addClass('some-class some-other-class').css('display', 'none');

         *  @param  {string}    class_name  One or more space-separated class names to be added to each element in the
         *                                  set of matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {$}         Returns the set of matched elements, for chaining.
         */
        this.addClass = function(class_name) {

            var i, j;

            // split by space and create an array
            class_name = class_name.split(' ');

            // iterate through the set of matched elements
            for (i in elements)

                // iterate through the class names to add
                for (j in class_name)

                    // add class
                    elements[i].classList.add(class_name[j]);

            // return the set of matched elements, for chaining
            return $this;

        };


        /**
         *  @todo   Needs to be written!
         */
        this.ajax = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.append = function(element) {

            var i, j;

            // if element to append is an $ object, we'll use the array of DOM elements
            if (element instanceof $) element = element.get();

            // if element to append is a DOM node, wrap it in an array
            else if (element instanceof Element) element = [element];

            // if element to append is not a string, don't go further
            else if (typeof element !== 'string') return false;

            // iterate through the set of matched elements
            for (i in elements)

                // if element to append is actually a string
                if (typeof element === 'string')

                    // add it like this
                    elements[i].insertAdjacentHTML('beforeend', element);

                // since element has to be an array of DOM elements
                // iterate over the array of DOM elements
                else for (j in element)

                    // append each node to the parent
                    elements[i].appendChild(element[j]);

        }

        /**
         *  Gets the value of an attribute for the first element in the set of matched elements, or sets one or more attributes
         *  for every matched element.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute setAttribute},
         *  > {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute getAttribute} and
         *  > {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute removeAttribute}.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // get the value of an attribute for the first
         *  // element in the set of matched elements
         *  elements.attr('id');
         *
         *  // set a single attribute
         *  elements.attr('title', 'title');
         *
         *  // set multiple attributes
         *  elements.attr({
         *      title: 'title',
         *      href: 'href'
         *  });
         *
         *  // remove an attribute
         *  elements.attr('title', false);
         *
         *  // since this method returns the set of matched elements, we can use chaining
         *  elements.attr('title', 'title').removeClass('classname');
         *
         *  @param  {string|object} attribute   If given as a `string` representing an attribute and `value` **is not** set, this
         *                                      method will return that particular attribute's value for the first element in the
         *                                      set of matched elements.
         *                                      <br><br>
         *                                      If given as a `string` representing an attribute and `value` **is** set, this
         *                                      method will set that particular attribute's value for all the elements in the
         *                                      set of matched elements.
         *                                      <br><br>
         *                                      If given as an `object`, this method will set the given attributes to the given
         *                                      values for all the elements in the set of matched elements.
         *
         *  @param  {string}        [value]     The value to be set for the attribute given as argument. *Only used if `attribute`
         *                                      is not an object!*
         *                                      <br><br>
         *                                      Setting it to `false` or `null` will instead **remove** the attribute from the
         *                                      set of matched elements.
         *
         *  @return {$|mixed}   When `setting` attributes, this method returns the set of matched elements, for chaining.
         *                      When `reading` attributes, this method returns the value of the required attribute.
         */
        this.attr = function(attribute, value) {

            var i, j;

            // if attribute argument is an object
            if (typeof attribute === 'object')

                // iterate over the set of matched elements
                for (i in elements)

                    // iterate over the attributes
                    for (j in attribute)

                        // set each attribute
                        elements[i].setAttribute(j, attribute[j]);

            // if attribute argument is a string
            else if (typeof attribute === 'string')

                // if the value argument is provided
                if (undefined !== value)

                    // iterate over the set of matched elements
                    for (i in elements)

                        // if value argument's value is FALSE or NULL
                        if (value === false || value === null)

                            // remove the attribute
                            elements[i].removeAttribute(attribute);

                        // for other values, set the attribute's property
                        else elements[i].setAttribute(attribute, value);

                // if the value argument is not provided
                else

                    // return the value of the requested attribute
                    // of the first element in the set of matched elements
                    return elements[0].getAttribute(attribute);

            // if we get this far, return the set of matched elements, for chaining
            return elements;

        }

        /**
         *  Gets the value of a computed style property for the first element in the set of matched elements, or sets one or more
         *  CSS properties for every matched element.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // get the value of a computed style property
         *  // for the first element in the set of matched elements
         *  elements.css('width');
         *
         *  // set a single CSS property
         *  elements.css('position', 'absolute');
         *
         *  // set multiple CSS properties
         *  elements.css({
         *      position: 'absolute',
         *      left: 0,
         *      top: 0
         *  });
         *
         *  // remove a property
         *  elements.attr('position', false);
         *
         *  // since this method returns the set of matched elements, we can use chaining
         *  elements.css('position', 'absolute').removeClass('classname');
         *
         *  @param  {string|object} property    If given as a `string` representing a CSS property and `value` **is not** set,
         *                                      this method will return the computed style of that particular property for the
         *                                      first element in the set of matched elements.
         *                                      <br><br>
         *                                      If given as a `string` representing a CSS property and `value` **is** set, this
         *                                      method will set that particular CSS property's value for all the elements in the
         *                                      set of matched elements.
         *                                      <br><br>
         *                                      If given as an `object`, this method will set the given CSS properties to the
         *                                      given values for all the elements in the set of matched elements.
         *                                      <br><br>
         *                                      When reading CSS properties, this method acts as a wrapper for
         *                                      {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}
         *
         *  @param  {string}        [value]     The value to be set for the CSS property given as argument. *Only used if `property`
         *                                      is not an object!*
         *                                      <br><br>
         *                                      Setting it to `false` or `null` will instead **remove** the CSS property from the
         *                                      set of matched elements.
         *
         *  @return {$|mixed}   When `setting` CSS properties, this method returns the set of matched elements, for chaining.
         *                      When `reading` CSS properties, this method returns the value(s) of the required computed style(s).
         */
        this.css = function(property, value) {

            var i, j, computedStyle;

            // if "property" is an object and "value" is not set
            if (typeof property === 'object')

                // iterate through the set of matched elements
                for (i in elements)

                    // iterate through the "properties" object
                    for (j in property)

                        // set each style property
                        elements[i].style[j] = property[j];

            // if "property" is not an object, and "value" argument is set
            else if (undefined !== value)

                // iterate through the set of matched elements
                for (i in elements)

                    // if value argument's value is FALSE or NULL
                    if (value === false || value === null)

                        // remove the CSS property
                        elements[i].style[property] = null

                    // set the respective style property
                    else elements[i].style[property] = value;

            // if "property" is not an object and "value" is not set
            // return the value of the given CSS property, or "undefined" if property is not available
            else {

                // get the first element's computed styles
                computedStyle = window.getComputedStyle(elements[0]);

                // return the sought property's value
                return computedStyle[property];

            }

            // if we get this far, return the matched elements, for chaining
            return $this;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.data = function() {

        }

        /**
         *  Iterates over the set of matched elements, executing a callback function for each element in the set.
         *
         *  @param  {function}  callback    The function to execute for each item in the set. The callback function
         *                                  receives as single argument the element's position in the set, called `index`
         *                                  (0-based). The `this` keyword inside the callback function refers to the
         *                                  wrapped element (in a "$" object) the callback function is currently applied
         *                                  to.
         *                                  <br><br>
         *                                  *Use {@link $#_dom _dom()} to refer to the DOM node instead.*
         *                                  <br><br>
         *                                  *Returning `FALSE` from the callback function breaks the loop!*
         *
         *  @example
         *
         *  $('selector').each(function(index) {
         *
         *      // show the element's index in the set
         *      console.log(index);
         *
         *      // remember, the "this" keyword refers
         *      // to the wrapped element (in a "$" object)
         *      this.css('display', 'none');
         *
         *      // the original DOM node
         *      console.log(this._dom());
         *
         *  });
         */
        this.each = function(callback) {

            // iterate through the set of matched elements
            for (var i in elements)

                //  apply the callback function (the index is the argument to the function, while the "this" keyword
                //  inside the callback function refers to wrapped element (in a "$" object)
                //  returning false from the callback function exists the loop
                if (callback.call(new $(elements[i]), i) === false) return;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.first = function() {

        }

        /**
         *  Checks whether *any* of the matched elements have the given class.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.contains}
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // check if matched elements have a certain class
         *  var class_exists = elements.hasClass('some-class');
         *
         *  // since this method returns the set of matched elements, we can use chaining
         *  elements.toggleClass('some-class');
         *
         *  @param  {string}    class_name  The name of a class to be checked if it exists on *any* of the elements in the set
         *                                  of matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {boolean}   Returns TRUE if the sought class exists in *any* of the elements in the set of matched elements.
         */
        this.hasClass = function(class_name) {

            // iterate through the set of matched elements
            for (var i in elements)

                // if sought class exists, return TRUE
                if (elements[i].classList.contains(class_name)) return true;

            // return FALSE if we get this far
            return false;

        }

        /**
         *  Returns the current computed **inner** height (without `padding`, `border` and `margin`) of the first element
         *  in the set of matched elements as `float`, or sets the `height` CSS property of every element in the set.
         *
         *  > When retrieving the height, this method uses the {@link $#css .css} method (which use JavaScript's
         *  {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}), and uses
         *  JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style style} when setting the height
         *  of elements.
         *
         *  See {@link $#outerHeight .outerHeight()} for getting the height including `padding`, `border` and, optionally,
         *  `margin`.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // returns the current computed inner height of the first element in the set of matched elements
         *  elements.height();
         *
         *  // sets the "height" CSS property of all elements in the set to 200px
         *  elements.height(200);
         *  elements.height('200');
         *  elements.height('200px');
         *
         *  // sets the "height" CSS property of all elements in the set to 5em
         *  elements.height('5em');
         *
         *  // when setting the height, you can use chaining
         *  elements.height(200).addClass('some-class');
         *
         *  @param  {undefined|number|string}   [height]    If not given, the method will return the computed **inner**
         *                                                  height (without `padding`, `border` and `margin`) for the first
         *                                                  element in the set of matched elements.
         *                                                  <br><br>
         *                                                  If given, the method will set the `height` CSS property of all
         *                                                  the elements in the set to that particular value, making sure
         *                                                  to apply the "px" suffix if not otherwise specified.
         *
         *  > For hidden elements the returned value is `0`!
         *
         *  @return {$|float}   When **setting** the `height`, this method returns the set of matched elements, for chaining.
         *                      Otherwise, it returns the current computed **inner** height (without `padding`, `border` and
         *                      `margin`) of the first element in the set of matched elements, as `float`.
         */
        this.height = function(height) {

            // if "height" is given, set the height of every matched element, making sure to suffix the value with "px"
            // if not otherwise specified
            if (height) return this.css('height', height + (parseFloat(height) === height ? 'px' : ''));

            // if "height" is not given, return the height of the first element in the set
            // or 0 if that yields NaN
            return parseFloat(window.getComputedStyle(elements[0], null).height) || 0;

        }

        /**
         *  Gets the HTML content of the first element in the set of matched elements, or set the HTML content of every matched
         *  element.
         *
         *  > This method is a wrapper for JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML innerHTML}
         *
         *  > There are some {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#Security_considerations security considerations}
         *  that you should be aware of when using this method.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // set the HTML content for all the matched elements
         *  elements.html('<p>Hello</p>');
         *
         *  // get the HTML content of the first
         *  // element in the set of matched elements
         *  var content = elements.html();
         *
         *  // since this method returns the set of matched elements,
         *  // we can use chaining
         *  elements.html('<p>Hello</p>').addClass('some-class');

         *  @param  {string}    [content]   The HTML content to set as the content of all the matched elements. Note that any
         *                                  content that was previously in that element is completely replaced by the new
         *                                  content.
         *
         *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched elements,
         *                                  for chaining. Otherwise it returns the HTML content of the first element in the set
         *                                  of matched elements.
         */
        this.html = function(content) {

            var i;

            // if content is provided
            if (content)

                // iterate through the set of matched elements
                for (i in elements)

                    // set the HTML content of each element
                    elements[i].innerHTML = content;

            // if content is not provided
            // return the content of the first element in the set of matched elements
            else return elements[0].innerHTML;

            // return the set of matched elements, for chaining
            return $this;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.insertAfter = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.insertBefore = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.mq = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.off = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.offset = function() {

            var i = elements[0].getBoundingClientRect();

            return {
                top: i.top + window.pageYOffset - document.documentElement.clientTop,
                left: i.left + window.pageXOffset - document.documentElement.clientLeft
            }

        }

        /**
         *  @todo   Needs to be written!
         */
        this.on = function(event_name, callback) {

            for (var i in elements)
                elements[i].addEventListener(event_name, callback.call(this));

        }

        /**
         *  Returns the current computed height for the first element in the set of matched elements, including `padding`,
         *  `border` and, optionally, `margin`.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}.
         *
         *  > For hidden elements the returned value is `0`!
         *
         *  See {@link $#height .height()} for getting the **inner** height without `padding`, `border` and `margin`.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('selector');
         *
         *  // get the element's outer height
         *  var height = element.outerHeight();
         *
         *  @param  {boolean}   [include_margins]   If set to `TRUE`, the result will also include **top** and **bottom**
         *                                          margins.
         *
         *  @return {float}
         */
        this.outerHeight = function(include_margins) {

            // get the values of all the CSS properties of the element
            // after applying the active stylesheets and resolving any
            // basic computation those values may contain
            var computed_style = window.getComputedStyle(elements[0]);

            // return the result of inner height together with
            return (parseFloat(computed_style.height) +

                // top and bottom paddings
                parseFloat(computed_style.paddingTop) + parseFloat(computed_style.paddingBottom) +

                // top and bottom borders
                parseFloat(computed_style.borderTopWidth) + parseFloat(computed_style.borderBottomWidth) +

                // include margins, if requested
                (include_margins ? parseFloat(computed_style.marginTop) + parseFloat(computed_style.marginBottom) : 0)) || 0;

        }

        /**
         *  Returns the current computed width for the first element in the set of matched elements, including `padding`,
         *  `border` and, optionally, `margin`.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}.
         *
         *  > For hidden elements the returned value is `0`!
         *
         *  See {@link $#width .width()} for getting the **inner** width without `padding`, `border` and `margin`.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('selector');
         *
         *  // get the element's outer width
         *  var height = element.outerWidth();
         *
         *  @param  {boolean}   [include_margins]   If set to `TRUE`, the result will also include **left** and **right**
         *                                          margins.
         *
         *  @return {float}
         */
        this.outerWidth = function(include_margins) {

            // get the values of all the CSS properties of the element
            // after applying the active stylesheets and resolving any
            // basic computation those values may contain
            var computed_styles = window.getComputedStyle(elements[0]);

            // return the result of inner width together with
            return (parseFloat(computed_styles.width) +

                // left and right paddings
                parseFloat(computed_styles.paddingLeft) + parseFloat(computed_styles.paddingRight) +

                // left and right borders
                parseFloat(computed_styles.borderLeftWidth) + parseFloat(computed_styles.borderRightWidth) +

                // include margins, if requested
                (include_margins ? parseFloat(computed_styles.marginLeft) + parseFloat(computed_styles.marginRight) : 0)) || 0;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.parent = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.position = function() {

            return {
                left: parseFloat(elements[0].offsetLeft),
                top: parseFloat(elements[0].offsetTop)
            }

        }

        /**
         *  @todo   Needs documentation!
         */
        this.ready = function(callback) {

            if (document.readyState === 'complete' || document.readyState !== 'loading') callback();

            else document.addEventListener('DOMContentLoaded', callback);

        }

        /**
         *  @todo   Needs to be written!
         */
        this.remove = function() {

        }

        /**
         *  Removes one or more classes from each element in the set of matched elements.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.remove}
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // remove a single class
         *  elements.removeClass('some-class');
         *
         *  // remove multiple classes
         *  elements.removeClass('some-class some-other-class');
         *
         *  // since this method returns the set of matched elements, we can use chaining
         *  elements.removeClass('some-class some-other-class').css('display', 'none');
         *
         *  @param  {string}    class_name  One or more space-separated class names to be removed from each element in
         *                                  the set of matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {$}         Returns the set of matched elements, for chaining.
         */
        this.removeClass = function(class_name) {

            var i, j;

            // split by space and create an array
            class_name = class_name.split(' ');

            // iterate through the set of matched elements
            for (i in elements)

                // iterate through the class names to remove
                for (j in class_name)

                    // remove class
                    elements[i].classList.remove(class_name[j]);

            // return the set of matched elements, for chaining
            return $this;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.scrollLeft = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.scrollTop = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.serialize = function() {

        }

        /**
         *  Gets the text content of the first element in the set of matched elements (combined with the text content of all its
         *  descendants), or sets the text contents of the matched elements.
         *
         *  > This method is a wrapper for JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent textContent}
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // set the text content for all the matched elements
         *  elements.text('Hello');
         *
         *  // get the text content of the first element in the
         *  // set of matched elements (including its descendants)
         *  var content = elements.text();
         *
         *  // since this method returns the set of matched elements,
         *  // we can use chaining
         *  elements.text('Hello').addClass('some-class');

         *  @param  {string}    [content]   The text to set as the content of all the matched elements. Note that any text
         *                                  content that was previously in that element is completely replaced by the new
         *                                  content.
         *
         *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched elements,
         *                                  for chaining. Otherwise it returns the text content of the first element in the set
         *                                  of matched elements (combined with the text content of all its descendants)
         */
        this.text = function(content) {

            var i;

            // if content is provided
            if (content)

                // iterate through the set of matched elements
                for (i in elements)

                    // set the text content of each element
                    elements[i].textContent = content;

            // if content is not provided
            // return the text content of the first element in the set of matched elements
            // (combined with the text content of all its descendants)
            else return elements[0].textContent;

            // return the set of matched elements, for chaining
            return $this;

        }

        /**
         *  Adds or removes one or more classes from each element in the set of matched elements, depending on the presence of
         *  each class name given as argument.
         *
         *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.contains},
         *  > {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.add} and
         *  > {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.remove}.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // set a random class
         *  elements.addClass('some-class');
         *
         *  // toggle classes
         *  // the result will be that "some-class" will be removed from the matched elements while the "other-class" will be added
         *  elements.toggleClass('some-class other-class');
         *
         *  // since this method returns the set of matched elements, we can use chaining
         *  elements.toggleClass('some-class').css('display', 'none');
         *
         *  @param  {string}    class_name  One or more space-separated class names to be toggled for each element in the set of
         *                                  matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {$}         Returns the set of matched elements, for chaining.
         */
        this.toggleClass = function(class_name) {

            var i, j;

            // split by space and create an array
            class_name = class_name.split(' ');

            // iterate through the set of matched elements
            for (i in elements)

                // iterate through the class names to remove
                for (j in class_name)

                    // if class is present, remove it
                    if (elements[i].classList.contains(class_name[j])) elements[i].classList.remove(class_name[j]);

                    // if class is not present, add it
                    else elements[i].classList.add(class_name[j]);

            // return the set of matched elements, for chaining
            return $this;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.trigger = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.unwrap = function() {

        }

        /**
         *  @todo   Needs to be written!
         */
        this.val = function() {

        }

        /**
         *  Returns the current computed **inner** width (without `padding`, `border` and `margin`) of the first element
         *  in the set of matched elements as `float`, or sets the `width` CSS property of every element in the set.
         *
         *  > When retrieving the width, this method uses the {@link $#css .css} method (which use JavaScript's
         *  {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}), and uses
         *  JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style style} when setting the width
         *  of elements.
         *
         *  See {@link $#outerWidth .outerWidth()} for getting the width including `padding`, `border` and, optionally,
         *  `margin`.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // returns the current computed inner width of the first element in the set of matched elements
         *  elements.width();
         *
         *  // sets the "width" CSS property of all elements in the set to 200px
         *  elements.width(200);
         *  elements.width('200');
         *  elements.width('200px');
         *
         *  // sets the "width" CSS property of all elements in the set to 5em
         *  elements.width('5em');
         *
         *  // when setting the width, you can use chaining
         *  elements.width(200).addClass('some-class');
         *
         *  @param  {undefined|number|string}   [width]     If not given, this method will return the computed **inner**
         *                                                  width (without `padding`, `border` and `margin`) of the first
         *                                                  element in the set of matched elements.
         *                                                  <br><br>
         *                                                  If given, this method will set the `width` CSS property of all
         *                                                  the elements in the set to that particular value, making sure
         *                                                  to apply the "px" suffix if not otherwise specified.
         *
         *  > For hidden elements the returned value is `0`!
         *
         *  @return {$|float}   When **setting** the `width`, this method returns the set of matched elements, for chaining.
         *                      Otherwise, it returns the current computed **inner** width (without `padding`, `border` and
         *                      `margin`) of the first element in the set of matched elements, as `float`.
         */
        this.width = function(width) {

            // if "width" is given, set the width of every matched element, making sure to suffix the value with "px"
            // if not otherwise specified
            if (width) return this.css('width', width + (parseFloat(width) === width ? 'px' : ''));

            // if "width" is not given, return the width of the first element in the set
            // or 0 if that yields NaN
            return parseFloat(window.getComputedStyle(elements[0], null).width) || 0;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.wrap = function() {

        }


    }

}
