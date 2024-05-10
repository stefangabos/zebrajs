/**
 *  Sets an element's "display" property to `` (an empty string).
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('selector');
 *
 *  // make element visible in the DOM
 *  element.show();
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      show
 *  @instance
 */
$.fn.hide = function() {

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // set the display to "none"
        element.display = '';

    });

    // return the set of matched elements
    return this;

}
