/**
 *  Gets the siblings of each element in the set of matched elements, optionally filtered by a selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get all the siblings of the element
 *  var siblings_all = element.siblings();
 *
 *  // get all the "div" siblings of the element
 *  var siblings_filtered = element.siblings('div');
 *
 *  // since this method returns a ZebraJS object, we can use chaining
 *  element.siblings('div').addClass('someclass');
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {$}         Returns the siblings of each element in the set of matched elements, as a ZebraJS object, so you
 *                      can use chaining.
 */
this.siblings = function(selector) {

    var result = [];

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // get the element's parent's children nodes which, optionally, match a given selector
        // and add them to the results array
        result = result.concat(Array.prototype.filter.call(selector ? element.parentNode.querySelectorAll(selector) : element.parentNode.children, function(child) {

            // skip the current element
            return child !== element;

        }));

    });

    // return the result, as a ZebraJS object
    return $(result);

}
