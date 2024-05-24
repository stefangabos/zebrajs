/**
 *  Wraps an HTML structure around each element in the set of matched elements.
 *
 *  > Note that if the method's argument is a selector then clones of the element described by the selector will be
 *  created and wrapped around each element in the set of matched elements except for the last one. The original item will
 *  be moved (not cloned) and wrapped around the last target.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // wrap element in a div
 *  element.wrap('<div id="container"></div>');
 *
 *  // *exactly* the same thing as above
 *  element.wrap($('<div id="container"></div>'));
 *
 *  // using an existing element as the wrapper
 *  element.wrap($('#element-from-the-page'));
 *
 *  @param  {mixed} element     A string, a {@link ZebraJS} object or a DOM element in which to wrap around each element
 *                              in the set of matched elements.
 *
 *  @return {ZebraJS}   Returns the original set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      wrap
 *  @instance
 */
$.fn.wrap = function(element) {

    // call the "_dom_insert" private method with these arguments
    this._dom_insert(element, 'wrap')

    // return the original element(s)
    return this;

}
