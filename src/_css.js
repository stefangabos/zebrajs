/**
 *  Gets the value of a computed style property for the first element in the set of matched elements, or sets one or more
 *  CSS properties for every matched element.
 *
 *  @example
 *
 *  // get the value of a computed style property
 *  // for the first element in the set of matched elements
 *  $('selector').css('width');
 *
 *  // set a single CSS property
 *  $('selector').css('position', 'absolute');
 *
 *  // set multiple CSS properties
 *  $('selector').css({
 *      position: 'absolute',
 *      left: 0,
 *      top: 0
 *  });
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  $('selector').css('position', 'absolute').removeClass('some-class');
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
 *                                      <br><br>
 *                                      When reading CSS properties, this method acts as a wrapper for
 *                                      {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}
 *
 *  @return {$|mixed}   When `setting` CSS properties, this method returns the set of matched elements, for chaining.
 *                      When `reading` CSS properties, this method returns the value(s) of the required computed style(s).
 */
this.css = function(property, value) {

    var i, j, computedStyle;

    // if "property" is an object and "value" is not set
    if (typeof property === 'object')

        // iterate through the set of matched elements
        for (i in elements)

            // iterate through the "properties" object
            for (j in property)

                // set each style property
                elements[i].style[j] = property[j];

    // if "property" is not an object, and "value" argument is set
    else if (value)

        // iterate through the set of matched elements
        for (i in elements)

            // set the respective style property
            elements[i].style[property] = value;

    // if "property" is not an object and "value" is not set
    // return the value of the given CSS property, or "undefined" if property is not available
    else {

        // get the first element's computed styles
        computedStyle = window.getComputedStyle(elements[0]);

        // return the sought property's value
        return computedStyle[property];

    }

    // if we get this far, return the matched elements, for chaining
    return $this;

}
