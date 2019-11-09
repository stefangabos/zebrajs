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
 *                                  When `reading` data attributes, this method returns the stored value, or `undefined`
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

		// setting dataset value
		if(value !== undefined) {
			// iterate through the set of matched elements
			this.forEach(function(element) {
				element.dataset[name] = value;
			});
			// return collection
			return this;
		}
		
		// gettings first value, if exist
		this.some(function(element) {
			if(element.dataset[name] !== undefined) {
				value = element.dataset[name];
				return true;
			}
		});
		
		return value;
    }