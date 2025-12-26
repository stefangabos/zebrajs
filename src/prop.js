/**
 *  Gets the value of a property for the first element in the set of matched elements, or sets one or more properties for
 *  every matched element.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
 *
 *  // get the value of a property
 *  // for the first element in the set of matched elements
 *  elements.prop('disabled');
 *
 *  // set a single property
 *  elements.prop('disabled', true);
 *
 *  // set multiple properties
 *  elements.prop({
 *      disabled: true,
 *      checked: false
 *  });
 *
 *  // remove a property
 *  elements.prop('disabled', false);
 *
 *  // chaining
 *  elements.prop('disabled', true).addClass('foo');
 *
 *  @param  {string|object} prop        If given as a `string` representing a property name and `value` **is not** set,
 *                                      this method will return the value of that particular property for the first element
 *                                      in the set of matched elements.
 *                                      <br><br>
 *                                      If given as a `string` representing a property name and `value` **is** set, this
 *                                      method will set that particular property's value for all the elements in the set
 *                                      of matched elements.
 *                                      <br><br>
 *                                      If given as an `object`, this method will set the given properties to the given
 *                                      values for all the elements in the set of matched elements.
 *
 *  @param  {mixed}         [value]     The value to be set for the property given as argument. *Only used if `prop` is
 *                                      not an object!*
 *                                      <br><br>
 *                                      Setting it to `false` or `null` will instead **delete** the property from the set
 *                                      of matched elements.
 *
 *  @return {ZebraJS|mixed}             When `setting` properties, this method returns the set of matched elements. When
 *                                      `reading` properties, this method returns the value of the requested property.
 *
 *  @memberof   ZebraJS
 *  @alias      prop
 *  @instance
 */
$.fn.prop = function(prop, value) {

    // if property argument is an object
    if (typeof prop === 'object')

        // iterate over the set of matched elements
        this.forEach(element => {

            // iterate over the properties
            for (const i in prop)

                // set each property
                element[i] = prop[i];

        });

    // if property argument is a string
    else if (typeof prop === 'string')

        // if the value argument is provided
        if (undefined !== value)

            // iterate over the set of matched elements
            this.forEach(element => {

                // if value argument's value is FALSE or NULL
                if (value === false || value === null) {

                    // delete the property
                    if (prop in element) delete element[prop];

                // for other values, set the property value
                } else element[prop] = value;

            });

        // if the value argument is not provided
        // return the value of the requested property
        // of the first element in the set of matched elements
        else {

            if (prop in this[0]) return this[0][prop];

            return undefined;

        }

    // if we get this far, return the set of matched elements
    return this;

};
