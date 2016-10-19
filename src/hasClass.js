/**
 *  Checks whether *any* of the matched elements have the given class.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // check if matched elements have a certain class
 *  var class_exists = elements.hasClass('classname');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  elements.toggleClass('classname');
 *
 *  @param  {string}    class_name  The name of a class to be checked if it exists on *any* of the elements in the set
 *                                  of matched elements.
 *
 *  @todo               This method currently doesn't work on IE9
 *
 *  @return {boolean}   Returns TRUE if the sought class exists in *any* of the elements in the set of matched elements.
 */
this.hasClass = function(class_name) {

    // iterate through the set of matched elements
    for (var i in elements)

        // if sought class exists, return TRUE
        if (elements[i].classList.contains(class_name)) return true;

    // return FALSE if we get this far
    return false;

}
