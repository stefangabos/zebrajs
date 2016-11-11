/**
 *  Gets the children of each element in the set of matched elements, optionally filtered by a selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get all the element's children
 *  var children_all = element.children();
 *
 *  // get all the "div" children of the element
 *  var children_filtered = element.children('div');
 *
 *  // chaining
 *  element.children('div').addClass('foo');
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {$}         Returns the children of each element in the set of matched elements, as a ZebraJS object.
 */
this.children = function(selector) {

    // get the children of each element in the set of matched elements, optionally filtered by a selector
    return this._dom_search('children', selector);

}
