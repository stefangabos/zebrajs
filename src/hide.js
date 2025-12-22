/**
 *  Hides an element from the DOM by settings its "display" property to `none`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('selector');
 *
 *  // hide the element from the DOM
 *  element.hide();
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      hide
 *  @instance
 */
$.fn.hide = function() {

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // set the "display" property
        element.style.display = 'none';

    });

    // return the set of matched elements
    return this;

}
