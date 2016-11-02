/**
 *  Gets the siblings of each element in the set of matched elements, optionally filtered by a selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get all the siblings of the element
 *  var siblings_all = element.siblings();
 *
 *  // get all the "div" siblings of the element
 *  var siblings_filtered = element.siblings('div');
 *
 *  // since this method returns a ZebraJS object, we can use chaining
 *  element.siblings('div').addClass('someclass');
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {$}         Returns the siblings of each element in the set of matched elements, as a ZebraJS object, so you
 *                      can use chaining.
 */
this.siblings = function(selector) {

    // get the siblings of each element in the set of matched elements, optionally filtered by a selector.
    return this._dom_search('siblings', selector);

}
