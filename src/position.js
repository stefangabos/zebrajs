/**
 *  Gets the current coordinates of the first element in the set of matched elements, relative to the offset parent.
 *
 *  This method retrieves the current position of an element relative to the offset parent, in contrast with the
 *  {@link $.$#offset .offset()} method which retrieves the current position relative to the document.
 *
 *  > This method cannot get the position of hidden elements or accounting for borders, margins, or padding set on the
 *  body element.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get the element's position, relative to the offset parent
 *  var position = element.position()
 *
 *  @return {object}    Returns an object with the `left` and `top` properties.
 */
this.position = function() {

    // return the position of the first element in the set of matched elements
    return {
        left: parseFloat(elements[0].offsetLeft),
        top: parseFloat(elements[0].offsetTop)
    }

}
