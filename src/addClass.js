/**
 *  Adds one or more classes to each element in the set of matched elements.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // add a single class
 *  elements.addClass('foo');
 *
 *  // add multiple classes
 *  elements.addClass('foo baz');
 *
 *  // chaining
 *  elements.addClass('foo baz').css('display', 'none');
 *
 *  @param  {string}    class_name  One or more space-separated class names to be added to each element in the
 *                                  set of matched elements.
 *
 *  @return {$}         Returns the set of matched elements.
 */
this.addClass = function(class_name) {

    // add class(es) and return the set of matched elements
    return this._class('add', class_name);

}
