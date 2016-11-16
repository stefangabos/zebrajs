/**
 *  @todo   Needs to be written!
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
