/**
 *
 *  @fileOverview
 *  @name       ZebraJS
 *  @author     Stefan Gabos <contact@stefangabos.ro>
 *  @version    1.0.0
 *  @copyright  (c) 2016 Stefan Gabos
 *  @license    LGPL-3.0
 *
 */
(function() {

    var

        // we'll use this to keep track of registered event listeners
        event_listeners = {},

        // we'll use this when generating random IDs
        internal_counter = 0;

    /**
    *  Creates a "$" object which provides methods meant for simplifying the interaction with the set of elements matched
    *  by the `selector` argument. This is refered to as `wrapping` those elements.
    *
    *  @memberof $
    *  @param  {string|object|node}    selector
    *  @class
    */
    $ = function(selector, parent, first_only) {

        'use strict';

        // if called without the "new" keyword
        if (!(this instanceof $)) {

            if (selector === 'body') selector = document.body;

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
                elements = (selector instanceof Document || selector instanceof Element || selector instanceof Text || selector instanceof Window ? [selector] : [].concat(selector));

            /**
             *  @todo   Needs documentation!
             *
             *  @access public
             */
            this.get = function(index) {
                return index !== undefined ? elements[index] : elements;
            }

            /**
             *  Private helper method used by {@link $.$#addClass .addCLass()}, {@link $.$#removeClass .removeClass()} and
             *  {@link $.$#toggleClass .toggleClass()} methods.
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
             *  Private helper method used by {@link $.$#clone .clone()} method when called with the `deep_with_data_and_events`
             *  argument set to TRUE. It recursivelly attached events and data from an original element's children to it's clone children.
             *
             *  @param  {DOM_element}   element     Element that was cloned
             *
             *  @param  {DOM_element}   clone       Clone of the element
             *
             *  @return {void}
             *
             *  @access private
             */
            this._clone_data_and_events = function(element, clone) {

                // get the original element's and the clone's children
                var elements = Array.prototype.slice.call(element.children),
                    clones = Array.prototype.slice.call(clone.children);

                // if the original element's has any children
                if (elements && elements.length)

                    // iterate over the original element's children
                    elements.forEach(function(element, index) {

                        // iterate over all the existing event listeners
                        Object.keys(event_listeners).forEach(function(event_type) {

                            // iterate over the events of current type
                            event_listeners[event_type].forEach(function(properties) {

                                // if this is an event attached to element we've just cloned
                                if (properties[0] === element) {

                                    // also add the event to the clone element
                                    $(clones[index]).on(event_type + (properties[2] ? '.' + properties[2] : ''), properties[1]);

                                    // clone data
                                    clones[index].zjs = {};
                                    clones[index].zjs.data = element.zjs.data;

                                }

                            });

                        });

                        // recursivelly attach events to children's children
                        $this._clone_data_and_events(element, clones[index]);

                    });

            }

            /**
             *  Private helper method used by {@link $.$#append .append()}, {@link $.$#appendTo .appendTo()}, {@link $.$#after .after()},
             *  {@link $.$#insertAfter .insertAfter()}, {@link $.$#before .before()}, {@link $.$#insertBefore .insertBefore()},
             *  {@link $.$#prepend .prepend()}, {@link $.$#prependTo .prependTo()} and {@link $.$#wrap .wrap()} methods.
             *
             *  @param  {mixed}     content     Depending on the caller method this is the DOM element, text node, HTML string, or
             *                                  ZebraJS object to insert in the DOM.
             *
             *  @param  {string}    where       Indicated where the content should be inserted, relative to the set of matched elements.
             *                                  <br><br>
             *                                  Possible values are `after`, `append`, `before`, `prepend` and `wrap`.
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

                // if action is "wrap" and content is given as a string, wrap it in a ZebraJS object
                else if ((where === 'wrap' || where === 'replace') && typeof content === 'string') content = $(content).get();

                // if content to append is not a string, don't go further
                else if (typeof content !== 'string') return false;

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // if content to append is a string (plain text or HTML)
                    if (typeof content === 'string')

                        // insert content like this
                        element.insertAdjacentHTML((where === 'append' ? 'before' : 'after') + (where === 'before' || where === 'prepend' ? 'begin' : 'end'), content);

                    // since content is an array of DOM elements or text nodes
                    // iterate over the array
                    else content.forEach(function(item, index) {

                        // where the content needs to be moved in the DOM
                        switch (where) {

                            // insert a clone after each target except for the last one after which we insert the original content
                            case 'after':
                            case 'replace':
                            case 'wrap': element.parentNode.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element.nextSibling); break;

                            // add a clone to each parent except for the last one where we add the original content
                            case 'append': element.appendChild(index < elements.length - 1 ? item.cloneNode(true) : item); break;

                            // insert a clone before each target except for the last one before which we insert the original content
                            case 'before': element.parentNode.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element); break;

                            // prepend a clone to each parent except for the last one where we add the original content
                            case 'prepend': element.insertBefore(index < elements.length - 1 ? item.cloneNode(true) : item, element.firstChild); break;

                        }

                        // if we're wrapping the element
                        if (where === 'wrap' || where === 'replace') {

                            // remove the original element
                            element.parentNode.removeChild(element);

                            // for the "wrap" method, insert the removed element back into the container
                            if (where === 'wrap') item.appendChild(element);

                        }

                    });

                });

                // return the set of matched elements, for chaining
                return $this;

            }

            /**
             *  Private helper method used by {@link $.$#children .children()}, {@link $.$#siblings .siblings()}, {@link $.$#nexr .next()}
             *  and {@link $.$#prev .prev()} methods.
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
             *  elements.addClass('foo');
             *
             *  // add multiple classes
             *  elements.addClass('foo baz');
             *
             *  // chaining
             *  elements.addClass('foo baz').css('display', 'none');
             *
             *  @param  {string}    class_name  One or more space-separated class names to be added to each element in the
             *                                  set of matched elements.
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.addClass = function(class_name) {

                // add class(es) and return the set of matched elements
                return this._class('add', class_name);

            }

            /**
             *  Inserts content specified by the argument after each element in the set of matched elements.
             *
             *  Both this and the {@link $.$#insertAfter .insertAfter()} method perform the same task, the main difference being in
             *  the placement of the content and the target. With `.after()`, the selector expression preceding the method is the
             *  target after which the content is to be inserted. On the other hand, with `.insertAfter()`, the content precedes the
             *  method and it is the one inserted after the target element.
             *
             *  > Clones of the inserted element will be created after each element in the set of matched elements, except for the last
             *  one. The original item will be inserted after the last element.
             *
             *  > If the content to be inserted is an element existing on the page, clones of the element will be created after each
             *  element in the set of matched elements, except for the last one. The original item will be moved (not cloned) after
             *  the last element.
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
             *  // inserting elements already existing on the page
             *  target.after($('ul'));
             *
             *  // insert a string (which will be transformed in HTML)
             *  target.after('<div>hello</div>');
             *
             *  // chaining
             *  target.append($('div')).addClass('foo');
             *
             *  @param  {mixed}     content     DOM element, text node, HTML string or ZebraJS object to be inserted after each
             *                                  element in the set of matched elements.
             *
             *  @return {$}         Returns the set of matched elements.
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
             *  Both this and the {@link $.$#appendTo .appendTo()} method perform the same task, the main difference being in the
             *  placement of the content and the target. With `.append()`, the selector expression preceding the method is the
             *  container into which the content is to be inserted. On the other hand, with `.appendTo()`, the content precedes the
             *  method, and it is inserted into the target container.
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
             *  parent.append($('div')).addClass('foo');
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
             *  Both this and the {@link $.$#append .append()} method perform the same task, the main difference being in the placement
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
             *  elements.attr('title', 'title').removeClass('foo');
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

                var i;

                // if attribute argument is an object
                if (typeof attribute === 'object')

                    // iterate over the set of matched elements
                    elements.forEach(function(element) {

                        // iterate over the attributes
                        for (i in attribute)

                            // set each attribute
                            element.setAttribute(i, attribute[i]);

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
             *  Both this and the {@link $.$#insertBefore .insertBefore()} method perform the same task, the main difference being
             *  in the placement of the content and the target. With `.before()`, the selector expression preceding the method is
             *  the target before which the content is to be inserted. On the other hand, with `.insertBefore()`, the content precedes
             *  the method, and it is the one inserted before the target element.
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
             *  target.append($('div')).addClass('foo');
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
             *  element.children('div').addClass('foo');
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
             *  Creates a deep copy of the set of matched elements.
             *
             *  This method performs a deep copy of the set of matched elements meaning that it copies the matched elements as well
             *  as all of their descendant elements and text nodes.
             *
             *  Normally, any event handlers bound to the original element are not copied to the clone. Setting the `with_data_and_events`
             *  argument to `true` will copy the event handlers and element data bound to the original element.
             *
             *  > This method may lead to duplicate element IDs in a document. Where possible, it is recommended to avoid cloning
             *  elements with this attribute or using class attributes as identifiers instead.
             *
             *  Element data will continue to be shared between the cloned and the original element. To deep copy all data, copy each
             *  one manually.
             *
             *  @param  {boolean}   with_data_and_events        Setting this argument to `true` will instruct the method to also copy
             *                                                  event handlers and element data along with the elements.
             *
             *  @param  {boolean}   deep_with_data_and_events   Setting this argument to `true` will instruct the method to also copy
             *                                                  event handlers and data for all children of the cloned element.
             *
             *  @return {$}         Returns the cloned elements, as a ZebraJS object.
             */
            this.clone = function(with_data_and_events, deep_with_data_and_events) {

                var result = [];

                // iterate over the set of matched elements
                elements.forEach(function(element) {

                    // clone the element (together with its children)
                    var clone = element.cloneNode(true);

                    // add to array
                    result.push(clone);

                    // if events and data needs to be cloned too
                    if (with_data_and_events)

                        // iterate over all the existing event listeners
                        Object.keys(event_listeners).forEach(function(event_type) {

                            // iterate over the events of current type
                            event_listeners[event_type].forEach(function(properties) {

                                // if this is an event attached to element we've just cloned
                                if (with_data_and_events && properties[0] === element) {

                                    // also add the event to the clone element
                                    $(clone).on(event_type + (properties[2] ? '.' + properties[2] : ''), properties[1]);

                                    // clone data
                                    clone.zjs = {};
                                    clone.zjs.data = element.zjs.data;

                                }

                            });

                        });

                    // if event handlers and data for all children of the cloned element should be also copied
                    if (deep_with_data_and_events) $this._clone_data_and_events(element, clone);

                });

                // return the clone elements
                return $(result);

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
             *  elements.css('position', 'absolute').removeClass('foo');
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
             *  Stores arbitrary data associated with the matched elements, or returns the value at the named data store for the
             *  first element in the set of matched elements.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var elements = $('selector');
             *
             *  // set some data
             *  elements.data('foo', 'baz');
             *
             *  // retrieve previously set data
             *  elements.data('foo');
             *
             *  // set an object as data
             *  elements.data('foo', {bar: 'baz', qux: 2});
             *
             *  @param  {string}    name        A string naming the piece of data to set.
             *
             *  @param  {mixed}     value       The value to associate with the data set.
             *
             *  @return {$|mixed}   When `setting` data attributes, this method returns the set of matched elements.
             *                      When `reading` data attributes, this method returns the stored values, or `undefined` if not data
             *                      found for the requested key.
             */
            this.data = function(name, value) {

                // make sure the name follows the Dataset API specs
                // http://www.w3.org/TR/html5/dom.html#dom-dataset
                name = name

                        // replace "-" followed by an ascii letter to that letter in uppercase
                        .replace(/\-([a-z])/ig, function() { return arguments[1].toUpperCase(); })

                        // remove any left "-"
                        .replace(/\-/g, '');

                // if "value" argument is provided
                if (undefined !== value) {

                    // iterate through the set of matched elements
                    elements.forEach(function(element) {

                        // initialize the "zjs" "private" property, if not already initialized
                        if (!element.zjs) element.zjs = {};

                        // if not already initialized...
                        if (!element.zjs.data) {

                            // ...initialize the "data" property,
                            element.zjs.data = {};

                            // iterate over the element's existing attributes
                            Array.prototype.slice.call(element.attributes).forEach(function(attribute) {

                                // if we found an attribute starting with "data-"
                                if (attribute.name.indexOf('data-') === 0) {

                                    // make sure the name follows the Dataset API specs
                                    var name = attribute.name

                                            // remove the "data-" prefix
                                            .replace(/^data\-/, '')

                                            // replace "-" followed by an ascii letter to that letter in uppercase
                                            .replace(/\-([a-z])/ig, function() { return arguments[1].toUpperCase(); })

                                            // remove any left "-"
                                            .replace(/\-/g, '');

                                    // store the data attribute
                                    element.zjs.data[name] = attribute.value;

                                }

                            });

                        }

                        // if value is not already set, or it is set but it is of different type, set it now
                        if (!element.zjs.data[name] || typeof value !== typeof element.zjs.data[name]) element.zjs.data[name] = value;

                        // if both the existing value and the new one are objects
                        else if (typeof value === 'object' && typeof element.zjs.data[name] === 'object')

                            // merge the new values with the old ones
                            Object.keys(value).forEach(function(key) {

                                element.zjs.data[name][key] = value[key];

                            });

                    });

                    // return the set of matched elements
                    return $this;

                }

                // if "value" argument is not provided, return the existing value, or "undefined" if no value exists
                return elements[0].zjs.data[name] || undefined;

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
             *  // find the element's div descendants
             *  var target = element.find('div');
             *
             *  // this is equivalent with the above
             *  var target = $('div', element);
             *
             *  // chaining
             *  element.find('div').addClass('foo');
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
             *  var class_exists = elements.hasClass('foo');
             *
             *  // chaining
             *  elements.toggleClass('foo');
             *
             *  @param  {string}    class_name  The name of a class to be checked if it exists on *any* of the elements in the set
             *                                  of matched elements.
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
             *  See {@link $.$#outerHeight .outerHeight()} for getting the height including `padding`, `border` and, optionally,
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
             *  elements.height(200).addClass('foo');
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

                // for the "window"
                if (this.get()[0] === window) return window.innerHeight;

                // for the "document"
                if (this.get()[0] === document)

                    // return height
                    return Math.max(
                        document.body.offsetHeight,
                        document.body.scrollHeight,
                        document.documentElement.clientHeight,
                        document.documentElement.offsetHeight,
                        document.documentElement.scrollHeight
                    );

                // get the first element's height, top/bottom padding and borders
                var styles = window.getComputedStyle(elements[0]),
                    offset_height = elements[0].offsetHeight,
                    border_top_width = parseFloat(styles.borderTopWidth),
                    border_bottom_width = parseFloat(styles.borderBottomWidth),
                    padding_top = parseFloat(styles.paddingTop),
                    padding_bottom = parseFloat(styles.paddingBottom);

                // return height
                return offset_height - border_bottom_width - border_top_width - padding_top - padding_bottom;

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
             *  elements.html('<p>Hello</p>').addClass('foo');

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
             *  Both this and the {@link $.$#after .after()} method perform the same task, the main difference being in the
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
             *  Both this and the {@link $.$#before .before()} method perform the same task, the main difference being in the
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
             *  element.next().addClass('foo');
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
             *  Remove an event handler.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // create a function
             *  var callback = function(e) {
             *      console.log('clicked!');
             *  }
             *
             *  // handle clicks on element using the function created above
             *  element.on('click', callback);
             *
             *  // remove that particular click event
             *  element.off('click', callback);
             *
             *  // remove *all* the click events
             *  element.off('click');
             *
             *  // remove *only* the click events that were namespaced
             *  element.off('click.namespace');
             *
             *  @param  {string}    event_type  One or more space-separated event types and optional namespaces, such as "click" or
             *                                  "click.namespace".
             *
             *  @param  {function}  callback    A function to execute when the event is triggered.
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.off = function(event_type, callback) {

                var event_types = event_type ? event_type.split(' ') : Object.keys(event_listeners), namespace, remove_all_event_handlers = !event_type;

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // iterate through the event types we have to remove the handler from
                    event_types.forEach(function(event_type) {

                        // handle namespacing
                        namespace = event_type.split('.')
                        event_type = namespace[0];
                        namespace = namespace[1] || '';

                        // if we have registered event of this type
                        if (undefined !== event_listeners[event_type])

                            // iterate through the registered events of this type
                            event_listeners[event_type].forEach(function(entry, index) {

                                // if
                                if (

                                    // this is an event registered for the current element
                                    entry[0] === element &&

                                    // no callback was specified (we need to remove all events of this type) OR
                                    // callback is given and we've just found it
                                    (undefined === callback || callback === entry[1]) &&

                                    // we're looking at the right namespace (or we need to remove all event handlers)
                                    (remove_all_event_handlers || namespace === entry[2])

                                ) {

                                    // remove the event listener
                                    element.removeEventListener(event_type, entry[3] || entry[1]);

                                    // remove entry from the event listeners array
                                    event_listeners[event_type].splice(index, 1);

                                    // if nothing left for this event type then also remove the event type's entry
                                    if (event_listeners[event_type].length === 0) delete event_listeners[event_type];

                                    // don't look further
                                    return;

                                }

                            });

                    });

                });

                // return the set of matched elements, for chaining
                return $this;

            }

            /**
             *  Gets the current coordinates of the first element in the set of matched elements, relative to the document.
             *
             *  This method retrieves the current position of an element relative to the document, in contrast with the
             *  {@link $.$#position .position()} method which retrieves the current position relative to the offset parent.
             *
             *  > This method cannot get the position of hidden elements or accounting for borders, margins, or padding set on the
             *  body element.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // get the element's position, relative to the offset parent
             *  var offset = element.offset()
             *
             *  @return {object}    Returns an object with the `left` and `top` properties.
             */
            this.offset = function() {

                // get the bounding box of the first element in the set of matched elements
                var box = elements[0].getBoundingClientRect();

                // return the object with the offset
                return {
                    left: box.left + window.pageXOffset - document.documentElement.clientLeft,
                    top: box.top + window.pageYOffset - document.documentElement.clientTop
                }

            }

            /**
             *  Attaches an event handler function for one or more events to the selected elements.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // create a function
             *  var callback = function(e) {
             *      console.log('clicked!');
             *  }
             *
             *  // handle clicks on element using the function created above
             *  element.on('click', callback);
             *
             *  // handle clicks on element using an anonymous function
             *  element.on('click', function(e) {
             *      console.log('clicked!');
             *  });
             *
             *  // namespacing, so that you can only remove certain events
             *  element.on('click.namespace', function(e) {
             *      console.log('clicked!');
             *  });
             *
             *  // using delegation
             *  // handle clicks on all the "div" elements
             *  // that are children of the element
             *  element.on('click', 'div', function(e) {
             *      console.log('clicked!');
             *  });
             *
             *  // chaining
             *  element.on('click', function() {
             *      console.log('clicked!');
             *  }).addClass('foo');
             *
             *  @param  {string}    event_type  One or more space-separated event types and optional namespaces, such as "click" or
             *                                  "click.namespace".
             *
             *  @param  {string}    [selector]  A selector string to filter the descendants of the selected elements that will call
             *                                  the handler. If the selector is null or omitted, the handler is always called when it
             *                                  reaches the selected element.
             *
             *  @param  {function}  callback    A function to execute when the event is triggered.
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.on = function(event_type, selector, callback) {

                var event_types = event_type.split(' '), namespace, actual_callback;

                // if method is called with just 2 arguments,
                // the seconds argument is the callback not a selector
                if (undefined === callback) callback = selector;

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // iterate through the event types we have to attach the handler to
                    event_types.forEach(function(event_type) {

                        actual_callback = false;

                        // handle namespacing
                        namespace = event_type.split('.')
                        event_type = namespace[0];
                        namespace = namespace[1] || '';

                        // if this is the first time we have this event type
                        if (undefined === event_listeners[event_type])

                            // initialize the entry for this event type
                            event_listeners[event_type] = [];

                        // if selector is a string
                        if (typeof selector === 'string') {

                            // this will be the actual callback function
                            actual_callback = function(e) {

                                // trigger the callback function only if the clicked element matches the selector
                                if (this !== e.target && e.target.matches(selector)) callback.apply(e.target);

                            };

                            // attach event listener
                            element.addEventListener(event_type, actual_callback);

                        // set the event listener
                        } else element.addEventListener(event_type, callback);

                        // add element/cllback combination to the array of events of this type
                        event_listeners[event_type].push([element, callback, namespace, actual_callback]);

                    });

                });

                // return the set of matched elements, for chaining
                return $this;

            }

            /**
             *  Returns the current computed height for the first element in the set of matched elements, including `padding`,
             *  `border` and, optionally, `margin`.
             *
             *  > For hidden elements the returned value is `0`!
             *
             *  See {@link $.$#height .height()} for getting the **inner** height without `padding`, `border` and `margin`.
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
             *  See {@link $.$#width .width()} for getting the **inner** width without `padding`, `border` and `margin`.
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
             *  This method is similar to {@link $.$#parents .parents()}, except .parent() only travels a single level up the DOM tree.
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
             *  element.parent().addClass('foo');
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
             *  Gets the current coordinates of the first element in the set of matched elements, relative to the offset parent.
             *
             *  This method retrieves the current position of an element relative to the offset parent, in contrast with the
             *  {@link $.$#offset .offset()} method which retrieves the current position relative to the document.
             *
             *  > This method cannot get the position of hidden elements or accounting for borders, margins, or padding set on the
             *  body element.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // get the element's position, relative to the offset parent
             *  var position = element.position()
             *
             *  @return {object}    Returns an object with the `left` and `top` properties.
             */
            this.position = function() {

                // return the position of the first element in the set of matched elements
                return {
                    left: parseFloat(elements[0].offsetLeft),
                    top: parseFloat(elements[0].offsetTop)
                }

            }

            /**
             *  Inserts content, specified by the argument, to the beginning of each element in the set of matched elements.
             *
             *  Both this and the {@link $.$#prependTo .prependTo()} method perform the same task, the main difference being in the
             *  placement of the content and the target. With `.prepend()`, the selector expression preceding the method is the
             *  container into which the content is to be inserted. On the other hand, with `.prependTo()`, the content precedes the
             *  method, and it is inserted into the target container.
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
             *  parent.prepend($('div')).addClass('foo');
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
             *  Both this and the {@link $.$#prepend .prepend()} method perform the same task, the main difference being in the
             *  placement of the content and the target. With `.prepend()`, the selector expression preceding the method is the
             *  container into which the content is to be inserted. On the other hand, with `.prependTo()`, the content precedes the
             *  method, and it is inserted into the target container.
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
             *  element.prev().addClass('foo');
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
             *  Specifies a function to execute when the DOM is fully loaded.
             *
             *  @example
             *
             *  $(document).ready(function() {
             *      // code to be executed when the DOM is ready
             *  });
             *
             *  @param  {function}  callback    A function to execute when the DOM is ready and safe to manipulate.
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.ready = function(callback) {

                // if DOM is already ready, fire the callback now
                if (document.readyState === 'complete' || document.readyState !== 'loading') callback();

                // otherwise, wait for the DOM and execute the callback when the it is ready
                else document.addEventListener('DOMContentLoaded', callback);

                // return the set of matched elements
                return $this;

            }

            /**
             *  Removes the set of matched elements from the DOM.
             *
             *  Use this method when you want to remove the element itself, as well as everything inside it. In addition to the elements
             *  themselves, all attached event handlers and data attributes associated with the elements are also removed.
             *
             *  To remove the elements without removing data and event handlers, use {@link $.$#detach() .detach()} instead.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // remove the element, its children, and all attached event
             *  // handlers and data attributes associated with the elements
             *  element.remove();
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.remove = function() {

                // iterate over the set of matched elements
                elements.forEach(function(element) {

                    var

                        // the element as a ZebraJS object
                        $element = $(element),

                        // the element's children
                        children = Array.prototype.slice.call(element.querySelectorAll('*'));

                    // iterate over the element's children
                    children.forEach(function(child) {

                        // the child's ZebraJS form
                        var $child = $(child);

                        // remove all event handlers
                        $child.off();

                        // nullify the child to free memory
                        $child = null;

                    });

                    // remove all attached event handlers
                    $element.off();

                    // remove element from the DOM (including children)
                    element.parentNode.removeChild(element);

                    // nullify the object to free memory
                    $element = null;

                });

                // return the set of matched elements
                return $this;

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
             *  elements.removeClass('foo');
             *
             *  // remove multiple classes
             *  elements.removeClass('foo baz');
             *
             *  // since this method returns the set of matched elements
             *  elements.removeClass('foo baz').css('display', 'none');
             *
             *  @param  {string}    class_name  One or more space-separated class names to be removed from each element in
             *                                  the set of matched elements.
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.removeClass = function(class_name) {

                // remove class(es) and return the set of matched elements
                return this._class('remove', class_name);

            }

            /**
             *  Replaces each element in the set of matched elements with the provided new content and returns the set of elements
             *  that was removed.
             *
             *  > Note that if the method's argument is a selector, then clones of the element described by the selector will be
             *  created and used for replacing each element in the set of matched elements, except for the last one. The original item
             *  will be moved (not cloned) and used to replace the last target.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // wrap element in a div
             *  element.replaceWith('<div id="replacement"></div>');
             *
             *  // *exactly* the same thing as above
             *  element.replaceWith($('<div id="replacement"></div>'));
             *
             *  // using an existing element as the wrapper
             *  element.replaceWith($('#element-from-the-page'));
             *
             *  @param  {mixed} element     A string, a ZebraJS object or a DOM element to use as replacement for each element in the
             *                              set of matched elements.
             *
             *  @return {$}     Returns the set of matched elements.
             */
            this.replaceWith = function(element) {

                // call the "_dom_insert" private method with these arguments
                return this._dom_insert(element, 'replace');

            }

            /**
             *  Gets the horizontal position of the scrollbar for the first element in the set of matched elements, or sets the
             *  horizontal position of the scrollbar for every matched element.
             *
             *  The horizontal scroll position is the same as the number of pixels that are hidden from view above the scrollable area.
             *  If the scroll bar is at the very left, or if the element is not scrollable, this number will be `0`.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var body = $('body');
             *
             *  // get the horizontal scroll of the body
             *  body.scrollLeft();
             *
             *  // set the horizontal scroll of the body
             *  body.scrollLeft(250);
             *
             *  // chaining
             *  elements.scrollLeft(250).addClass('foo');
             *
             *  @param  {integer}   [value]     Sets the horizontal position of the scrollbar for every matched element.
             *
             *  @return {$|integer}             When `setting` the horizontal position, this method returns the set of matched elements.
             *                                  When `reading` the horizontal position, this method returns the horizontal position of
             *                                  the scrollbar for the first element in the set of matched elements.
             */
            this.scrollLeft = function(value) {

                // if value is not specified, return the scrollLeft value of the first element in the set of matched elements
                if (undefined === value) return elements[0].scrollLeft;

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // set the scrollLeft value for each element
                    // apply "parseFloat" in case is provided as string or suffixed with "px"
                    element.scrollLeft = parseFloat(value);

                });

            }

            /**
             *  Gets the vertical position of the scrollbar for the first element in the set of matched elements, or sets the
             *  vertical position of the scrollbar for every matched element.
             *
             *  The vertical scroll position is the same as the number of pixels that are hidden from view above the scrollable area.
             *  If the scroll bar is at the very top, or if the element is not scrollable, this number will be `0`.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var body = $('body');
             *
             *  // get the vertical scroll of the body
             *  body.scrollTop();
             *
             *  // set the vertical scroll of the body
             *  body.scrollTop(250);
             *
             *  // chaining
             *  elements.scrollTop(250).addClass('foo');
             *
             *  @param  {integer}   [value]     Sets the vertical position of the scrollbar for every matched element.
             *
             *  @return {$|integer}             When `setting` the vertical position, this method returns the set of matched elements.
             *                                  When `reading` the vertical position, this method returns the vertical position of
             *                                  the scrollbar for the first element in the set of matched elements.
             */
            this.scrollTop = function(value) {

                // if value is not specified, return the scrollTop value of the first element in the set of matched elements
                if (undefined === value) return elements[0].scrollTop;

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // set the scrollTop value for each element
                    // apply "parseFloat" in case is provided as string or suffixed with "px"
                    element.scrollTop = parseFloat(value);

                });

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
             *  element.siblings('div').addClass('foo');
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
             *  elements.text('Hello').addClass('foo');

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
             *  elements.addClass('foo');
             *
             *  // toggle classes
             *  // the result will be that "foo" will be removed from the matched elements while the "baz" will be added
             *  elements.toggleClass('foo baz');
             *
             *  // chaining
             *  elements.toggleClass('foo').css('display', 'none');
             *
             *  @param  {string}    class_name  One or more space-separated class names to be toggled for each element in the set of
             *                                  matched elements.
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
             *  Removes the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
             *
             *  This method is effectively the inverse of the {@link $.$#wrap .wrap()} method. The matched elements (and their
             *  siblings, if any) replace their parents within the DOM structure.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // unwrap the element, whatever its parent may be
             *  element.unwrap();
             *
             *  // unwrap only if the element's parent is a div
             *  element.unwrap('div');
             *
             *  @param  {string}    selector    If the selector is supplied, the parent elements will be filtered and the unwrapping
             *                                  will occur only they match it.
             *
             *  @return {$}         Returns the set of matched elements.
             */
            this.unwrap = function(selector) {

                // iterate through the set of matched elements
                elements.forEach(function(element) {

                    // get the element's parent, optionally filtered by a selector,
                    // and replace it with the element
                    $(element).parent(selector).replaceWith(element);

                });

                // return the set of matched elements
                return $this;

            }

            /**
             *  Gets the current value of the first element in the set of matched elements or set the value of every matched element.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('selector');
             *
             *  // get the value of the first element in the list of matched elements
             *  // (if "element" was a select box with multiple selections allowed,
             *  // the returned value would be an array)
             *  var value = element.val();
             *
             *  // set the element's value
             *  element.val('foo');
             *
             *  // setting multiple values for multi-selects and checkboxes
             *  element.val(['option1', 'option2']);
             *
             *  @param  {mixed}     [value]     A string, a number, or an array of strings corresponding to the value of each matched
             *                                  element to set as selected/checked.
             *
             *  @return {$|mixed}   If setting a value, this method returns the set of matched elements. If called without the argument,
             *                      the method return the current value of the first element in the set of matched elements.
             */
            this.val = function(value) {

                var result = [];

                // if "value" argument is not specified
                if (undefined === value) {

                    // if first element in the list of matched elements is a select box with the "multiple" attribute set
                    if (elements[0].tagName.toLowerCase() === 'select' && elements[0].multiple) {

                        // add each selected option to the results array
                        Array.prototype.slice.call(elements[0].options).map(function(elem) {

                            if (elem.selected) result.push(elem.value)

                        });

                        // return the values of selected options
                        return result;

                    }

                    // for other elements, return the first element's value
                    return elements[0].value;

                // if "value" argument is specified
                // iterate through the set of matched elements
                } elements.forEach(function(element) {

                    // if value is not an array
                    if (!Array.isArray(value))

                        // set the value of of the current element
                        element.value = value;

                    // if value is an array, the current element is an checkbox/radio input and its value is in the array
                    else if (element.tagName.toLowerCase() === 'input' && element.type && (element.type === 'checkbox' || element.type === 'radio') && element.value && value.indexOf(element.value) > -1)

                        // mark the element as checked
                        element.checked = true;

                    // if element is a select box with the "multiple" attribute set
                    else if (element.tagName.toLowerCase() === 'select' && element.multiple)

                        // set the "selected" attribute to each matching option
                        Array.prototype.slice.call(element.options).map(function(elem) {

                            if (value.indexOf(elem.value) > -1) elem.selected = true;

                        });

                });

                // return the set of matched elements
                return $this;

            }

            /**
             *  Returns the current computed **inner** width (without `padding`, `border` and `margin`) of the first element
             *  in the set of matched elements as `float`, or sets the `width` CSS property of every element in the set.
             *
             *  See {@link $.$#outerWidth .outerWidth()} for getting the width including `padding`, `border` and, optionally,
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
             *  elements.width(200).addClass('foo');
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

                // for the "window"
                if (this.get()[0] === window) return window.innerWith;

                // for the "document"
                if (this.get()[0] === document)

                    // return width
                    return Math.max(
                        document.body.offsetWidth,
                        document.body.scrollWidth,
                        document.documentElement.clientWidth,
                        document.documentElement.offsetWidth,
                        document.documentElement.scrollWidth
                    );

                // get the first element's width, left/right padding and borders
                var styles = window.getComputedStyle(elements[0]),
                    offset_width = elements[0].offsetWidth,
                    border_left_width = parseFloat(styles.borderLeftWidth),
                    border_right_width = parseFloat(styles.borderRightWidth),
                    padding_left = parseFloat(styles.paddingLeft),
                    padding_right = parseFloat(styles.paddingRight);

                // return width
                return offset_width - border_left_width - border_right_width - padding_left - padding_right;

            }

            /**
             *  Wraps an HTML structure around each element in the set of matched elements.
             *
             *  > Note that if the method's argument is a selector then clones of the element described by the selector will be
             *  created and wrapped around each element in the set of matched elements except for the last one. The original item will
             *  be moved (not cloned) and wrapped around the last target.
             *
             *  @example
             *
             *  // always cache selectors
             *  // to avoid DOM scanning over and over again
             *  var element = $('#selector');
             *
             *  // wrap element in a div
             *  element.wrap('<div id="container"></div>');
             *
             *  // *exactly* the same thing as above
             *  element.wrap($('<div id="container"></div>'));
             *
             *  // using an existing element as the wrapper
             *  element.wrap($('#element-from-the-page'));
             *
             *  @param  {mixed} element     A string, a ZebraJS object or a DOM element in which to wrap around each element in the
             *                              set of matched elements.
             *
             *  @return {$}     Returns the set of matched elements.
             */
            this.wrap = function(element) {

                // call the "_dom_insert" private method with these arguments
                return this._dom_insert(element, 'wrap');

            }


        }

    }

})();
