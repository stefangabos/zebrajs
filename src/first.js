/**
 *  Constructs a new {@link ZebraJS} object from the first element in the set of matched elements.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // returns the first element from the list of matched elements, as a ZebraJS object
 *  var first = elements.first();
 *
 *  @return {ZebraJS}   Returns the first element from the list of matched elements, as a ZebraJS object
 *
 *  @memberof   ZebraJS
 *  @alias      first
 *  @instance
 */
$.fn.first = function() {

    // returns the first element from the list of matched elements, as a ZebraJS object
    return $(this[0]);

}
