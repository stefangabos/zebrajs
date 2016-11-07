/**
 *  Gets the immediately following sibling of each element in the set of matched elements. If a selector is provided,
 *  it retrieves the following sibling only if it matches that selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get the next sibling
 *  var next = element.next();
 *
 *  // get the following sibling only if it matches the selector
 *  var next = element.next('div');
 *
 *  // chaining
 *  element.next().addClass('someclass');
 *
 *  @param  {string}    selector    If the selector is provided, the method will retrieve the following sibling only if
 *                                  it matches the selector
 *
 *  @return {$}         Returns the immediately following sibling of each element in the set of matched elements,
 *                      optionally filtered by a selector, as a ZebraJS object.
 */
this.next = function(selector) {

    // get the immediately preceding sibling of each element in the set of matched elements,
    // optionally filtered by a selector
    return this._dom_search('next', selector);

}
