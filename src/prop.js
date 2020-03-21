/**
 *  Gets the value of a property for the first element in the set of matched elements, or set one or more properties for
 *  every matched element.
 */
$.fn.prop = function(prop, value) {

    // if property argument is an object
    if (typeof prop === 'object')

        // iterate over the set of matched elements
        this.forEach(function(element) {

            // iterate over the properties
            for (var i in prop)

                // set each property
                element[i] = prop[i];

        });

    // if property argument is a string
    else if (typeof prop === 'string')

        // if the value argument is provided
        if (undefined !== value)

            // iterate over the set of matched elements
            this.forEach(function(element) {

                // if value argument's value is FALSE or NULL
                if (value === false || value === null) {

                    // remove the property (delete has problems in some browsers)
                    if (prop in element) element[prop] = undefined;

                // for other values, set the property value
                } else element[prop] = value;

            });

        // if the value argument is not provided
        // return the value of the requested property
        // of the first element in the set of matched elements
        else {

            if (prop in this[0]) return this[0][prop];
            else return undefined;

        }

    // if we get this far, return the set of matched elements
    return this;

};
