/**
 *  Returns the position of an element among its siblings or within a set of elements.
 *
 *  - If no argument is passed, the method returns an integer indicating the position of the first element within
 *    the {@link ZebraJS} object relative to its sibling elements.
 *
 *  - If a selector is passed as an argument, the return value is an integer indicating the position of the first
 *    element within the {@link ZebraJS} object relative to the elements matched by the selector. If the element is
 *    not found, it returns `-1`.
 *
 *  - If a DOM element or {@link ZebraJS} object is passed, the method returns an integer indicating the position
 *    of that element relative to the elements in the original {@link ZebraJS} object.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('li');
 *
 *  // get the index of the first element among its siblings
 *  var index = elements.index();
 *
 *  // get the index of the first element within a selector
 *  var index = elements.index('.active');
 *
 *  // get the index of a specific element within the set
 *  var element = $('li.active');
 *  var index = elements.index(element);
 *
 *  @param  {mixed}     [selector]  Can be a selector, a DOM element, or a {@link ZebraJS} object.
 *
 *  @return {number}    Returns the index of the element, or `-1` if not found.
 *
 *  @memberof   ZebraJS
 *  @alias      index
 *  @instance
 */
$.fn.index = function(selector) {

    var element, elements, i;

    // if no argument is provided
    if (undefined === selector) {

        // if we have elements
        if (this.length > 0) {

            // get the first element
            element = this[0];

            // if the element has a parent
            if (element.parentNode) {

                // get all child elements of the parent
                elements = Array.prototype.slice.call(element.parentNode.children);

                // find and return the index
                return elements.indexOf(element);

            }

        }

        // if no parent or no elements, return -1
        return -1;

    }

    // if a selector string is provided
    if (typeof selector === 'string') {

        // if we have elements
        if (this.length > 0) {

            // get the first element
            element = this[0];

            // get all elements matching the selector
            elements = Array.prototype.slice.call(document.querySelectorAll(selector));

            // find and return the index
            return elements.indexOf(element);

        }

        // if no elements, return -1
        return -1;

    }

    // if a DOM element is provided
    if (selector instanceof Element) {

        // find the index of this element in the current set
        for (i = 0; i < this.length; i++)
            if (this[i] === selector) return i;

        // not found
        return -1;

    }

    // if a ZebraJS object is provided
    if (typeof selector === 'object' && selector.version) {

        // if the object has elements
        if (selector.length > 0) {

            // find the index of the first element in the current set
            for (i = 0; i < this.length; i++)
                if (this[i] === selector[0]) return i;

        }

        // not found
        return -1;

    }

    // default return
    return -1;

}
