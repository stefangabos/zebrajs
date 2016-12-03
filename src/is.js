/**
 *  Checks the current matched set of elements against a selector, element, or ZebraJS object and returns `true` if at
 *  least one of these elements matches the given arguments.
 *
 *  > Note that, unlike jQuery, when matching selectors, this method matches only valid CSS selectors!
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // returns true if the element is a "select" element
 *  console.log(element.is('select'))
 *
 *  @param  {mixed}     selector    A string containing a selector expression to match elements against, a DOM element
 *                                  or a ZebraJS object.
 *
 *  @return {boolean}   Returns `true` if at least one of the elements from the currently matched set matches the given
 *                      argument.
 *
 *  @memberof   ZebraJS
 *  @alias      is
 *  @instance
 */
$.fn.is = function(selector) {

    var result = false;

    // iterate over the set of matched elements
    this.forEach(function(element) {

        // if
        if (

            // selector is a CSS selector and the current element matches the selector OR
            (typeof selector === 'string' && element.matches(selector)) ||

            // selector is a ZebraJS object and the current element matches the first element in the set of matched elements OR
            (typeof selector === 'object' && selector.version && element === selector[0]) ||

            // selector is a DOM element and current element matches it
            (typeof selector === 'object' && (selector instanceof Document || selector instanceof Element || selector instanceof Text || selector instanceof Window) && element === selector)

        ) {

            // set result to TRUE
            result = true;

            // don't look further
            return false;

        }

    });

    // return result
    return result;

}
