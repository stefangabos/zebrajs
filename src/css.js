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
elements.css = function(property, value) {

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
    return elements;

}
