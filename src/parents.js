/**
 *  Gets the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
 *
 *  Given a ZebraJS object that represents a set of DOM elements, this method allows us to search through the ancestors
 *  of these elements in the DOM tree and construct a new ZebraJS object from the matching elements ordered from immediate
 *  parent on up; the elements are returned in order from the closest parent to the outer ones. When multiple DOM elements
 *  are in the original set, the resulting set will have duplicates removed.
 *
 *  This method is similar to {@link $.$#parent .parent()}, except .parent() only travels a single level up the DOM tree,
 *  while this method travels all the way up to the DOM root.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get *all* the element's parent
 *  var parents = element.parents();
 *
 *  // get all the element's parent until the first div (including also that first div)
 *  var parents = element.parents('div');
 *
 *  // chaining
 *  element.parents('div').addClass('foo');
 *
 *  @param  {string}    selector    If the selector is supplied, the parents will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {$}         Returns an array of parents of each element in the current set of matched elements, optionally
 *                      filtered by a selector, as a ZebraJS object.
 */
this.parents = function(selector) {

    var result = [];

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // unless we got to the root of the DOM, get the element's parent
        while (!((element = element.parentNode) instanceof Document)) {

            // if not already in the array, add parent to the results array
            if (result.indexOf(element) === -1) result.push(element)

            // if selector was specified and element matches it, don't look any further
            if (selector && element.matches(selector)) break;

        }

    });

    // return the matched elements, as a ZebraJS object
    return $(result);

}
