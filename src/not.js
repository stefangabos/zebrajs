/**
 *  Removes elements from the set of matched elements.
 *
 *  @example
 *
 *  // find all elements having class ".foo" but not ".bar"
 *  $('.foo').not('.bar');
 *
 *  @param  {mixed}     selector    Can be a **string** containing a selector expression, a **DOM** element, an **array
 *                                  of elements** to match against the set, or a **function** used as a test for each
 *                                  element in the set.
 *                                  <br><br>
 *                                  If argument is a function, it accepts two arguments: "index", which is the element's
 *                                  index in the set of matched elements, and "element", which is the DOM element.<br>
 *                                  Within the function, `this` refers to the current DOM element.
 *
 *  @memberof   ZebraJS
 *  @alias      not
 *  @instance
 */
$.fn.not = function(selector) {

    // iterate over the set of matched elements
    return this.filter(function(element, index) {

        // if selector is a function, use it to filter results
        if (typeof selector === 'function' && selector.call !== undefined) return selector.call(element, index);

        // if selector is an array of elements
        if (Array.isArray(selector))

            // filter results
            return !selector.filter(function(current_selector) {
                return $(element).is(current_selector);
            }).length;

        // otherwise use "is" to  filter results
        return !$(element).is(selector);

    });

}
