/**
 *  Removes one or more classes from each element in the set of matched elements.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // remove a single class
 *  elements.removeClass('classname');
 *
 *  // remove multiple classes
 *  elements.removeClass('classname otherclassname');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  elements.removeClass('classname otherclassname').css('display', 'none');
 *
 *  @param  {string}    class_name  One or more space-separated class names to be removed from each element in
 *                                  the set of matched elements.
 *
 *  @todo               This method currently doesn't work on IE9
 *
 *  @return {$}         Returns the set of matched elements, for chaining.
 */
this.removeClass = function(class_name) {

    // remove class(es) and return the set of matched elements, for chaining
    return this._manage_classes(class_name, 'remove');

}
