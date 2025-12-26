/**
 *  Gets the siblings of each element in the set of matched elements, optionally filtered by a selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // get all the siblings of the element
 *  const siblings_all = element.siblings();
 *
 *  // get all the "div" siblings of the element
 *  const siblings_filtered = element.siblings('div');
 *
 *  // since this method returns a ZebraJS object
 *  element.siblings('div').addClass('foo');
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {ZebraJS}   Returns the siblings of each element in the set of matched elements, as a ZebraJS object
 *
 *  @memberof   ZebraJS
 *  @alias      siblings
 *  @instance
 */
$.fn.siblings = function(selector) {

    // get the siblings of each element in the set of matched elements, optionally filtered by a selector.
    return this._add_prev_object(this._dom_search('siblings', selector));

}
