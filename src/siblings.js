/**
 *  @todo   Needs to be written!
 */
this.siblings = function() {

    var result = [];

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // get the element's parent's children nodes that are not the current element, and add them to the results array
        result = result.concat(Array.prototype.filter.call(element.parentNode.children, function(child) {

            // skip the current element
            return child !== element;

        }));

    });

    // return the result, as a ZebraJS object
    return $(result);

}
