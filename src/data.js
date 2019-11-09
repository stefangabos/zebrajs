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
