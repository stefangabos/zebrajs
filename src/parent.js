/**
 *  Gets the immediate parent of each element in the current set of matched elements, optionally filtered by a selector.
 *
 *  This method is similar to {@link ZebraJS#parents .parents()}, except .parent() only travels a single level up the
 *  DOM tree.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // get the element's parent
 *  const parent = element.parent();
 *
 *  // get the element's parent *only* if it is a div
 *  const parent2 = element.parent('div');
 *
 *  // chaining
 *  element.parent().addClass('foo');
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {ZebraJS}   Returns the immediate parent of each element in the current set of matched elements, optionally
 *                      filtered by a selector, as a ZebraJS object.
 *
 *  @memberof   ZebraJS
 *  @alias      parent
 *  @instance
 */
$.fn.parent = function(selector) {

    const result = [];

    // iterate through the set of matched elements
    this.forEach(element => {

        // if not a detached element, no selector is provided or it is and the parent matches it, add element to the array
        if (element.parentNode && (!selector || _query(selector, element.parentNode, 'matches'))) result.push(element.parentNode);

    });

    // return the resulting array
    return this._add_prev_object($(result));

}
