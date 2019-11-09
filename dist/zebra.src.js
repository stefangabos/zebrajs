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
        *   var elements = $(input[type=text]);
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
        *   @version    0.9.0 (last revision November 09, 2019)
        *   @copyright  (c) 2016-2019 Stefan Gabos
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

            // attach all the ZebraJS methods to the elements array (including plugins, if any)
            for (property in $.fn) elements[property] = $.fn[property];

            // return the elements "array-on-steroids"
            return elements;

        }

    $.fn = {

        // zebrajs version
        version: '1.0.0'

    };

    /**
     *  Private helper method used by {@link ZebraJS#addClass .addCLass()}, {@link ZebraJS#removeClass .removeClass()} and
     *  {@link ZebraJS#toggleClass .toggleClass()} methods.
     *
     *  @param  {string}    action      What to do with the class(es)
     *                                  <br><br>
     *                                  Possible values are `add`, `remove` and `toggle`.
     *
     *  @param  {string}    class_names One or more space-separated class names to be added/removed/toggled for each element
     *                                  in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the appended elements), for chaining.
     *
     *  @access private
     */
    $.fn._class = function(action, class_names) {

        // split by space and create an array
        class_names = class_names.split(' ');

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // iterate through the class names to add
            class_names.forEach(function(class_name) {

                // add or remove class(es)
                element.classList[action === 'add' || (action === 'toggle' && !element.classList.contains(class_name)) ? 'add' : 'remove'](class_name);

            });

        });

        // return the set of matched elements, for chaining
        return this;

    }

    /**
     *  Private helper method used by {@link ZebraJS#clone .clone()} method when called with the `deep_with_data_and_events`
     *  argument set to TRUE. It recursively attached events and data from an original element's children to it's clone
     *  children.
     *
     *  @param  {DOM_element}   element     Element that was cloned
     *
     *  @param  {DOM_element}   clone       Clone of the element
     *
     *  @return {void}
     *
     *  @access private
     */
    $.fn._clone_data_and_events = function(element, clone) {

        // get the original element's and the clone's children
        var elements = Array.prototype.slice.call(element.children),
            clones = Array.prototype.slice.call(clone.children),
            $this = this;

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

                            // if original element has some data attached to it
                            if (element.zjs && element.zjs.data) {

                                // clone it
                                clones[index].zjs = {};
                                clones[index].zjs.data = element.zjs.data;

                            }

                        }

                    });

                });

                // recursively attach events to children's children
                $this._clone_data_and_events(element, clones[index]);

            });

    }

    /**
     *  Private helper method used by {@link ZebraJS#append .append()}, {@link ZebraJS#appendTo .appendTo()},
     *  {@link ZebraJS#after .after()}, {@link ZebraJS#insertAfter .insertAfter()}, {@link ZebraJS#before .before()},
     *  {@link ZebraJS#insertBefore .insertBefore()}, {@link ZebraJS#prepend .prepend()}, {@link ZebraJS#prependTo .prependTo()}
     *  and {@link ZebraJS#wrap .wrap()} methods.
     *
     *  @param  {mixed}     content     Depending on the caller method this is the DOM element, text node, HTML string, or
     *                                  {@link ZebraJS} object to insert in the DOM.
     *
     *  @param  {string}    where       Indicated where the content should be inserted, relative to the set of matched elements.
     *                                  <br><br>
     *                                  Possible values are `after`, `append`, `before`, `prepend` and `wrap`.
     *
     *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the appended elements), for chaining.
     *
     *  @access private
     */
    $.fn._dom_insert = function(content, where) {

        var $this = this;

        // make a ZebraJS object out of whatever given as content
        content = $(content);

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // since content is an array of DOM elements or text nodes
            // iterate over the array
            content.forEach(function(item, index) {

                // where the content needs to be moved in the DOM
                switch (where) {

                    // insert a clone after each target except for the last one after which we insert the original content
                    case 'after':
                    case 'replace':
                    case 'wrap': element.parentNode.insertBefore(index < $this.length - 1 ? item.cloneNode(true) : item, element.nextSibling); break;

                    // add a clone to each parent except for the last one where we add the original content
                    case 'append': element.appendChild(index < $this.length - 1 ? item.cloneNode(true) : item); break;

                    // insert a clone before each target except for the last one before which we insert the original content
                    case 'before': element.parentNode.insertBefore(index < $this.length - 1 ? item.cloneNode(true) : item, element); break;

                    // prepend a clone to each parent except for the last one where we add the original content
                    case 'prepend': element.insertBefore(index < $this.length - 1 ? item.cloneNode(true) : item, element.firstChild); break;

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

        // return the newly inserted element(s), for chaining
        return content;

    }

    /**
     *  Private helper method used by {@link ZebraJS#children .children()}, {@link ZebraJS#siblings .siblings()},
     *  {@link ZebraJS#next .next()} and {@link ZebraJS#prev .prev()} methods.
     *
     *  @param  {string}    action      Specified what type of elements to look for
     *                                  <br><br>
     *                                  Possible values are `children` and `siblings`.
     *
     *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
     *                                  match it.
     *
     *  @return {ZebraJS}   Returns the found elements, as a ZebraJS object
     *
     *  @access private
     */
    $.fn._dom_search = function(action, selector) {

        var result = [], remove_id, root, tmp, $this = this;

        // iterate through the set of matched elements
        this.forEach(function(element) {

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
            else if (action === 'previous' || action === 'next') {

                // get the next/previous sibling
                tmp = element[(action === 'next' ? 'next' : 'previous') + 'ElementSibling'];

                // if there's no selector specified or there is and it matches
                if (!selector || $(tmp).is(selector))

                    // add it to the results array
                    result = result.concat([tmp]);

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
    $.fn._random = function(prefix) {

        // if the internal counter is too large, reset it
        if (internal_counter > Number.MAX_VALUE) internal_counter = 0;

        // return a pseudo-random string by incrementing the internal counter
        return prefix + '_' + internal_counter++;
    }

    /**
     *  Performs an asynchronous HTTP (Ajax) request.
     *
     *  @example
     *
     *  $.ajax({
     *      url: 'http://mydomain.com/index.html',
     *      method: 'GET',
     *      data: {
     *          foo: 'baz',
     *          bar: 'bax'
     *      },
     *      error: function() {
     *          alert('error!');
     *      },
     *      success: function() {
     *          alert('success!');
     *      }
     *  });
     *
     *  @param  {string}    [url]       The URL to which the request is to be sent.<br>
     *                                  You may skip it and set it in the *options* object
     *
     *  @param  {object}    options     A set of key/value pairs that configure the Ajax request.
     *
     *  |  Property         |   Type                |   Description
     *  |-------------------|-----------------------|----------------------------------------------
     *  |   **url**         |   *string*            |   The URL to which the request is to be sent.
     *  |   **async**       |   *boolean*           |   By default, all requests are sent *asynchronously*. If you need synchronous requests, set this option to `false`. Note that synchronous requests may temporarily lock the browser, disabling any actions while the request is active.<br>Default is `true`
     *  |   **beforeSend**  |   *function*          |   A pre-request callback function that can be used to modify the XMLHTTPRequest object before it is sent. Use this to set custom headers, etc. The XMLHTTPRequest object and settings objects are passed as arguments. Returning false from this function will cancel the request.
     *  |   **cache**       |   *boolean*           |   If set to `false`, will force requested pages not to be cached by the browser. Note: Setting cache to `false` will only work correctly with `HEAD` and `GET` requests. It works by appending "_={timestamp}" to the GET parameters. The parameter is not needed for other types of requests.<br>Default is `true`
     *  |   **complete**    |   *function*          |   A function to be called when the request finishes (after `success` and `error` callbacks are executed). The function gets passed two arguments: The XMLHTTPRequest object and a string with the status of the request.
     *  |   **data**        |   *string* / *object* |   Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET requests. Object must be `key/value` pairs, where `value` can also be an array.
     *  |   **error**       |   *function*          |   A function to be called if the request fails. The function receives two arguments: The XMLHttpRequest object and a string describing the type of error that occurred.
     *  |   **method**      |   *string*            |   The HTTP method to use for the request (e.g. `POST`, `GET`, `PUT`).
     *  |   **success**     |   *function*          |   A function to be called if the request succeeds. The function gets passed two arguments: the data returned from the server and a string describing the status.
     *
     *
     *  @memberof   ZebraJS
     *  @alias      $&period;ajax
     *  @instance
     */
    $.ajax = function(url, options) {

        var defaults = {

                async: true,
                beforeSend: null,
                cache: true,
                complete: null,
                data: null,
                error: null,
                method: 'get',
                success: null

            }, httpRequest,

            // this callback functions is called as the AJAX call progresses
            callback = function() {

                // get the request's status
                switch (httpRequest.readyState) {

                    // if the request is ready to be made
                    case 1:

                        // if we have a callback function ready to handle this event, call it now
                        if (typeof options.beforeSend === 'function') options.beforeSend.call(null, httpRequest, options);

                        break;

                    // if the request completed
                    case 4:

                        // if the request was successful and we have a callback function ready to handle this situation
                        if (httpRequest.status === 200 && typeof options.success === 'function')

                            // call that function now
                            options.success.call(null, httpRequest.responseText, httpRequest.status);

                        // if the request was unsuccessful and we have a callback function ready to handle this situation
                        if (httpRequest.status !== 200 && typeof options.error === 'function')

                            // call that function now
                            options.error.call(null, httpRequest.status, httpRequest.responseText);

                        // if we have a callback function ready to handle the fact that the request completed (regardless if
                        // it was successful or not)
                        if (typeof options.complete === 'function')

                            // call that function now
                            options.complete.call(null, httpRequest, httpRequest.status);

                        break;
                }

            }, key, params = '';

        // if method is called with a single argument
        if (!options) {

            // then "options" is actually the first argument
            options = url;

            // and the "url" is taken from the "options" object
            url = options.url;

        }

        // extend the default options with the ones provided by the user
        options = $.extend(defaults, options);

        // the method of the request needs to be uppercase
        options.method = options.method.toUpperCase();

        // if data is provided and is an object
        if (options.data && typeof options.data === 'object') {

            // iterate over the object's properties
            for (key in options.data)

                // construct the query string
                params += (params !== '' ? '&' : '') + key + '=' + encodeURIComponent(options.data[key]);

            // change the data options to its string representation
            options.data = params;

        }

        // if we don't want to cache requests, append a query string to the existing ones
        if (!options.cache) options.data = options.data + (options.data ? '&' : '') + '_=' + (+new Date());

        // if the XMLHttpRequest object is available
        if (window.XMLHttpRequest) {

            // instantiate the XMLHttpRequest object
            httpRequest = new XMLHttpRequest();

            // this will be called as the call progresses
            httpRequest.onreadystatechange = callback;

            // this makes the call...
            httpRequest.open(options.method, url + (options.method === 'GET' && options.data ? '?' + options.data : ''), options.async);

            // set the request header
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

            // with any additional parameters, if provided
            httpRequest.send(options.data);

        }

    }

    /**
     *  Iterates over an array, executing a callback function for each item in the array.
     *
     *  For iterating over a set of matched elements, see the {@link ZebraJS#each each()} method.
     *
     *  @param  {function}  callback    The function to execute for each item in the set. The callback function receives two
     *                                  arguments: the element's position in the set, called `index` (0-based), and the DOM
     *                                  element. The `this` keyword inside the callback function refers to the DOM element.
     *                                  <br><br>
     *                                  *Returning `FALSE` from the callback function breaks the loop!*
     *
     *  > **This method is here only for compatibility purposes and you shouldn't use it - you should use instead JavaScript's
     *  native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach forEach}**
     *
     *  @example
     *
     *  $.each([1, 2, 3, 4], function(index) {
     *
     *      // show the element's index in the set
     *      console.log(index);
     *
     *      // remember, inside the callback, the "this" keyword refers to the DOM element
     *      $(this).css('display', 'none');
     *
     *  });
     *
     *  @return {undefined}
     *
     *  @memberof   ZebraJS
     *  @alias      $&period;each
     *  @instance
     */
    $.each = function(array, callback) {

        // iterate through the set of matched elements
        for (var i = 0; i < this.length; i++)

            //  apply the callback function
            if (callback.call(this[i], i, this[i]) === false) return;

    }

    /**
     *  Merges the properties of two or more objects together into the first object.
     *
     *  @example
     *
     *  // merge the properties of the last 2 objects into the first one
     *  $.extend({}, {foo:  'baz'}, {bar: 'biz'});
     *
     *  // the result
     *  // {foo: 'baz', bar: 'biz'}
     *
     *  @param  {object}    target  An object whose properties will be merged with the properties of the additional objects
     *                              passed as arguments to this method.
     *
     *  @return {object}    Returns an object with the properties of the object given as first argument merged with the
     *                      properties of additional objects passed as arguments to this method.
     *
     *  @memberof   ZebraJS
     *  @alias      $&period;extend
     *  @instance
     */
    $.extend = function(target) {

        var i, property, result;

        // if the "assign" method is available, use it
        if (Object.assign) return Object.assign.apply(null, [target].concat(Array.prototype.slice.call(arguments, 1)));

        // if the "assign" method is not available

        // if converting the target argument to an object fails, throw an error
        try { result = Object(target); } catch (e) { throw new TypeError('Cannot convert undefined or null to object'); }

        // iterate over the method's arguments
        for (i = 1; i < arguments.length; i++)

            // if argument is an object
            if (typeof arguments[i] === 'object')

                // iterate over the object's properties
                for (property in arguments[i])

                    // avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(arguments[i], property))

                        // add property to the result
                        result[property] = arguments[i][property];

        // return the new object
        return result;

    }

    /**
     *  Search for a given value within an array and returns the first index where the value is found, or `-1` if the value
     *  is not found.
     *
     *  This method returns `-1` when it doesn't find a match. If the searched value is in the first position in the array
     *  this method returns `0`, if in second `1`, and so on.
     *
     *  > Because in JavaScript `0 == false` (but `0 !== false`), to check for the presence of value within array, you need to
     *  check if it's not equal to (or greater than) `-1`.
     *  <br><br>
     *  > **This method is here only for compatibility purposes and you shouldn't use it - you should use instead JavaScript's
     *  own {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf indexOf}**
     *
     *  @example
     *
     *  // returns 4
     *  $.inArray(5, [1, 2, 3, 4, 5, 6, 7]);
     *
     *  @param  {mixed}     value   The value to search for
     *
     *  @param  {array}     array   The array to search in
     *
     *  @return {integer}   Returns the position of the searched value inside the given array (starting from `0`), or `-1`
     *                      if the value couldn't be found.
     *
     *  @memberof   ZebraJS
     *  @alias      $&period;inArray
     *  @instance
     */
    $.inArray = function(value, array) {

        // return the index of "value" in the "array"
        return array.indexOf(value);

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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      addClass
     *  @instance
     */
    $.fn.addClass = function(class_name) {

        // add class(es) and return the set of matched elements
        return this._class('add', class_name);

    }

    /**
     *  Inserts content specified by the argument after each element in the set of matched elements.
     *
     *  Both this and the {@link ZebraJS#insertAfter .insertAfter()} method perform the same task, the main difference being
     *  in the placement of the content and the target. With `.after()`, the selector expression preceding the method is the
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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      after
     *  @instance
     */
    $.fn.after = function(content) {

        // call the "_dom_insert" private method with these arguments
        return this._dom_insert(content, 'after');

    }

    /**
     *  Inserts content, specified by the argument, to the end of each element in the set of matched elements.
     *
     *  Both this and the {@link ZebraJS#appendTo .appendTo()} method perform the same task, the main difference being in the
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
     *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the appended elements).
     *
     *  @memberof   ZebraJS
     *  @alias      append
     *  @instance
     */
    $.fn.append = function(content) {

        // call the "_dom_insert" private method with these arguments
        return this._dom_insert(content, 'append');

    }

    /**
     *  Inserts every element in the set of matched elements to the end of the parent element(s), specified by the argument.
     *
     *  Both this and the {@link ZebraJS#append .append()} method perform the same task, the main difference being in the
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
     *  @param  {ZebraJS}   parent      A ZebraJS object at end of which to insert each element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the ZebraJS object you are appending to.
     *
     *  @memberof   ZebraJS
     *  @alias      appendTo
     *  @instance
     */
    $.fn.appendTo = function(parent) {

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
     *  @return {ZebraJS|mixed}             When `setting` attributes, this method returns the set of matched elements.
     *                                      When `reading` attributes, this method returns the value of the required attribute.
     *
     *  @memberof   ZebraJS
     *  @alias      attr
     *  @instance
     */
    $.fn.attr = function(attribute, value) {

        // if attribute argument is an object
        if (typeof attribute === 'object')

            // iterate over the set of matched elements
            this.forEach(function(element) {

                // iterate over the attributes
                for (var i in attribute)

                    // set each attribute
                    element.setAttribute(i, attribute[i]);

            });

        // if attribute argument is a string
        else if (typeof attribute === 'string')

            // if the value argument is provided
            if (undefined !== value)

                // iterate over the set of matched elements
                this.forEach(function(element) {

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
                return this[0].getAttribute(attribute);

        // if we get this far, return the set of matched elements
        return this;

    }

    /**
     *  Inserts content, specified by the argument, before each element in the set of matched elements.
     *
     *  Both this and the {@link ZebraJS#insertBefore .insertBefore()} method perform the same task, the main difference
     *  being in the placement of the content and the target. With `.before()`, the selector expression preceding the method
     *  is the target before which the content is to be inserted. On the other hand, with `.insertBefore()`, the content
     *  precedes the method, and it is the one inserted before the target element.
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
     *  @param  {mixed}     content     DOM element, text node, HTML string, or {@link ZebraJS} object to be inserted before
     *                                  each element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the inserted elements).
     *
     *  @memberof   ZebraJS
     *  @alias      before
     *  @instance
     */
    $.fn.before = function(content) {

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
     *  @return {ZebraJS}   Returns the children of each element in the set of matched elements, as a ZebraJS object.
     *
     *  @memberof   ZebraJS
     *  @alias      children
     *  @instance
     */
    $.fn.children = function(selector) {

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
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var element = $('#selector');
     *
     *  // clone element with data and events, including data and events of children
     *  var clones = element.clone(true, true)
     *
     *  // chaining - clone and insert into the body element
     *  element.clone(true, true).appendTo($('body'));
     *
     *  @param  {boolean}   with_data_and_events        Setting this argument to `true` will instruct the method to also copy
     *                                                  event handlers and element data along with the elements.
     *
     *  @param  {boolean}   deep_with_data_and_events   Setting this argument to `true` will instruct the method to also copy
     *                                                  event handlers and data for all children of the cloned element.
     *
     *  @return {ZebraJS}   Returns the cloned elements, as a {@link ZebraJS} object.
     *
     *  @memberof   ZebraJS
     *  @alias      clone
     *  @instance
     */
    $.fn.clone = function(with_data_and_events, deep_with_data_and_events) {

        var result = [], $this = this;

        // iterate over the set of matched elements
        this.forEach(function(element) {

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

                            // if original element has some data attached to it
                            if (element.zjs && clone.zjs.data) {

                                // clone it
                                clone.zjs = {};
                                clone.zjs.data = element.zjs.data;

                            }

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
     *  For each element in the set, get the first element that matches the selector by traversing up through its ancestors
     *  in the DOM tree, beginning with the current element.
     *
     *  Given a {@link ZebraJS} object that represents a set of DOM elements, this method searches through the ancestors of
     *  these elements in the DOM tree, beginning with the current element, and constructs a new {@link ZebraJS} object from
     *  the matching elements.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var element = $('#selector');
     *
     *  // get the first parent that is a div
     *  var closest = element.closest('div');
     *
     *  // chaining
     *  element.closest('div').addClass('foo');
     *
     *  @param  {string}    selector    If the selector is supplied, the parents will be filtered by testing whether they
     *                                  match it.
     *
     *  @return {ZebraJS}   Returns zero or one element for each element in the original set, as a {@link ZebraJS} object
     *
     *  @memberof   ZebraJS
     *  @alias      closest
     *  @instance
     */
    $.fn.closest = function(selector) {

        var result = [];

        // since the checking starts with the element itself, if the element itself matches the selector return now
        if (this[0].matches(selector)) return this;

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // unless we got to the root of the DOM, get the element's parent
            while (!((element = element.parentNode) instanceof Document))

                // if selector was specified and element matches it, don't look any further
                if (element.matches(selector)) {

                    // if not already in the array, add parent to the results array
                    if (result.indexOf(element) === -1) result.push(element);

                    // don't look any further
                    break;

                }

        });

        // return the matched elements, as a ZebraJS object
        return $(result);

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
     *  @return {ZebraJS|mixed}             When `setting` CSS properties, this method returns the set of matched elements.
     *                                      When `reading` CSS properties, this method returns the value(s) of the required computed style(s).
     *
     *  @memberof   ZebraJS
     *  @alias      css
     *  @instance
     */
    $.fn.css = function(property, value) {

        var i, computedStyle,

            // CSS properties that don't have a unit
            // *numeric* values for other CSS properties will be suffixed with "px", unless already suffixed with a unit
            // list taken from https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59
            unitless_properties = [

                'animationIterationCount', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'boxFlex',
                'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'columns', 'flex', 'flexGrow', 'flexPositive',
                'flexShrink', 'flexNegative', 'flexOrder', 'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart',
                'gridColumn', 'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'fontWeight', 'lineClamp',
                'lineHeight', 'opacity', 'order', 'orphans', 'tabSize', 'widows', 'zIndex', 'zoom',

                // svg-related properties
                'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset',
                'strokeMiterlimit', 'strokeOpacity', 'strokeWidth'

            ];

        // if "property" is an object and "value" is not set
        if (typeof property === 'object')

            // iterate through the set of matched elements
            this.forEach(function(element) {

                // iterate through the "properties" object
                for (i in property)

                    // set each style property
                    element.style[i] = property[i] +

                        // if value does not have a unit provided and is not one of the unitless properties, add the "px" suffix
                        (parseFloat(property[i]) === property[i] && unitless_properties.indexOf(i) === -1 ? 'px' : '');

            });

        // if "property" is not an object, and "value" argument is set
        else if (undefined !== value)

            // iterate through the set of matched elements
            this.forEach(function(element) {

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
            computedStyle = window.getComputedStyle(this[0]);

            // return the sought property's value
            return computedStyle[property];

        }

        // if we get this far, return the matched elements
        return this;

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
     *  @return {ZebraJS|mixed}         When `setting` data attributes, this method returns the set of matched elements.
     *                                  When `reading` data attributes, this method returns the stored values, or `undefined`
     *                                  if not data found for the requested key.
     *
     *  @memberof   ZebraJS
     *  @alias      data
     *  @instance
     */
    $.fn.data = function(name, value) {

        // if no name is given, return "undefined"
        if (undefined === name) return undefined;

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
            this.forEach(function(element) {

                // set the data attribute's value
                // since dataset can not store objects, we use JSON.stringify if value is an object
                element.dataset[name] = typeof value === 'object' ? JSON.stringify(value) : value;

            });

            // return the set of matched elements, for chaining
            return this;

        }

        // iterate through the set of matched elements
        this.some(function(element) {

            // if the data attribute exists
            if (undefined !== element.dataset[name]) {

                // first
                try {

                    // check if the stored value is a JSON object
                    // if it is, convert it back to an object
                    value = JSON.parse(element.dataset[name]);

                // if the stored value is not a JSON object
                } catch (err) {

                    // get value
                    value = element.dataset[name];

                }

                // break out of the loop
                return true;

            }

        });

        // return the found value
        // (or "undefined" if not found)
        return value;

    }

    /**
     *  Removes the set of matched elements from the DOM.
     *
     *  This method is the same as the {@link ZebraJS#remove .remove()} method, except that .detach() keeps all events and
     *  data associated with the removed elements. This method is useful when removed elements are to be reinserted into the
     *  DOM at a later time.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var element = $('#selector');
     *
     *  // remove elements from the DOM
     *  var detached = element.detach();
     *
     *  // add them back, together with data and events,
     *  // to the end of the body element
     *  $('body').insert(detached);
     *
     *  @return {ZebraJS}   Returns the removed elements.
     *
     *  @memberof   ZebraJS
     *  @alias      detach
     *  @instance
    */
    $.fn.detach = function() {

        var result = [];

        // iterate over the set of matched elements
        this.forEach(function(element) {

            // the ZebraJS object
            var $element = $(element);

            // clone the element (deep with data and events and add it to the results array)
            result = result.concat($element.clone(true, true));

            // remove the original element from the DOM
            $element.remove();

        });

        // return the removed elements
        return $(result);

    }

    /**
     *  Iterates over the set of matched elements, executing a callback function for each element in the set.
     *
     *  @param  {function}  callback    The function to execute for each item in the set. The callback function receives two
     *                                  arguments: the element's position in the set, called `index` (0-based), and the DOM
     *                                  element. The `this` keyword inside the callback function refers to the DOM element.
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
     *      $(this).css('display', 'none');
     *
     *  });
     *
     *  @return {undefined}
     *
     *  @memberof   ZebraJS
     *  @alias      each
     *  @instance
     */
    $.fn.each = function(callback) {

        // iterate through the set of matched elements
        for (var i = 0; i < this.length; i++)

            //  apply the callback function
            if (callback.call(this[i], i, this[i]) === false) return;

    }

    /**
     *  Reduces the set of matched elements to the one at the specified index.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var elements = $('.selector');
     *
     *  // assuming there are 6 elements in the set of matched elements
     *  // add the "foo" class to the 5th element
     *  elements.eq(4).addClass('foo');
     *
     *  @param  {integer}   index   An integer indicating the 0-based position of the element. If a negative integer is
     *                              given the counting will go backwards, starting from the last element in the set.
     *
     *  @return {ZebraJS}   Returns the element at the specified index, as a ZebraJS object.
     *
     *  @memberof   ZebraJS
     *  @alias      eq
     *  @instance
     */
    $.fn.eq = function(index) {

        // return the element at the specified index
        return $(this.get(index));

    }

    /**
     *  Gets the descendants of each element in the current set of matched elements, filtered by a selector, {@link ZebraJS}
     *  object, or a DOM element.
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
     *  @param  {string}    selector    A selector to filter descendant elements by. It can be a query selector, a
     *                                  {@link ZebraJS} object, or a DOM element.
     *
     *  @return {ZebraJS}   Returns the descendants of each element in the current set of matched elements, filtered by a
     *                      selector, {@link ZebraJS} object, or DOM element, as a {@link ZebraJS} object.
     *
     *  @memberof   ZebraJS
     *  @alias      find
     *  @instance
     */
    $.fn.find = function(selector) {

        var result = [];

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // if selector is a ZebraJS object
            if (typeof selector === 'object' && selector.version)

                // iterate through the elements in the object
                selector.forEach(function(wrapped) {

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
     *  Constructs a new {@link ZebraJS} object from the first element in the set of matched elements.
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
     *  @return {ZebraJS}   Returns the first element from the list of matched elements, as a ZebraJS object
     *
     *  @memberof   ZebraJS
     *  @alias      first
     *  @instance
     */
    $.fn.first = function() {

        // returns the first element from the list of matched elements, as a ZebraJS object
        return $(this[0]);

    }

    /**
     *  Retrieves one of the elements matched by the {@link ZebraJS} object.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var elements = $('selector');
     *
     *  // this gets the second DOM element from the list of matched elements
     *  elements.get(1);
     *
     *  @param  {integer}   index   The index (starting from `0`) of the DOM element to return from the list of matched
     *                              elements
     *
     *  @memberof   ZebraJS
     *  @alias      get
     *  @instance
     */
    $.fn.get = function(index) {

        // return the matching DOM element
        return this[index];

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
     *
     *  @memberof   ZebraJS
     *  @alias      hasClass
     *  @instance
     */
    $.fn.hasClass = function(class_name) {

        // iterate through the set of matched elements
        for (var i = 0; i < this.length; i++)

            // if sought class exists, return TRUE
            if (this[i].classList.contains(class_name)) return true;

        // return FALSE if we get this far
        return false;

    }

    /**
     *  Returns the current computed **inner** height (without `padding`, `border` and `margin`) of the first element
     *  in the set of matched elements as `float`, or sets the `height` CSS property of every element in the set.
     *
     *  See {@link ZebraJS#outerHeight .outerHeight()} for getting the height including `padding`, `border` and, optionally,
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
     *  @return {ZebraJS|float}     When **setting** the `height`, this method returns the set of matched elements.
     *                              Otherwise, it returns the current computed **inner** height (without `padding`, `border`
     *                              and `margin`) of the first element in the set of matched elements, as `float`.
     *
     *  @memberof   ZebraJS
     *  @alias      height
     *  @instance
     */
    $.fn.height = function(height) {

        // if "height" is given, set the height of every matched element, making sure to suffix the value with "px"
        // if not otherwise specified
        if (height) return this.css('height', height + (parseFloat(height) === height ? 'px' : ''));

        // for the "window"
        if (this[0] === window) return window.innerHeight;

        // for the "document"
        if (this[0] === document)

            // return height
            return Math.max(
                document.body.offsetHeight,
                document.body.scrollHeight,
                document.documentElement.clientHeight,
                document.documentElement.offsetHeight,
                document.documentElement.scrollHeight
            );

        // get the first element's height, top/bottom padding and borders
        var styles = window.getComputedStyle(this[0]),
            offset_height = this[0].offsetHeight,
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
     *  @return {ZebraJS|string}        When the `content` argument is provided, this method returns the set of matched
     *                                  elements. Otherwise it returns the HTML content of the first element in the set of
     *                                  matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      html
     *  @instance
     */
    $.fn.html = function(content) {

        // if content is provided
        if (content)

            // iterate through the set of matched elements
            this.forEach(function(element) {

                // set the HTML content of each element
                element.innerHTML = content;

            });

        // if content is not provided
        // return the content of the first element in the set of matched elements
        else return this[0].innerHTML;

        // return the set of matched elements
        return this;

    }

    /**
     *  Checks the current matched set of elements against a selector, element, or ZebraJS object and returns `true` if at
     *  least one of these elements matches the given arguments.
     *
     *  > Note that, unlike jQuery, when matching selectors, this method matches only valid CSS selectors!
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var element = $('#selector');
     *
     *  // returns true if the element is a "select" element
     *  console.log(element.is('select'))
     *
     *  @param  {mixed}     selector    A string containing a selector expression to match elements against, a DOM element
     *                                  or a ZebraJS object.
     *
     *  @return {boolean}   Returns `true` if at least one of the elements from the currently matched set matches the given
     *                      argument.
     *
     *  @memberof   ZebraJS
     *  @alias      is
     *  @instance
     */
    $.fn.is = function(selector) {

        var result = false;

        // iterate over the set of matched elements
        this.forEach(function(element) {

            // if
            if (

                // selector is a CSS selector and the current element matches the selector OR
                (typeof selector === 'string' && element.matches(selector)) ||

                // selector is a ZebraJS object and the current element matches the first element in the set of matched elements OR
                (typeof selector === 'object' && selector.version && element === selector[0]) ||

                // selector is a DOM element and current element matches it
                (typeof selector === 'object' && (selector instanceof Document || selector instanceof Element || selector instanceof Text || selector instanceof Window) && element === selector)

            ) {

                // set result to TRUE
                result = true;

                // don't look further
                return false;

            }

        });

        // return result
        return result;

    }

    /**
     *  Inserts every element in the set of matched elements after the parent element(s), specified by the argument.
     *
     *  Both this and the {@link ZebraJS#after .after()} method perform the same task, the main difference being in the
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
     *  @param  {ZebraJS}   target  A ZebraJS object after which to insert each element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the ZebraJS object after the content is inserted.
     *
     *  @memberof   ZebraJS
     *  @alias      insertAfter
     *  @instance
     */
    $.fn.insertAfter = function(target) {

        // call the "_dom_insert" private method with these arguments
        return $(target)._dom_insert(this, 'after');

    }

    /**
     *  Inserts every element in the set of matched elements before the parent element(s), specified by the argument.
     *
     *  Both this and the {@link ZebraJS#before .before()} method perform the same task, the main difference being in the
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
     *  @param  {ZebraJS}   target  A ZebraJS object before which to insert each element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the ZebraJS object before which the content is inserted.
     *
     *  @memberof   ZebraJS
     *  @alias      insertBefore
     *  @instance
     */
    $.fn.insertBefore = function(target) {

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
     *  @return {ZebraJS}   Returns the immediately following sibling of each element in the set of matched elements,
     *                      optionally filtered by a selector, as a ZebraJS object.
     *
     *  @memberof   ZebraJS
     *  @alias      next
     *  @instance
     */
    $.fn.next = function(selector) {

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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      off
     *  @instance
     */
    $.fn.off = function(event_type, callback) {

        var event_types = event_type ? event_type.split(' ') : Object.keys(event_listeners), namespace, remove_all_event_handlers = !event_type;

        // iterate through the set of matched elements
        this.forEach(function(element) {

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
        return this;

    }

    /**
     *  Gets the current coordinates of the first element in the set of matched elements, relative to the document.
     *
     *  This method retrieves the current position of an element relative to the document, in contrast with the
     *  {@link ZebraJS#position .position()} method which retrieves the current position relative to the offset parent.
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
     *
     *  @memberof   ZebraJS
     *  @alias      offset
     *  @instance
     */
    $.fn.offset = function() {

        // get the bounding box of the first element in the set of matched elements
        var box = this[0].getBoundingClientRect();

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
     *  // namespacing, so that you can remove only certain events
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
     *  // multiple events
     *  element.on({
     *      mouseenter: function() { ... },
     *      mouseleave: function() { ... }
     *  });
     *
     *  @param  {string}    event_type  One or more space-separated event types and optional namespaces, such as "click" or
     *                                  "click.namespace". Can also be given as an object.
     *
     *  @param  {string}    [selector]  A selector string to filter the descendants of the selected elements that will call
     *                                  the handler. If the selector is null or omitted, the handler is always called when it
     *                                  reaches the selected element.
     *
     *  @param  {function}  callback    A function to execute when the event is triggered.
     *
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      on
     *  @instance
     */
    $.fn.on = function(event_type, selector, callback, once) {

        var event_types, namespace, actual_callback, i;

        // if event_type is given as object
        if (typeof event_type === 'object') {

            // iterate over all the events
            for (i in event_type)

                // bind them
                this.on(i, event_type[i]);

            // don't go forward
            return;

        }

        // if more than a single event was given
        event_types = event_type.split(' ');

        // if method is called with just 2 arguments,
        // the seconds argument is the callback not a selector
        if (undefined === callback) callback = selector;

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // iterate through the event types we have to attach the handler to
            event_types.forEach(function(original_event) {

                actual_callback = false;

                // handle namespacing
                namespace = original_event.split('.')
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

                        // if the callback needs to be executed only once, remove it now
                        if (once) $(this).off(original_event, callback);

                        // trigger the callback function only if the target element matches the selector
                        if (this !== e.target && e.target.matches(selector)) callback(e);

                    };

                    // attach event listener
                    element.addEventListener(event_type, actual_callback);

                // if the callback needs to be executed only once
                } else if (once) {

                    // the actual callback function
                    actual_callback = function(e) {

                        // remove the event handler
                        $(this).off(original_event, callback);

                        // execute the callback function
                        callback(e);

                    }

                    // set the event listener
                    element.addEventListener(event_type, actual_callback);

                // registering of default event listeners
                } else element.addEventListener(event_type, callback);

                // add element/callback combination to the array of events of this type
                event_listeners[event_type].push([element, callback, namespace, actual_callback]);

            });

        });

        // return the set of matched elements, for chaining
        return this;

    }

    /**
     *  Attaches an event handler function for one or more events to the selected elements. The event handler is executed at
     *  most once per element per event type.
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
     *  // (the callback will be executed only once)
     *  element.one('click', callback);
     *
     *  // handle clicks on element using an anonymous function
     *  // (the callback will be executed only once)
     *  element.one('click', function(e) {
     *      console.log('clicked!');
     *  });
     *
     *  // namespacing, so that you can remove only certain events
     *  // (the callback will be executed only once)
     *  element.one('click.namespace', function(e) {
     *      console.log('clicked!');
     *  });
     *
     *  // using delegation
     *  // handle clicks on all the "div" elements
     *  // that are children of the element
     *  // (the callback will be executed only once for each matched element)
     *  element.one('click', 'div', function(e) {
     *      console.log('clicked!');
     *  });
     *
     *  // chaining
     *  element.one('click', function() {
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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      one
     *  @instance
     */
    $.fn.one = function(event_type, selector, callback) {

        // call the "on" method with last argument set to TRUE
        this.on(event_type, selector, callback, true);

    }

    /**
     *  Returns the current computed height for the first element in the set of matched elements, including `padding`,
     *  `border` and, optionally, `margin`.
     *
     *  > For hidden elements the returned value is `0`!
     *
     *  See {@link ZebraJS#height .height()} for getting the **inner** height without `padding`, `border` and `margin`.
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
     *
     *  @memberof   ZebraJS
     *  @alias      outerHeight
     *  @instance
     */
    $.fn.outerHeight = function(include_margins) {

        // get the values of all the CSS properties of the element
        // after applying the active stylesheets and resolving any
        // basic computation those values may contain
        var computed_style = window.getComputedStyle(this[0]);

        // return the result of inner height together with
        return (parseFloat(computed_style.height) +

            // include margins, if requested
            (include_margins ? parseFloat(computed_style.marginTop) + parseFloat(computed_style.marginBottom) : 0)) || 0;

    }

    /**
     *  Returns the current computed width for the first element in the set of matched elements, including `padding`,
     *  `border` and, optionally, `margin`.
     *
     *  > For hidden elements the returned value is `0`!
     *
     *  See {@link ZebraJS#width .width()} for getting the **inner** width without `padding`, `border` and `margin`.
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
     *
     *  @memberof   ZebraJS
     *  @alias      outerWidth
     *  @instance
     */
    $.fn.outerWidth = function(include_margins) {

        // get the values of all the CSS properties of the element
        // after applying the active stylesheets and resolving any
        // basic computation those values may contain
        var computed_styles = window.getComputedStyle(this[0]);

        // return the result of inner width together with
        return (parseFloat(computed_styles.width) +

            // include margins, if requested
            (include_margins ? parseFloat(computed_styles.marginLeft) + parseFloat(computed_styles.marginRight) : 0)) || 0;

    }

    /**
     *  Gets the immediate parent of each element in the current set of matched elements, optionally filtered by a selector.
     *
     *  This method is similar to {@link ZebraJS#parents .parents()}, except .parent() only travels a single level up the
     *  DOM tree.
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
     *  @return {ZebraJS}   Returns the immediate parent of each element in the current set of matched elements, optionally
     *                      filtered by a selector, as a ZebraJS object.
     *
     *  @memberof   ZebraJS
     *  @alias      parent
     *  @instance
     */
    $.fn.parent = function(selector) {

        var result = [];

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // if no selector is provided or it is and the parent matches it, add element to the array
            if (!selector || element.parentNode.matches(selector)) result.push(element.parentNode);

        });

        // return the resulting array
        return $(result);

    }

    /**
     *  Gets the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
     *
     *  Given a {@link ZebraJS} object that represents a set of DOM elements, this method allows us to search through the
     *  ancestors of these elements in the DOM tree and construct a new {@link ZebraJS} object from the matching elements
     *  ordered from immediate parent on up; the elements are returned in order from the closest parent to the outer ones.
     *  When multiple DOM elements are in the original set, the resulting set will have duplicates removed.
     *
     *  This method is similar to {@link ZebraJS#parent .parent()}, except .parent() only travels a single level up the DOM
     *  tree, while this method travels all the way up to the DOM root.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var element = $('#selector');
     *
     *  // get *all* the element's parent
     *  var parents = element.parents();
     *
     *  // get all the element's parent until the first div (including also that first div)
     *  var parents = element.parents('div');
     *
     *  // chaining
     *  element.parents('div').addClass('foo');
     *
     *  @param  {string}    selector    If the selector is supplied, the parents will be filtered by testing whether they
     *                                  match it.
     *
     *  @return {ZebraJS}   Returns an array of parents of each element in the current set of matched elements, optionally
     *                      filtered by a selector, as a ZebraJS object.
     *
     *  @memberof   ZebraJS
     *  @alias      parents
     *  @instance
     */
    $.fn.parents = function(selector) {

        var result = [];

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // unless we got to the root of the DOM, get the element's parent
            while (!((element = element.parentNode) instanceof Document)) {

                // if not already in the array, add parent to the results array
                if (result.indexOf(element) === -1) result.push(element)

                // if selector was specified and element matches it, don't look any further
                if (selector && element.matches(selector)) break;

            }

        });

        // return the matched elements, as a ZebraJS object
        return $(result);

    }

    /**
     *  Gets the current coordinates of the first element in the set of matched elements, relative to the offset parent.
     *
     *  This method retrieves the current position of an element relative to the offset parent, in contrast with the
     *  {@link ZebraJS#offset .offset()} method which retrieves the current position relative to the document.
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
     *
     *  @memberof   ZebraJS
     *  @alias      position
     *  @instance
     */
    $.fn.position = function() {

        // return the position of the first element in the set of matched elements
        return {
            left: parseFloat(this[0].offsetLeft),
            top: parseFloat(this[0].offsetTop)
        }

    }

    /**
     *  Inserts content, specified by the argument, to the beginning of each element in the set of matched elements.
     *
     *  Both this and the {@link ZebraJS#prependTo .prependTo()} method perform the same task, the main difference being in
     *  the placement of the content and the target. With `.prepend()`, the selector expression preceding the method is the
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
     *  @param  {mixed}     content     DOM element, text node, HTML string, or {@link ZebraJS} object to insert at the
     *                                  beginning of each element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the prepended elements).
     *
     *  @memberof   ZebraJS
     *  @alias      prepend
     *  @instance
     */
    $.fn.prepend = function(content) {

        // call the "_dom_insert" private method with these arguments
        return this._dom_insert(content, 'prepend');

    }

    /**
     *  Inserts every element in the set of matched elements to the beginning of the parent element(s), specified by the argument.
     *
     *  Both this and the {@link ZebraJS#prepend .prepend()} method perform the same task, the main difference being in the
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
     *  @param  {ZebraJS}   parent      A ZebraJS object at beginning of which to insert each element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the ZebraJS object you are appending to.
     *
     *  @memberof   ZebraJS
     *  @alias      prependTo
     *  @instance
     */
    $.fn.prependTo = function(parent) {

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
     *  // get the previous sibling
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
     *  @return {ZebraJS}   Returns the immediately preceding sibling of each element in the set of matched elements,
     *                      optionally filtered by a selector, as a ZebraJS object.
     *
     *  @memberof   ZebraJS
     *  @alias      prev
     *  @instance
     */
    $.fn.prev = function(selector) {

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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      ready
     *  @instance
     */
    $.fn.ready = function(callback) {

        // if DOM is already ready, fire the callback now
        if (document.readyState === 'complete' || document.readyState !== 'loading') callback();

        // otherwise, wait for the DOM and execute the callback when the it is ready
        else document.addEventListener('DOMContentLoaded', callback);

        // return the set of matched elements
        return this;

    }

    /**
     *  Removes the set of matched elements from the DOM.
     *
     *  Use this method when you want to remove the element itself, as well as everything inside it. In addition to the elements
     *  themselves, all attached event handlers and data attributes associated with the elements are also removed.
     *
     *  To remove the elements without removing data and event handlers, use {@link ZebraJS#detach() .detach()} instead.
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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      remove
     *  @instance
    */
    $.fn.remove = function() {

        // iterate over the set of matched elements
        this.forEach(function(element) {

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
        return this;

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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      removeClass
     *  @instance
     */
    $.fn.removeClass = function(class_name) {

        // remove class(es) and return the set of matched elements
        return this._class('remove', class_name);

    }

    /**
     *  Replaces each element in the set of matched elements with the provided new content and returns the set of elements
     *  that was removed.
     *
     *  > Note that if the method's argument is a selector, then clones of the element described by the selector will be
     *  created and used for replacing each element in the set of matched elements, except for the last one. The original
     *  item will be moved (not cloned) and used to replace the last target.
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
     *  @param  {mixed} element     A string, a {@link ZebraJS} object or a DOM element to use as replacement for each
     *                              element in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      replaceWith
     *  @instance
     */
    $.fn.replaceWith = function(element) {

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
     *  @return {ZebraJS|integer}       When `setting` the horizontal position, this method returns the set of matched elements.
     *                                  When `reading` the horizontal position, this method returns the horizontal position of
     *                                  the scrollbar for the first element in the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      scrollLeft
     *  @instance
     */
    $.fn.scrollLeft = function(value) {

        // if value is not specified, return the scrollLeft value of the first element in the set of matched elements
        if (undefined === value) return this[0] instanceof Window || this[0] instanceof Document ? document.documentElement.scrollLeft : this[0].scrollLeft;

        // iterate through the set of matched elements
        this.forEach(function(element) {

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
     *  @return {ZebraJS|integer}       When `setting` the vertical position, this method returns the set of matched elements.
     *                                  When `reading` the vertical position, this method returns the vertical position of
     *                                  the scrollbar for the first element in the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      scrollTop
     *  @instance
     */
    $.fn.scrollTop = function(value) {

        // if value is not specified, return the scrollTop value of the first element in the set of matched elements
        if (undefined === value) return this[0] instanceof Window || this[0] instanceof Document ? document.documentElement.scrollTop : this[0].scrollTop;

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // set the scrollTop value for each element
            // apply "parseFloat" in case is provided as string or suffixed with "px"
            element.scrollTop = parseFloat(value);

        });

    }

    /**
     *  If the first element in the set of matched elements is a `form` element, this method returns the encodes string of
     *  the form's elements and their respective values.
     *
     *  > Only "successful controls" are serialized to the string. No submit button value is serialized since the form was
     *  not submitted using a button. For a form element's value to be included in the serialized string, the element must
     *  have a name attribute. Values from checkboxes and radio buttons (inputs of type "radio" or "checkbox") are included
     *  only if they are checked. Data from file select elements is not serialized.
     *
     *  This method creates a text string in standard URL-encoded notation.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var form = $('#form');
     *
     *  // serialize form's elements and their values
     *  var serialized = form.serialize();
     *
     *  @return {string}    Returns the serialized form as a query string that could be sent to a server in an Ajax request.
     *
     *  @memberof   ZebraJS
     *  @alias      serialize
     *  @instance
     */
    $.fn.serialize = function() {

        var form = this[0], result = [];

        // if element is a form
        if (typeof form === 'object' && form.nodeName === 'FORM')

            // iterate over the form's elements
            Array.prototype.slice.call(form.elements).forEach(function(control) {

                // if element has a name, it is not disabled and it is not a "file", a "reset", a "submit" not a "button"
                if (control.name && !control.disabled && ['file', 'reset', 'submit', 'button'].indexOf(control.type) === -1)

                    // if element is a multiple select
                    if (control.type === 'select-multiple')

                        // iterate over the available options
                        Array.prototype.slice.call(control.options).forEach(function(option) {

                            // add each selected option to the result
                            if (option.selected) result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(option.value))

                        });

                    // if not a radio or a checkbox, or a checked radio/checkbox
                    else if (['checkbox', 'radio'].indexOf(control.type) === -1 || control.checked)

                        // add to result
                        result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(control.value));

            });

        // return the serialized result
        return result.join('&').replace(/\%20/g, '+');

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
     *  @return {ZebraJS}   Returns the siblings of each element in the set of matched elements, as a ZebraJS object
     *
     *  @memberof   ZebraJS
     *  @alias      siblings
     *  @instance
     */
    $.fn.siblings = function(selector) {

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
     *  @return {ZebraJS|string}        When the `content` argument is provided, this method returns the set of matched
     *                                  elements. Otherwise it returns the text content of the first element in the set of
     *                                  matched elements (combined with the text content of all its descendants)
     *
     *  @memberof   ZebraJS
     *  @alias      text
     *  @instance
     */
    $.fn.text = function(content) {

        // if content is provided
        if (content)

            // iterate through the set of matched elements
            this.forEach(function(element) {

                // set the text content of each element
                element.textContent = content;

            });

        // if content is not provided
        // return the text content of the first element in the set of matched elements
        // (combined with the text content of all its descendants)
        else return this[0].textContent;

        // return the set of matched elements
        return this;

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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      toggleClass
     *  @instance
     */
    $.fn.toggleClass = function(class_name) {

        // toggle class(es) and return the set of matched elements
        return this._class('toggle', class_name);

    }

    /**
     *  Execute all handlers attached to the matched elements for the given event type, in the same order they would be if
     *  the event were triggered naturally by the user.
     *
     *  `.trigger()`ed events bubble up the DOM tree; an event handler can stop the bubbling by returning `false` from the
     *  handler or calling the `.stopPropagation()` method on the event object passed into the event.
     *
     *  @example
     *
     *  // always cache selectors
     *  // to avoid DOM scanning over and over again
     *  var element = $('#selector');
     *
     *  // handle clicks on element
     *  element.on('click', function(e) {
     *
     *      // will return "undefined" when element is clicked
     *      // but will return "baz" when triggered manually
     *      console.log(e.foo)
     *
     *  });
     *
     *  // manually trigger the click event
     *  element.trigger('click', {foo: 'baz'});
     *
     *  // chaining
     *  element.trigger('click', {foo: 'baz'}).addClass('foo');
     *
     *  @param  {string}    event_type  A string containing a JavaScript event type, such as `click` or `submit`.
     *
     *  @param  {object}    data        Additional parameters to pass along to the event handler.
     *
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      trigger
     *  @instance
     */
    $.fn.trigger = function(event_type, data) {

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // create the event
            var event = document.createEvent('HTMLEvents');

            // define the event's name
            // the event will bubble and it is cancelable
            event.initEvent(event_type, true, true);

            // if data is specified and is an object
            if (typeof data === 'object')

                // iterate over the object's keys
                Object.keys(data).forEach(function(key) {

                    // attach them to the event object
                    event[key] = data[key];

                });

            // dispatch the event
            element.dispatchEvent(event);

        });

        // return the set of matched elements, for chaining
        return this;

    }

    /**
     *  Removes the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
     *
     *  This method is effectively the inverse of the {@link ZebraJS#wrap .wrap()} method. The matched elements (and their
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
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      unwrap
     *  @instance
     */
    $.fn.unwrap = function(selector) {

        // iterate through the set of matched elements
        this.forEach(function(element) {

            // get the element's parent, optionally filtered by a selector,
            // and replace it with the element
            $(element).parent(selector).replaceWith(element);

        });

        // return the set of matched elements
        return this;

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
     *  @return {ZebraJS|mixed}         If setting a value, this method returns the set of matched elements. If called without
     *                                  the argument, the method return the current value of the first element in the set of
     *                                  matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      val
     *  @instance
     */
    $.fn.val = function(value) {

        var result = [];

        // if "value" argument is not specified
        if (undefined === value) {

            // if first element in the list of matched elements is a select box with the "multiple" attribute set
            if (this[0].tagName.toLowerCase() === 'select' && this[0].multiple) {

                // add each selected option to the results array
                Array.prototype.slice.call(this[0].options).map(function(elem) {

                    if (elem.selected) result.push(elem.value)

                });

                // return the values of selected options
                return result;

            }

            // for other elements, return the first element's value
            return this[0].value;

        }

        // if "value" argument is specified
        // iterate through the set of matched elements
        this.forEach(function(element) {

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
        return this;

    }

    /**
     *  Returns the current computed **inner** width (without `padding`, `border` and `margin`) of the first element
     *  in the set of matched elements as `float`, or sets the `width` CSS property of every element in the set.
     *
     *  See {@link ZebraJS#outerWidth .outerWidth()} for getting the width including `padding`, `border` and, optionally,
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
     *  @return {ZebraJS|float}     When **setting** the `width`, this method returns the set of matched elements. Otherwise,
     *                              it returns the current computed **inner** width (without `padding`, `border` and `margin`)
     *                              of the first element in the set of matched elements, as `float`.
     *
     *  @memberof   ZebraJS
     *  @alias      width
     *  @instance
     */
    $.fn.width = function(width) {

        // if "width" is given, set the width of every matched element, making sure to suffix the value with "px"
        // if not otherwise specified
        if (width) return this.css('width', width + (parseFloat(width) === width ? 'px' : ''));

        // for the "window"
        if (this[0] === window) return window.innerWith;

        // for the "document"
        if (this[0] === document)

            // return width
            return Math.max(
                document.body.offsetWidth,
                document.body.scrollWidth,
                document.documentElement.clientWidth,
                document.documentElement.offsetWidth,
                document.documentElement.scrollWidth
            );

        // get the first element's width, left/right padding and borders
        var styles = window.getComputedStyle(this[0]),
            offset_width = this[0].offsetWidth,
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
     *  @param  {mixed} element     A string, a {@link ZebraJS} object or a DOM element in which to wrap around each element
     *                              in the set of matched elements.
     *
     *  @return {ZebraJS}   Returns the set of matched elements.
     *
     *  @memberof   ZebraJS
     *  @alias      wrap
     *  @instance
     */
    $.fn.wrap = function(element) {

        // call the "_dom_insert" private method with these arguments
        return this._dom_insert(element, 'wrap');

    }

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
