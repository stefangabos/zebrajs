/**
 *  @todo   Needs to be written!
 */
this.append = function(element) {

    var i, j;

    // if element to append is an $ object, we'll use the array of DOM elements
    if (element instanceof $) element = element.get();

    // if element to append is a DOM node, wrap it in an array
    else if (element instanceof Element) element = [element];

    // if element to append is not a string, don't go further
    else if (typeof element !== 'string') return false;

    // iterate through the set of matched elements
    for (i in elements)

        // if element to append is actually a string
        if (typeof element === 'string')

            // add it like this
            elements[i].insertAdjacentHTML('beforeend', element);

        // since element has to be an array of DOM elements
        // iterate over the array of DOM elements
        else for (j in element)

            // append each node to the parent
            elements[i].appendChild(element[j]);

}
