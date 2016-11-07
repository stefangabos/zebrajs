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
 *  elements.addClass('classname');
 *
 *  // toggle classes
 *  // the result will be that "classname" will be removed from the matched elements while the "otherclassname" will be added
 *  elements.toggleClass('classname otherclassname');
 *
 *  // chaining
 *  elements.toggleClass('classname').css('display', 'none');
 *
 *  @param  {string}    class_name  One or more space-separated class names to be toggled for each element in the set of
 *                                  matched elements.
 *
 *  @todo               This method currently doesn't work on IE9
 *
 *  @return {$}         Returns the set of matched elements.
 */
this.toggleClass = function(class_name) {

    // toggle class(es) and return the set of matched elements
    return this._class('toggle', class_name);

}
