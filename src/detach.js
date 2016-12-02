/**
 *  Removes the set of matched elements from the DOM.
 *
 *  This method is the same as the {@link ZebraJS#remove .remove()} method, except that .detach() keeps all events and
 *  data associated with the removed elements. This method is useful when removed elements are to be reinserted into the
 *  DOM at a later time.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // remove elements from the DOM
 *  var detached = element.detach();
 *
 *  // add them back, together with data and events,
 *  // to the end of the body element
 *  $('body').insert(detached);
 *
 *  @return {ZebraJS}   Returns the removed elements.
 *
 *  @memberof   ZebraJS
 *  @alias      detach
 *  @instance
*/
$.fn.detach = function() {

    var result = [];

    // iterate over the set of matched elements
    this.forEach(function(element) {

        // the ZebraJS object
        var $element = $(element);

        // clone the element (deep with data and events and add it to the results array)
        result = result.concat($element.clone(true, true));

        // remove the original element from the DOM
        $element.remove();

    });

    // return the removed elements
    return $(result);

}
