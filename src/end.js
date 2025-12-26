/**
 *  Ends the most recent filtering operation in the current chain and returns the set of matched elements to its previous state.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // find spans, add a class to them, then go back to the original selection
 *  element.find('span')
 *      .addClass('highlight')
 *      .end()
 *      .addClass('container');
 *
 *  // this is useful for traversing and then returning to the previous set
 *  $('div')
 *      .children('.child')
 *      .addClass('selected')
 *      .end()
 *      .addClass('parent');
 *
 *  @return {ZebraJS}   Returns the previous set of matched elements, or an empty set if there is no previous set.
 *
 *  @memberof   ZebraJS
 *  @alias      end
 *  @instance
 */
$.fn.end = function() {

    // return the previous object if it exists, otherwise return an empty ZebraJS object
    return this.prevObject || $([]);

}
