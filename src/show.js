/**
 *  Sets an element's "display" property to `` (an empty string).
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('selector');
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
$.fn.show = function() {

    // iterate through the set of matched elements
    this.forEach(element => {

        // unset the "display" property
        element.style.display = '';

    });

    // return the set of matched elements
    return this;

}
