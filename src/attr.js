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
 *  // since this method returns the set of matched elements, we can use chaining
 *  elements.attr('title', 'title').removeClass('classname');
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
 *  @return {$|mixed}   When `setting` attributes, this method returns the set of matched elements, for chaining.
 *                      When `reading` attributes, this method returns the value of the required attribute.
 */
this.attr = function(attribute, value) {

    var i, j;

    // if attribute argument is an object
    if (typeof attribute === 'object')

        // iterate over the set of matched elements
        for (i in elements)

            // iterate over the attributes
            for (j in attribute)

                // set each attribute
                elements[i].setAttribute(j, attribute[j]);

    // if attribute argument is a string
    else if (typeof attribute === 'string')

        // if the value argument is provided
        if (undefined !== value)

            // iterate over the set of matched elements
            for (i in elements)

                // if value argument's value is FALSE or NULL
                if (value === false || value === null)

                    // remove the attribute
                    elements[i].removeAttribute(attribute);

                // for other values, set the attribute's property
                else elements[i].setAttribute(attribute, value);

        // if the value argument is not provided
        else

            // return the value of the requested attribute
            // of the first element in the set of matched elements
            return elements[0].getAttribute(attribute);

    // if we get this far, return the set of matched elements, for chaining
    return $this;

}
