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
            else if (parent instanceof $) parent = parent.get(0);

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

        // if
        } else if (

            // selector is the Document object, a DOM node, the Window object or a text node OR
            (typeof selector === 'object' && (selector instanceof Document || selector instanceof Element || selector instanceof Text || selector instanceof Window)) ||

            // an array of DOM elements
            Array.isArray(selector)

        // return the new "$" object
        ) return new $(selector);

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
            elements = (selector instanceof Document || selector instanceof Element || selector instanceof Text || selector instanceof Window ? [selector] : [].concat(selector)),

            // we'll use this when generating random IDs
            internal_counter = 0;

        /**
         *  @todo   Needs documentation!
         *
         *  @access public
         */
        this.get = function(index) {
            return index !== undefined ? elements[index] : elements;
        }

        /**
         *  Private helper method used by {@link $#addClas .addCLass()}, {@link $#removeClass .removeClass()} and
         *  {@link $#toggleClass .toggleClass()} methods.
         *
         *  @param  {string}    action      What to do with the class(es)
         *                                  <br><br>
         *                                  Possible values are `add`, `remove` and `toggle`.
         *
         *  @param  {string}    class_names One or more space-separated class names to be added/removed/toggled for each element
         *                                  in the set of matched elements.
         *
         *  @return {$}     Returns the set of matched elements (the parents, not the appended elements), for chaining.
         *
         *  @access private
         */
        this._class = function(action, class_names) {

            // split by space and create an array
            class_names = class_names.split(' ');

            // iterate through the set of matched elements
            elements.forEach(function(element) {

                // iterate through the class names to add
                class_names.forEach(function(class_name) {

                    // add or remove class(es)
                    element.classList[action === 'add' || (action === 'toggle' && !element.classList.contains(class_name)) ? 'add' : 'remove'](class_name);

                });

            });

            // return the set of matched elements, for chaining
            return $this;

        }

        /**
         *  Private helper method used by {@link $#append .append()}, {@link $#appendTo .appendTo()}, {@link $#after .after()},
         *  {@link $#insertAfter .insertAfter()}, {@link $#before .before()}, {@link $#insertBefore .insertBefore()},
         *  {@link $#prepend .prepend()} and {@link $#prependTo .prependTo()} methods.
         *
         *  @param  {mixed}     content     Depending on the caller method this is the DOM element, text node, HTML string, or
         *                                  ZebraJS object to insert in the DOM.
         *
         *  @param  {string}    where       Indicated where the content should be inserted, relative to the set of matched elements.
         *                                  <br><br>
         *                                  Possible values are `after`, `append` and `before`.
         *
         *  @return {$}     Returns the set of matched elements (the parents, not the appended elements), for chaining.
         *
         *  @access private
         */
        this._dom_insert = function(content, where) {

            // if element to append is an $ object, we'll use the array of DOM elements
            if (content instanceof $) content = content.get();

            // if content to append is a DOM element or a text node, wrap it in an array
            else if (content instanceof Element || content instanceof Text) content = [content];

            // if content to append is not a string, don't go further
            else if (typeof content !== 'string') return false;

            // iterate through the set of matched elements
            elements.forEach(function(element) {

                // if content to append is a string (plain text or HTML)
                if (typeof content === 'string')

                    // insert content like this
                    element.insertAdjacentHTML((where === 'after' || where === 'prepend' ? 'after' : 'before') + (where === 'after' || where === 'append' ? 'end' : 'begin'), content);

                // since content is an array of DOM elements or text nodes
                // iterate over the array
                else content.forEach(function(item, index) {

                    // where the content needs to be moved in the DOM
                    switch (where) {

                        // insert a clone after each target except for the last one after which we insert the original content
                        case 'after': element.parentNode.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element.nextSibling); break;

                        // add a clone to each parent except for the last one where we add the original content
                        case 'append': element.appendChild(index < elements.length - 1 ? item.cloneNode(true) : item); break;

                        // insert a clone before each target except for the last one before which we insert the original content
                        case 'before': element.parentNode.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element); break;

                        // prepend a clone to each parent except for the last one where we add the original content
                        case 'prepend': element.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element.firstChild); break;

                    }

                });

            });

            // return the set of matched elements, for chaining
            return $this;

        }

        /**
         *  Private helper method used by {@link $#children .children()}, {@link $#siblings .siblings()}, {@link $#nexr .next()}
         *  and {@link $#prev .prev()} methods.
         *
         *  @param  {string}    action      Specified what type of elements to look for
         *                                  <br><br>
         *                                  Possible values are `children` and `siblings`.
         *
         *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
         *                                  match it.
         *
         *  @return {$}     Returns the found elements, as a ZebraJS object
         *
         *  @access private
         */
        this._dom_search = function(action, selector) {

            var result = [], remove_id, root, tmp;

            // iterate through the set of matched elements
            elements.forEach(function(element) {

                remove_id = false;

                // if selector is specified
                if (selector) {

                    // if we're looking for children nodes, the root element is the element itself
                    if (action === 'children') root = element;

                    // otherwise, the root element is the element's parent node
                    else root = element.parentNode;

                    // if the root element doesn't have an ID,
                    // generate and set a random ID for the element's parent node
                    if (null === root.getAttribute('id')) root.setAttribute('id', $this._random('id'));

                    // set this flag so that we know to remove the randomly generated ID when we're done
                    remove_id = true;

                }

                // if we're looking for siblings
                if (action === 'siblings')

                    // get the element's parent's children nodes which, optionally, match a given selector
                    // and add them to the results array
                    result = result.concat(Array.prototype.filter.call(selector ? element.parentNode.querySelectorAll('#' + element.parentNode.id + '>' + selector) : element.parentNode.children, function(child) {

                        // skip the current element
                        return child !== element;

                    }));

                // if we're looking for children
                else if (action === 'children')

                    // get the element's children nodes which, optionally, match a given selector
                    // and add them to the results array
                    result = result.concat(Array.prototype.slice.call(selector ? element.parentNode.querySelectorAll('#' + element.id + '>' + selector) : element.children));

                // if we're looking next/previous sibling
                else if (action === 'previous' || action === 'next')

                    // if there's no selector specified
                    if (!selector)

                        // add it to the results array
                        result = result.concat([element[(action === 'next' ? 'next' : 'previous') + 'ElementSibling']]);

                    // if selector is specified
                    else {

                        tmp = [];

                        // get the element's sibling nodes which, optionally, match a given selector and add them to the results array
                        Array.prototype.filter.call(element.parentNode.querySelectorAll('#' + element.parentNode.id + '>' + selector), function(child) {

                            // add all elements that are after (when looking for next sibling) or before (when looking for previous sibling) the current element
                            return (action === 'next' ? (child === element || tmp.indexOf(element) > -1) && tmp.push(child) : tmp.indexOf(element) === -1 && tmp.push(child));

                        });

                        // add to the results array
                        result = result.concat(tmp.length >= 2 ? tmp[tmp.length - 2] : []);

                    }

                // if present, remove the randomly generated ID
                // we remove the randomly generated ID from the element
                if (remove_id) root.removeAttribute('id');

            });

            // return the result, as a ZebraJS object
            return $(result);

        }

        /**
         *  Private helper method
         *
         *  @access private
         */
        this._random = function(prefix) {

            // if the internal counter is too large, reset it
            if (internal_counter > Number.MAX_VALUE) internal_counter = 0;

            // return a pseudo-random string by incrementing the internal counter
            return prefix + '_' + internal_counter++;
        }

        /**
         *  Adds one or more classes to each element in the set of matched elements.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // add a single class
         *  elements.addClass('classname');
         *
         *  // add multiple classes
         *  elements.addClass('classname otherclassname');
         *
         *  // chaining
         *  elements.addClass('classname otherclassname').css('display', 'none');

         *  @param  {string}    class_name  One or more space-separated class names to be added to each element in the
         *                                  set of matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {$}         Returns the set of matched elements.
         */
        this.addClass = function(class_name) {

            // add class(es) and return the set of matched elements
            return this._class('add', class_name);

        };


        /**
         *  Inserts content, specified by the argument, after each element in the set of matched elements.
         *
         *  Both this and the {@link $#insertAfter .insertAfter()} method perform the same task, the main difference being in the
         *  placement of the content and the target. With `.after()`, the selector expression preceding the method is the target
         *  after which the content is to be inserted. On the other hand, with `.insertAfter()`, the content precedes the method,
         *  and it is the one inserted after the target element.
         *
         *  > If there is more than one target element, clones of the inserted element will be created after each target except
         *  for the last one. The original item will be inserted after the last target.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created
         *  after each target except for the last one. The original item will be moved (not cloned) after the last target.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var target = $('#selector');
         *
         *  // insert a div that we create on the fly
         *  target.after($('<div>').text('hello'));
         *
         *  // same thing as above
         *  target.after($('<div>hello</div>'));
         *
         *  // use one or more elements that already exist on the page
         *  // if "target" is a single element than the list will be moved after the target element
         *  // if "parent" is a collection of elements, clones of the list element will be created after
         *  // each target, except for the last one; the original list will be moved after the last target
         *  target.after($('ul'));
         *
         *  // insert a string (which will be transformed in HTML)
         *  // this is more efficient memory wise
         *  target.append('<div>hello</div>');
         *
         *  // chaining
         *  target.append($('div')).addClass('classname');
         *
         *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to be inserted after each
         *                                  element in the set of matched elements.
         *
         *  @return {$}         Returns the set of matched elements (the parents, not the inserted elements).
         */
        this.after = function(content) {

            // call the "_dom_insert" private method with these arguments
            return this._dom_insert(content, 'after');

        }

        /**
         *  @todo   Needs to be written!
         */
        this.ajax = function() {

        }

        /**
         *  Inserts content, specified by the argument, to the end of each element in the set of matched elements.
         *
         *  Both this and the {@link $#appendTo .appendTo()} method perform the same task, the main difference being in the placement
         *  of the content and the target. With `.append()`, the selector expression preceding the method is the container into
         *  which the content is to be inserted. On the other hand, with `.appendTo()`, the content precedes the method, and it
         *  is inserted into the target container.
         *
         *  > If there is more than one target element, clones of the inserted element will be created for each target except for
         *  the last one. For the last target, the original item will be inserted.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created for
         *  each target except for the last one. For the last target, the original item will be moved (not cloned).
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var parent = $('#selector');
         *
         *  // append a div that we create on the fly
         *  parent.append($('<div>').text('hello'));
         *
         *  // same thing as above
         *  parent.append($('<div>hello</div>'));
         *
         *  // append one or more elements that already exist on the page
         *  // if "parent" is a single element than the list will be moved inside the parent element
         *  // if "parent" is a collection of elements, clones of the list element will be created for
         *  // each target except for the last one; for the last target, the original list will be moved
         *  parent.append($('ul'));
         *
         *  // append a string (which will be transformed in HTML)
         *  // this is more efficient memory wise
         *  parent.append('<div>hello</div>');
         *
         *  // chaining
         *  parent.append($('div')).addClass('classname');
         *
         *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to insert at the end of each
         *                                  element in the set of matched elements.
         *
         *  @return {$}         Returns the set of matched elements (the parents, not the appended elements).
         */
        this.append = function(content) {

            // call the "_dom_insert" private method with these arguments
            return this._dom_insert(content, 'append');

        }

        /**
         *  Inserts every element in the set of matched elements to the end of the parent element(s), specified by the argument.
         *
         *  Both this and the {@link $#append .append()} method perform the same task, the main difference being in the placement
         *  of the content and the target. With `.append()`, the selector expression preceding the method is the container into
         *  which the content is to be inserted. On the other hand, with `.appendTo()`, the content precedes the method, and it
         *  is inserted into the target container.
         *
         *  > If there is more than one target element, clones of the inserted element will be created for each target except for
         *  the last one. For the last target, the original item will be inserted.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created for
         *  each target except for the last one. For the last target, the original item will be moved (not cloned).
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var parent = $('#selector');
         *
         *  // append a div that we create on the fly
         *  $('<div>').text('hello').appendTo(parent);
         *
         *  // same thing as above
         *  $('<div>hello</div>').appendTo(parent);
         *
         *  // append one or more elements that already exist on the page
         *  // if "parent" is a single element than the list will be moved inside the parent element
         *  // if "parent" is a collection of elements, clones of the list element will be created for
         *  // each target except for the last one; for the last target, the original list will be moved
         *  $('ul').appendTo(parent);
         *
         *  @param  {$}     parent      A ZebraJS object at end of which to insert each element in the set of matched elements.
         *
         *  @return {$}     Returns the ZebraJS object you are appending to.
         */
        this.appendTo = function(parent) {

            // call the "_dom_insert" private method with these arguments
            return $(parent)._dom_insert(this, 'append');

        }

        /**
         *  Gets the value of an attribute for the first element in the set of matched elements, or sets one or more attributes
         *  for every matched element.
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
         *  // chaining
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
         *  @return {$|mixed}   When `setting` attributes, this method returns the set of matched elements.
         *                      When `reading` attributes, this method returns the value of the required attribute.
         */
        this.attr = function(attribute, value) {

            var i, j;

            // if attribute argument is an object
            if (typeof attribute === 'object')

                // iterate over the set of matched elements
                elements.forEach(function(element) {

                    // iterate over the attributes
                    for (i in attribute)

                        // set each attribute
                        element.setAttribute(j, attribute[j]);

                });

            // if attribute argument is a string
            else if (typeof attribute === 'string')

                // if the value argument is provided
                if (undefined !== value)

                    // iterate over the set of matched elements
                    elements.forEach(function(element) {

                        // if value argument's value is FALSE or NULL
                        if (value === false || value === null)

                            // remove the attribute
                            element.removeAttribute(attribute);

                        // for other values, set the attribute's property
                        else element.setAttribute(attribute, value);

                    });

                // if the value argument is not provided
                else

                    // return the value of the requested attribute
                    // of the first element in the set of matched elements
                    return elements[0].getAttribute(attribute);

            // if we get this far, return the set of matched elements
            return $this;

        }

        /**
         *  Inserts content, specified by the argument, before each element in the set of matched elements.
         *
         *  Both this and the {@link $#insertBefore .insertBefore()} method perform the same task, the main difference being in the
         *  placement of the content and the target. With `.before()`, the selector expression preceding the method is the target
         *  before which the content is to be inserted. On the other hand, with `.insertBefore()`, the content precedes the method,
         *  and it is the one inserted before the target element.
         *
         *  > If there is more than one target element, clones of the inserted element will be created before each target except
         *  for the last one. The original item will be inserted before the last target.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created
         *  before each target except for the last one. The original item will be moved (not cloned) before the last target.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var target = $('#selector');
         *
         *  // insert a div that we create on the fly
         *  target.before($('<div>').text('hello'));
         *
         *  // same thing as above
         *  target.before($('<div>hello</div>'));
         *
         *  // use one or more elements that already exist on the page
         *  // if "target" is a single element than the list will be moved before the target element
         *  // if "parent" is a collection of elements, clones of the list element will be created before
         *  // each target, except for the last one; the original list will be moved before the last target
         *  target.before($('ul'));
         *
         *  // insert a string (which will be transformed in HTML)
         *  // this is more efficient memory wise
         *  target.append('<div>hello</div>');
         *
         *  // chaining
         *  target.append($('div')).addClass('classname');
         *
         *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to be inserted before each
         *                                  element in the set of matched elements.
         *
         *  @return {$}         Returns the set of matched elements (the parents, not the inserted elements).
         */
        this.before = function(content) {

            // call the "_dom_insert" private method with these arguments
            return this._dom_insert(content, 'before');

        }

        /**
         *  Gets the children of each element in the set of matched elements, optionally filtered by a selector.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('#selector');
         *
         *  // get all the element's children
         *  var children_all = element.children();
         *
         *  // get all the "div" children of the element
         *  var children_filtered = element.children('div');
         *
         *  // chaining
         *  element.children('div').addClass('someclass');
         *
         *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
         *                                  match it.
         *
         *  @return {$}         Returns the children of each element in the set of matched elements, as a ZebraJS object.
         */
        this.children = function(selector) {

            // get the children of each element in the set of matched elements, optionally filtered by a selector
            return this._dom_search('children', selector);

        }

        /**
         *  @todo   Needs to be written!
         */
        this.closest = function() {

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
         *  // chaining
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
         *
         *  @param  {string}        [value]     The value to be set for the CSS property given as argument. *Only used if `property`
         *                                      is not an object!*
         *                                      <br><br>
         *                                      Setting it to `false` or `null` will instead **remove** the CSS property from the
         *                                      set of matched elements.
         *
         *  @return {$|mixed}   When `setting` CSS properties, this method returns the set of matched elements.
         *                      When `reading` CSS properties, this method returns the value(s) of the required computed style(s).
         */
        this.css = function(property, value) {

            var i, computedStyle;

            // if "property" is an object and "value" is not set
            if (typeof property === 'object')

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // iterate through the "properties" object
                    for (i in property)

                        // set each style property
                        element.style[i] = property[i];

                });

            // if "property" is not an object, and "value" argument is set
            else if (undefined !== value)

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // if value argument's value is FALSE or NULL
                    if (value === false || value === null)

                        // remove the CSS property
                        element.style[property] = null

                    // set the respective style property
                    else element.style[property] = value;

                });

            // if "property" is not an object and "value" is not set
            // return the value of the given CSS property, or "undefined" if property is not available
            else {

                // get the first element's computed styles
                computedStyle = window.getComputedStyle(elements[0]);

                // return the sought property's value
                return computedStyle[property];

            }

            // if we get this far, return the matched elements
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
         *                                  (0-based). The `this` keyword inside the callback function refers to the DOM element.
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
         *      // remember, inside the callback, the "this" keyword refers to the DOM element
         *      // so we'll have to use $() around it to transform it into a ZebraJS object
         *      // (as always, cache it if you need to use it more than once)
         *      $(this).css('display', 'none');
         *
         *  });
         *
         *  @return {undefined}
         */
        this.each = function(callback) {

            // iterate through the set of matched elements
            for (var i = 0; i < elements.length; i++)

                //  apply the callback function (the index is the argument to the function, while the "this" keyword
                //  inside the callback function refers to wrapped element (in a "$" object)
                //  returning false from the callback function exists the loop
                if (callback.call(elements[i], i) === false) return;

        }

        /**
         *  Gets the descendants of each element in the current set of matched elements, filtered by a selector, ZebraJS object,
         *  or an element you'd get by using document.getElementById.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('#selector');
         *
         *  // get find the element's div descendants
         *  var target = element.find('div');
         *
         *  // chaining
         *  element.find('div').addClass('someclass');
         *
         *  @param  {string}    selector    A selector to filter descendant elements by. It can be a query selector, a ZebraJS
         *                                  object, or an element you'd get by using document.getElementById.
         *
         *  @return {$}         Returns the descendants of each element in the current set of matched elements, filtered by a
         *                      selector, ZebraJS object, or an element you'd get by using document.getElementById, as a ZebraJS
         *                      object.
         */
        this.find = function(selector) {

            var result = [];

            // iterate through the set of matched elements
            elements.forEach(function(element) {

                // if selector is a ZebraJS object
                if (typeof selector === 'object' && selector instanceof $)

                    // iterate through the elements in the object
                    selector.get().forEach(function(wrapped) {

                        // if the elements are the same, add it to the results array
                        if (wrapped.isSameNode(element)) result.push(element);

                    });

                // selector is the Document object, a DOM node, the Window object
                else if (typeof selector === 'object' && (selector instanceof Document || selector instanceof Element || selector instanceof Window)) {

                    // if the elements are the same, add it to the results array
                    if (selector.isSameNode(element)) result.push(element);

                // selector is a string
                // get the descendants of the element that match the selector, and add them to the results array
                } else result.push(element.querySelector(selector));

            });

            // when it finds no elements, "querySelector" returns "null"
            // we'll filter those out now
            result = result.filter(function(entry) {
                return entry !== null;
            });

            // return the resulting array as a ZebraJS object
            return $(result);

        }

        /**
         *  Constructs a new ZebraJS object from the first element in the set of matched elements.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // returns the first element from the list of matched elements, as a ZebraJS object
         *  var first = elements.first();
         *
         *  @return {$}         Returns the first element from the list of matched elements, as a ZebraJS object
         */
        this.first = function() {

            // returns the first element from the list of matched elements, as a ZebraJS object
            return $(elements[0]);

        }

        /**
         *  Checks whether *any* of the matched elements have the given class.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // check if matched elements have a certain class
         *  var class_exists = elements.hasClass('classname');
         *
         *  // chaining
         *  elements.toggleClass('classname');
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
            for (var i = 0; i < elements.length; i++)

                // if sought class exists, return TRUE
                if (elements[i].classList.contains(class_name)) return true;

            // return FALSE if we get this far
            return false;

        }

        /**
         *  Returns the current computed **inner** height (without `padding`, `border` and `margin`) of the first element
         *  in the set of matched elements as `float`, or sets the `height` CSS property of every element in the set.
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
         *  // chaining
         *  elements.height(200).addClass('classname');
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
         *  @return {$|float}   When **setting** the `height`, this method returns the set of matched elements.
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
         *  // chaining
         *  elements.html('<p>Hello</p>').addClass('classname');

         *  @param  {string}    [content]   The HTML content to set as the content of all the matched elements. Note that any
         *                                  content that was previously in that element is completely replaced by the new
         *                                  content.
         *
         *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched
         *                                  elements. Otherwise it returns the HTML content of the first element in the set of
         *                                  matched elements.
         */
        this.html = function(content) {

            // if content is provided
            if (content)

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // set the HTML content of each element
                    element.innerHTML = content;

                });

            // if content is not provided
            // return the content of the first element in the set of matched elements
            else return elements[0].innerHTML;

            // return the set of matched elements
            return $this;

        }

        /**
         *  @todo   Needs to be written!
         */
        this.inArray = function() {

        }

        /**
         *  Inserts every element in the set of matched elements after the parent element(s), specified by the argument.
         *
         *  Both this and the {@link $#after .after()} method perform the same task, the main difference being in the
         *  placement of the content and the target. With `.after()`, the selector expression preceding the method is the target
         *  after which the content is to be inserted. On the other hand, with `.insertAfter()`, the content precedes the method,
         *  and it is the one inserted after the target element(s).
         *
         *  > If there is more than one target element, clones of the inserted element will be created after each target except
         *  for the last one. The original item will be inserted after the last target.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created
         *  after each target except for the last one. The original item will be moved (not cloned) after the last target.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var target = $('#selector');
         *
         *  // insert a div that we create on the fly
         *  $('<div>').text('hello').insertAfter(target);
         *
         *  // same thing as above
         *  $('<div>hello</div>').insertAfter(target);
         *
         *  // use one or more elements that already exist on the page
         *  // if "target" is a single element than the list will be moved after the target element
         *  // if "parent" is a collection of elements, clones of the list element will be created after
         *  // each target, except for the last one; the original list will be moved after the last target
         *  $('ul').insertAfter(target);
         *
         *  @param  {$}     target  A ZebraJS object after which to insert each element in the set of matched elements.
         *
         *  @return {$}     Returns the ZebraJS object after the content is inserted.
         */
        this.insertAfter = function(target) {

            // call the "_dom_insert" private method with these arguments
            return $(target)._dom_insert(this, 'after');

        }

        /**
         *  Inserts every element in the set of matched elements before the parent element(s), specified by the argument.
         *
         *  Both this and the {@link $#before .before()} method perform the same task, the main difference being in the
         *  placement of the content and the target. With `.before()`, the selector expression preceding the method is the target
         *  before which the content is to be inserted. On the other hand, with `.insertBefore()`, the content precedes the method,
         *  and it is the one inserted before the target element(s).
         *
         *  > If there is more than one target element, clones of the inserted element will be created before each target except
         *  for the last one. The original item will be inserted before the last target.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created
         *  before each target except for the last one. The original item will be moved (not cloned) before the last target.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var target = $('#selector');
         *
         *  // insert a div that we create on the fly
         *  $('<div>').text('hello').insertBefore(target);
         *
         *  // same thing as above
         *  $('<div>hello</div>').insertBefore(target);
         *
         *  // use one or more elements that already exist on the page
         *  // if "target" is a single element than the list will be moved before the target element
         *  // if "parent" is a collection of elements, clones of the list element will be created before
         *  // each target, except for the last one; the original list will be moved before the last target
         *  $('ul').insertBefore(target);
         *
         *  @param  {$}     target  A ZebraJS object before which to insert each element in the set of matched elements.
         *
         *  @return {$}     Returns the ZebraJS object before which the content is inserted.
         */
        this.insertBefore = function(target) {

            // call the "_dom_insert" private method with these arguments
            return $(target)._dom_insert(this, 'before');

        }

        /**
         *  @todo   Needs to be written!
         */
        this.mq = function() {

        }

        /**
         *  Gets the immediately following sibling of each element in the set of matched elements. If a selector is provided,
         *  it retrieves the following sibling only if it matches that selector.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('#selector');
         *
         *  // get the next sibling
         *  var next = element.next();
         *
         *  // get the following sibling only if it matches the selector
         *  var next = element.next('div');
         *
         *  // chaining
         *  element.next().addClass('someclass');
         *
         *  @param  {string}    selector    If the selector is provided, the method will retrieve the following sibling only if
         *                                  it matches the selector
         *
         *  @return {$}         Returns the immediately following sibling of each element in the set of matched elements,
         *                      optionally filtered by a selector, as a ZebraJS object.
         */
        this.next = function(selector) {

            // get the immediately preceding sibling of each element in the set of matched elements,
            // optionally filtered by a selector
            return this._dom_search('next', selector);

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
         *  Gets the immediate parent of each element in the current set of matched elements, optionally filtered by a selector.
         *
         *  This method is similar to {@link $#parents .parents()}, except .parent() only travels a single level up the DOM tree.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('#selector');
         *
         *  // get the element's parent
         *  var parent = element.parent();
         *
         *  // get the element's parent *only* if it is a div
         *  var parent = element.parent('div');
         *
         *  // chaining
         *  element.parent().addClass('someclass');
         *
         *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
         *                                  match it.
         *
         *  @return {$}         Returns the immediate parent of each element in the current set of matched elements, optionally
         *                      filtered by a selector, as a ZebraJS object.
         */
        this.parent = function(selector) {

            var result = [];

            // iterate through the set of matched elements
            elements.forEach(function(element) {

                // if no selector is provided or it is and the parent matches it, add element to the array
                if (!selector || element.parentNode.matches(selector)) result.push(element.parentNode);

            });

            // return the resulting array
            return $(result);

        }

        /**
         *  @todo   Needs to be written!
         */
        this.parents = function() {

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
         *  Inserts content, specified by the argument, to the beginning of each element in the set of matched elements.
         *
         *  Both this and the {@link $#prependTo .prependTo()} method perform the same task, the main difference being in the placement
         *  of the content and the target. With `.prepend()`, the selector expression preceding the method is the container into
         *  which the content is to be inserted. On the other hand, with `.prependTo()`, the content precedes the method, and it
         *  is inserted into the target container.
         *
         *  > If there is more than one target element, clones of the inserted element will be created for each target except for
         *  the last one. For the last target, the original item will be inserted.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created for
         *  each target except for the last one. For the last target, the original item will be moved (not cloned).
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var parent = $('#selector');
         *
         *  // append a div that we create on the fly
         *  parent.prepend($('<div>').text('hello'));
         *
         *  // same thing as above
         *  parent.prepend($('<div>hello</div>'));
         *
         *  // prepend one or more elements that already exist on the page
         *  // if "parent" is a single element than the list will be moved inside the parent element
         *  // if "parent" is a collection of elements, clones of the list element will be created for
         *  // each target except for the last one; for the last target, the original list will be moved
         *  parent.prepend($('ul'));
         *
         *  // prepend a string (which will be transformed in HTML)
         *  // this is more efficient memory wise
         *  parent.prepend('<div>hello</div>');
         *
         *  // chaining
         *  parent.prepend($('div')).addClass('classname');
         *
         *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to insert at the beginning
         *                                  of each element in the set of matched elements.
         *
         *  @return {$}         Returns the set of matched elements (the parents, not the prepended elements).
         */
        this.prepend = function(content) {

            // call the "_dom_insert" private method with these arguments
            return this._dom_insert(content, 'prepend');

        }

        /**
         *  Inserts every element in the set of matched elements to the beginning of the parent element(s), specified by the argument.
         *
         *  Both this and the {@link $#prepend .prepend()} method perform the same task, the main difference being in the placement
         *  of the content and the target. With `.prepend()`, the selector expression preceding the method is the container into
         *  which the content is to be inserted. On the other hand, with `.prependTo()`, the content precedes the method, and it
         *  is inserted into the target container.
         *
         *  > If there is more than one target element, clones of the inserted element will be created for each target except for
         *  the last one. For the last target, the original item will be inserted.
         *
         *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created for
         *  each target except for the last one. For the last target, the original item will be moved (not cloned).
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var parent = $('#selector');
         *
         *  // prepend a div that we create on the fly
         *  $('<div>').text('hello').prependTo(parent);
         *
         *  // same thing as above
         *  $('<div>hello</div>').prependTo(parent);
         *
         *  // prepend one or more elements that already exist on the page
         *  // if "parent" is a single element than the list will be moved inside the parent element
         *  // if "parent" is a collection of elements, clones of the list element will be created for
         *  // each target except for the last one; for the last target, the original list will be moved
         *  $('ul').appendTo(parent);
         *
         *  @param  {$}     parent      A ZebraJS object at beginning of which to insert each element in the set of matched elements.
         *
         *  @return {$}     Returns the ZebraJS object you are appending to.
         */
        this.prependTo = function(parent) {

            // call the "_dom_insert" private method with these arguments
            return $(parent)._dom_insert(this, 'prepend');

        }

        /**
         *  Gets the immediately preceding sibling of each element in the set of matched elements. If a selector is provided,
         *  it retrieves the previous sibling only if it matches that selector.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('#selector');
         *
         *  // get the previous sibgling
         *  var prev = element.prev();
         *
         *  // get the previous sibling only if it matches the selector
         *  var prev = element.prev('div');
         *
         *  // since this method returns a ZebraJS object
         *  element.prev().addClass('someclass');
         *
         *  @param  {string}    selector    If the selector is provided, the method will retrieve the previous sibling only if
         *                                  it matches the selector
         *
         *  @return {$}         Returns the immediately preceding sibling of each element in the set of matched elements,
         *                      optionally filtered by a selector, as a ZebraJS object.
         */
        this.prev = function(selector) {

            // get the immediately preceding sibling of each element in the set of matched elements,
            // optionally filtered by a selector
            return this._dom_search('previous', selector);

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
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // remove a single class
         *  elements.removeClass('classname');
         *
         *  // remove multiple classes
         *  elements.removeClass('classname otherclassname');
         *
         *  // since this method returns the set of matched elements
         *  elements.removeClass('classname otherclassname').css('display', 'none');
         *
         *  @param  {string}    class_name  One or more space-separated class names to be removed from each element in
         *                                  the set of matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {$}         Returns the set of matched elements.
         */
        this.removeClass = function(class_name) {

            // remove class(es) and return the set of matched elements
            return this._class('remove', class_name);

        }

        /**
         *  @todo   Needs to be written!
         */
        this.replaceWith = function() {

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
         *  Gets the siblings of each element in the set of matched elements, optionally filtered by a selector.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var element = $('#selector');
         *
         *  // get all the siblings of the element
         *  var siblings_all = element.siblings();
         *
         *  // get all the "div" siblings of the element
         *  var siblings_filtered = element.siblings('div');
         *
         *  // since this method returns a ZebraJS object
         *  element.siblings('div').addClass('someclass');
         *
         *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
         *                                  match it.
         *
         *  @return {$}         Returns the siblings of each element in the set of matched elements, as a ZebraJS object
         */
        this.siblings = function(selector) {

            // get the siblings of each element in the set of matched elements, optionally filtered by a selector.
            return this._dom_search('siblings', selector);

        }

        /**
         *  Gets the text content of the first element in the set of matched elements (combined with the text content of all its
         *  descendants), or sets the text contents of the matched elements.
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
         *  // chaining
         *  elements.text('Hello').addClass('classname');

         *  @param  {string}    [content]   The text to set as the content of all the matched elements. Note that any text
         *                                  content that was previously in that element is completely replaced by the new
         *                                  content.
         *
         *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched
         *                                  elements. Otherwise it returns the text content of the first element in the set of
         *                                  matched elements (combined with the text content of all its descendants)
         */
        this.text = function(content) {

            // if content is provided
            if (content)

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // set the text content of each element
                    element.textContent = content;

                });

            // if content is not provided
            // return the text content of the first element in the set of matched elements
            // (combined with the text content of all its descendants)
            else return elements[0].textContent;

            // return the set of matched elements
            return $this;

        }

        /**
         *  Adds or removes one or more classes from each element in the set of matched elements, depending on the presence of
         *  each class name given as argument.
         *
         *  @example
         *
         *  // always cache selectors
         *  // to avoid DOM scanning over and over again
         *  var elements = $('selector');
         *
         *  // set a random class
         *  elements.addClass('classname');
         *
         *  // toggle classes
         *  // the result will be that "classname" will be removed from the matched elements while the "otherclassname" will be added
         *  elements.toggleClass('classname otherclassname');
         *
         *  // chaining
         *  elements.toggleClass('classname').css('display', 'none');
         *
         *  @param  {string}    class_name  One or more space-separated class names to be toggled for each element in the set of
         *                                  matched elements.
         *
         *  @todo               This method currently doesn't work on IE9
         *
         *  @return {$}         Returns the set of matched elements.
         */
        this.toggleClass = function(class_name) {

            // toggle class(es) and return the set of matched elements
            return this._class('toggle', class_name);

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
         *  // chaining
         *  elements.width(200).addClass('classname');
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
         *  @return {$|float}   When **setting** the `width`, this method returns the set of matched elements. Otherwise, it
         *                      returns the current computed **inner** width (without `padding`, `border` and `margin`) of the
         *                      first element in the set of matched elements, as `float`.
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
