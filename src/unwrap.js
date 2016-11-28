/**
 *  Removes the parents of the set of matched elements from the DOM, leaving the matched elements in their place.
 *
 *  This method is effectively the inverse of the {@link ZebraJS#wrap .wrap()} method. The matched elements (and their
 *  siblings, if any) replace their parents within the DOM structure.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // unwrap the element, whatever its parent may be
 *  element.unwrap();
 *
 *  // unwrap only if the element's parent is a div
 *  element.unwrap('div');
 *
 *  @param  {string}    selector    If the selector is supplied, the parent elements will be filtered and the unwrapping
 *                                  will occur only they match it.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      unwrap
 *  @instance
 */
$.fn.unwrap = function(selector) {

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // get the element's parent, optionally filtered by a selector,
        // and replace it with the element
        $(element).parent(selector).replaceWith(element);

    });

    // return the set of matched elements
    return this;

}
