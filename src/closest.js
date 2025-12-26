/**
 *  For each element in the set, get the first element that matches the selector by traversing up through its ancestors
 *  in the DOM tree, beginning with the current element.
 *
 *  Given a {@link ZebraJS} object that represents a set of DOM elements, this method searches through the ancestors of
 *  these elements in the DOM tree, beginning with the current element, and constructs a new {@link ZebraJS} object from
 *  the matching elements.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // get the first parent that is a div
 *  const closest = element.closest('div');
 *
 *  // chaining
 *  element.closest('div').addClass('foo');
 *
 *  @param  {string}    selector    If the selector is supplied, the parents will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {ZebraJS}   Returns zero or one element for each element in the original set, as a {@link ZebraJS} object
 *
 *  @memberof   ZebraJS
 *  @alias      closest
 *  @instance
 */
$.fn.closest = function(selector) {

    let result = [];

    // since the checking starts with the element itself, if the element itself matches the selector return now
    if (this[0] && _query(selector, this[0], 'matches')) return this;

    // iterate through the set of matched elements
    this.forEach(element => {

        // unless we got to the root of the DOM, get the element's parent
        while (!((element = element.parentNode) instanceof Document))

            // if selector was specified and element matches it, don't look any further
            if (_query(selector, element, 'matches')) {

                // if not already in the array, add parent to the results array
                if (!result.includes(element)) result.push(element);

                // don't look any further
                break;

            }

    });

    // return the matched elements, as a ZebraJS object
    return this._add_prev_object($(result));

}
