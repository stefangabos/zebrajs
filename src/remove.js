/**
 *  Removes the set of matched elements from the DOM.
 *
 *  Use this method when you want to remove the element itself, as well as everything inside it. In addition to the elements
 *  themselves, all attached event handlers and data attributes associated with the elements are also removed.
 *
 *  To remove the elements without removing data and event handlers, use {@link $#detach() .detach()} instead.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // remove the element, its children, and all attached event 
 *  // handlers and data attributes associated with the elements
 *  element.remove();
 *
 *  @return {$}         Returns the set of matched elements.
 */
this.remove = function() {

    // iterate over the set of matched elements
    elements.forEach(function(element) {

        var

            // the element as a ZebraJS object
            $element = $(element),

            // the element's children
            children = Array.prototype.slice.call(element.querySelectorAll('*'));

        // iterate over the element's children
        children.forEach(function(child) {

            // the child's ZebraJS form
            var $child = $(child);

            // remove all event handlers
            $child.off();

            // nullify the child to free memory
            $child = null;

        });

        // remove all attached event handlers
        $element.off();

        // remove element from the DOM (including children)
        element.parentNode.removeChild(element);

        // nullify the object to free memory
        $element = null;

    });

    // return the set of matched elements
    return $this;

}
