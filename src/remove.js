/**
 *  Removes the set of matched elements from the DOM.
 *
 *  Use this method when you want to remove the element itself, as well as everything inside it. In addition to the elements
 *  themselves, all attached event handlers and data attributes associated with the elements are also removed.
 *
 *  To remove the elements without removing data and event handlers, use {@link ZebraJS#detach() .detach()} instead.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // remove the element, its children, and all attached event
 *  // handlers and data attributes associated with the elements
 *  element.remove();
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      remove
 *  @instance
*/
$.fn.remove = function() {

    // iterate over the set of matched elements
    this.forEach(element => {

        // the element as a ZebraJS object
        const $element = $(element);

        // the element's children
        const children = Array.from(element.querySelectorAll('*'));

        // iterate over the element's children
        children.forEach(child => {

            // the child's ZebraJS form
            let $child = $(child);

            // remove all event handlers
            $child.off();

            // nullify the child to free memory
            $child = null;

        });

        // remove all attached event handlers
        $element.off();

        // remove element from the DOM (including children)
        if (element.parentNode) element.parentNode.removeChild(element);

    });

    // return the set of matched elements
    return this;

}
