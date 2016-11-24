/**
 *  Gets the immediately preceding sibling of each element in the set of matched elements. If a selector is provided,
 *  it retrieves the previous sibling only if it matches that selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get the previous sibgling
 *  var prev = element.prev();
 *
 *  // get the previous sibling only if it matches the selector
 *  var prev = element.prev('div');
 *
 *  // since this method returns a ZebraJS object
 *  element.prev().addClass('foo');
 *
 *  @param  {string}    selector    If the selector is provided, the method will retrieve the previous sibling only if
 *                                  it matches the selector
 *
 *  @return {ZebraJS}   Returns the immediately preceding sibling of each element in the set of matched elements,
 *                      optionally filtered by a selector, as a ZebraJS object.
 *
 *  @memberof   ZebraJS
 *  @alias      prev
 *  @instance
 */
elements.prev = function(selector) {

    // get the immediately preceding sibling of each element in the set of matched elements,
    // optionally filtered by a selector
    return elements._dom_search('previous', selector);

}
