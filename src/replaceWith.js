/**
 *  Replaces each element in the set of matched elements with the provided new content and returns the set of elements
 *  that was removed.
 *
 *  > Note that if the method's argument is a selector, then clones of the element described by the selector will be
 *  created and used for replacing each element in the set of matched elements, except for the last one. The original item
 *  will be moved (not cloned) and used to replace the last target.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // wrap element in a div
 *  element.replaceWith('<div id="replacement"></div>');
 *
 *  // *exactly* the same thing as above
 *  element.replaceWith($('<div id="replacement"></div>'));
 *
 *  // using an existing element as the wrapper
 *  element.replaceWith($('#element-from-the-page'));
 *
 *  @param  {mixed} element     A string, a ZebraJS object or a DOM element to use as replacement for each element in the
 *                              set of matched elements.
 *
 *  @return {$}     Returns the set of matched elements.
 */
this.replaceWith = function(element) {

    // call the "_dom_insert" private method with these arguments
    return this._dom_insert(element, 'replace');

}
