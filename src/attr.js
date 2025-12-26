/**
 *  Gets the value of an attribute for the first element in the set of matched elements, or sets one or more attributes
 *  for every matched element.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
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
 *  // chaining
 *  elements.attr('title', 'title').removeClass('foo');
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
 *  @return {ZebraJS|mixed}             When `setting` attributes, this method returns the set of matched elements.
 *                                      When `reading` attributes, this method returns the value of the required attribute.
 *
 *  @memberof   ZebraJS
 *  @alias      attr
 *  @instance
 */
$.fn.attr = function(attribute, value) {

    // if attribute argument is an object
    if (typeof attribute === 'object')

        // iterate over the set of matched elements
        this.forEach(element => {

            // iterate over the attributes
            for (const i in attribute)

                // set each attribute
                element.setAttribute(i, attribute[i]);

        });

    // if attribute argument is a string
    else if (typeof attribute === 'string')

        // if the value argument is provided
        if (undefined !== value)

            // iterate over the set of matched elements
            this.forEach(element => {

                // if value argument's value is FALSE or NULL
                if (value === false || value === null)

                    // remove the attribute
                    element.removeAttribute(attribute);

                // for other values, set the attribute's property
                else element.setAttribute(attribute, value);

            });

        // if the value argument is not provided
        else

            // return the value of the requested attribute
            // of the first element in the set of matched elements
            // (return "undefined" in case of an empty selection)
            return this[0] ? this[0].getAttribute(attribute) : undefined;

    // if we get this far, return the set of matched elements
    return this;

}
