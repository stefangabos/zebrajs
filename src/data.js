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

    // WeakMap for storing complex objects (DOM elements, array-like object with DOM elements, functions , etc.)
    // use a shared WeakMap attached to the $ object to persist across calls
    if (!$._data_storage) $._data_storage = new WeakMap();

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

            // check if value is a complex object that can't be JSON stringified properly
            // (functions, DOM elements, objects with methods)
            if (typeof value === 'function' || (typeof value === 'object' && (

                    // DOM element
                    value.nodeType ||

                    // array-like object with at least one DOM element
                    (value.length !== undefined && Array.prototype.some.call(value, function(item) {
                        return item && item.nodeType;
                    }))

            ))) {

                // try to get the existing WeakMap data for the element
                var element_data = $._data_storage.get(element);

                // if WeakMap data is not yet initialized
                if (!element_data) {

                    // initialize it now and set it
                    element_data = {};
                    $._data_storage.set(element, element_data);

                }

                // add/update entry with the requested value
                element_data[name] = value;

            // for non-complex objects
            } else {

                // use dataset for simple values
                element.dataset[name] = typeof value === 'object' ? JSON.stringify(value) : value;

            }

        });

        // return the set of matched elements, for chaining
        return this;

    }

    // make sure we return "undefined" if the next code block doesn't yield a result
    value = undefined;

    // if we are retrieving a data value
    // iterate through the set of matched elements
    this.some(function(element) {

        // first check if we have any data in the WeakMap associated with the element
        var element_data = $._data_storage.get(element);

        // if we do
        if (element_data && undefined !== element_data[name]) {

            // extract it
            value = element_data[name];

            // don't look further
            return true;

        }

        // then check dataset for simple values
        if (element.dataset && undefined !== element.dataset[name]) {

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
