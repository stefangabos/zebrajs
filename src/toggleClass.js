/**
 *  Adds or removes one or more classes from each element in the set of matched elements, depending on the presence of
 *  each class name given as argument.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // set a random class
 *  elements.addClass('foo');
 *
 *  // toggle classes
 *  // the result will be that "foo" will be removed from the matched elements while the "baz" will be added
 *  elements.toggleClass('foo baz');
 *
 *  // chaining
 *  elements.toggleClass('foo').css('display', 'none');
 *
 *  @param  {string}    class_names One or more space-separated class names to be toggled for each element in the set of
 *                                  matched elements.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      toggleClass
 *  @instance
 */
$.fn.toggleClass = function(class_names) {

    // toggle class(es) and return the set of matched elements
    return this._class('toggle', class_names);

}
