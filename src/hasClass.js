/**
 *  Checks whether *any* of the matched elements have the given class.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
 *
 *  // check if matched elements have a certain class
 *  const class_exists = elements.hasClass('foo');
 *
 *  // chaining
 *  elements.toggleClass('foo');
 *
 *  @param  {string}    class_name  The name of a class to be checked if it exists on *any* of the elements in the set
 *                                  of matched elements.
 *
 *  @return {boolean}   Returns TRUE if the sought class exists in *any* of the elements in the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      hasClass
 *  @instance
 */
$.fn.hasClass = function(class_name) {

    // return TRUE if any element has the class
    return this.some(element => element.classList.contains(class_name));

}
