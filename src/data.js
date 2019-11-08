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
$.fn.data = function (name, value) 
{
	// if no name is given, return "undefined"
	if (undefined === name) return undefined;

	// make sure the name follows the Dataset API specs
	// http://www.w3.org/TR/html5/dom.html#dom-dataset
	name = name

		// replace "-" followed by an ascii letter to that letter in uppercase
		.replace(/\-([a-z])/ig, function () { return arguments[1].toUpperCase(); })

		// remove any left "-"
		.replace(/\-/g, '');

	// iterate through the set of matched elements
	this.some(function (element)
	{
		// initialize the "zjs" "private" property, if not already initialized
		if (!element.zjs) element.zjs = {};

		// if not already initialized...
		if (!element.zjs.data)
		{
			// ...initialize the "data" property,
			element.zjs.data = {};

			// iterate over the element's existing attributes
			Array.prototype.slice.call(element.attributes).forEach(function (attribute)
			{

				// if we found an attribute starting with "data-"
				if (attribute.name.indexOf('data-') === 0)
				{

					// make sure the name follows the Dataset API specs
					var name = attribute.name

						// remove the "data-" prefix
						.replace(/^data\-/, '')

						// replace "-" followed by an ascii letter to that letter in uppercase
						.replace(/\-([a-z])/ig, function () { return arguments[1].toUpperCase(); })

						// remove any left "-"
						.replace(/\-/g, '');

					// store the data attribute
					element.zjs.data[name] = attribute.value;
				}
			});
		}

		// if "value" argument is not provided, return the existing value, or "undefined" if no value exists
		if (value === undefined)
			return true;

		// if value is not already set, or it is set but it is of different type, set it now
		if (!element.zjs.data[name] || typeof value !== typeof element.zjs.data[name])
			element.zjs.data[name] = value;
		// if both the existing value and the new one are objects
		else if (typeof value === 'object' && typeof element.zjs.data[name] === 'object')
			// merge the new values with the old ones
			Object.keys(value).forEach(function (key)
			{
				element.zjs.data[name][key] = value[key];
			});
	});
	if (value === undefined)
		// if "value" argument is not provided, return the existing value, or "undefined" if no value exists
		return this[0].zjs ? this[0].zjs.data[name] : undefined;
	else
		return this;
};

    // if no name is given, return "undefined"
    if (undefined === name) return undefined;

    // make sure the name follows the Dataset API specs
    // http://www.w3.org/TR/html5/dom.html#dom-dataset
    name = name

        // replace "-" followed by an ascii letter to that letter in uppercase
        .replace(/\-([a-z])/ig, function() { return arguments[1].toUpperCase(); })

        // remove any left "-"
        .replace(/\-/g, '');

    // iterate through the set of matched elements
    this.some(function(element) {

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

        // if "value" argument is not provided
        // break out of "some" after the first element
        if (undefined === value) return true;

        // if value is not already set, or it is set but it is of different type, set it now
        if (!element.zjs.data[name] || typeof value !== typeof element.zjs.data[name]) element.zjs.data[name] = value;

        // if both the existing value and the new one are objects
        else if (typeof value === 'object' && typeof element.zjs.data[name] === 'object')

            // merge the new values with the old ones
            Object.keys(value).forEach(function(key) {

                element.zjs.data[name][key] = value[key];

            });

    });

    // if "value" argument is provided
    // return the set of matched elements
    if (undefined !== value) return this;

    // if "value" argument is not provided, return the existing value, or "undefined" if no value exists
    return this[0].zjs ? this[0].zjs.data[name] : undefined;

}
