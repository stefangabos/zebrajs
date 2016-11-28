/**
 *  Gets the current coordinates of the first element in the set of matched elements, relative to the document.
 *
 *  This method retrieves the current position of an element relative to the document, in contrast with the
 *  {@link ZebraJS#position .position()} method which retrieves the current position relative to the offset parent.
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
 *  var offset = element.offset()
 *
 *  @return {object}    Returns an object with the `left` and `top` properties.
 *
 *  @memberof   ZebraJS
 *  @alias      offset
 *  @instance
 */
$.fn.offset = function() {

    // get the bounding box of the first element in the set of matched elements
    var box = this[0].getBoundingClientRect();

    // return the object with the offset
    return {
        left: box.left + window.pageXOffset - document.documentElement.clientLeft,
        top: box.top + window.pageYOffset - document.documentElement.clientTop
    }

}
