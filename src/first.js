/**
 *  Constructs a new ZebraJS object from the first element in the set of matched elements.
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
 *  @return {$}         Returns the first element from the list of matched elements, as a ZebraJS object
 */
this.first = function() {

    // returns the first element from the list of matched elements, as a ZebraJS object
    return $(elements[0]);

}
