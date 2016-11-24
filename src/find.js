/**
 *  Gets the descendants of each element in the current set of matched elements, filtered by a selector, {@link ZebraJS}
 *  object, or a DOM element.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // find the element's div descendants
 *  var target = element.find('div');
 *
 *  // this is equivalent with the above
 *  var target = $('div', element);
 *
 *  // chaining
 *  element.find('div').addClass('foo');
 *
 *  @param  {string}    selector    A selector to filter descendant elements by. It can be a query selector, a
 *                                  {@link ZebraJS} object, or a DOM element.
 *
 *  @return {ZebraJS}   Returns the descendants of each element in the current set of matched elements, filtered by a
 *                      selector, {@link ZebraJS} object, or DOM element, as a {@link ZebraJS} object.
 *
 *  @memberof   ZebraJS
 *  @alias      find
 *  @instance
 */
elements.find = function(selector) {

    var result = [];

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // if selector is a ZebraJS object
        if (typeof selector === 'object' && selector.version)

            // iterate through the elements in the object
            selector.forEach(function(wrapped) {

                // if the elements are the same, add it to the results array
                if (wrapped.isSameNode(element)) result.push(element);

            });

        // selector is the Document object, a DOM node, the Window object
        else if (typeof selector === 'object' && (selector instanceof Document || selector instanceof Element || selector instanceof Window)) {

            // if the elements are the same, add it to the results array
            if (selector.isSameNode(element)) result.push(element);

        // selector is a string
        // get the descendants of the element that match the selector, and add them to the results array
        } else result.push(element.querySelector(selector));

    });

    // when it finds no elements, "querySelector" returns "null"
    // we'll filter those out now
    result = result.filter(function(entry) {
        return entry !== null;
    });

    // return the resulting array as a ZebraJS object
    return $(result);

}
