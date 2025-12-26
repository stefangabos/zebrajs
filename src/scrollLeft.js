/**
 *  Gets the horizontal position of the scrollbar for the first element in the set of matched elements, or sets the
 *  horizontal position of the scrollbar for every matched element.
 *
 *  The horizontal scroll position is the same as the number of pixels that are hidden from view above the scrollable area.
 *  If the scroll bar is at the very left, or if the element is not scrollable, this number will be `0`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const body = $('body');
 *
 *  // get the horizontal scroll of the body
 *  body.scrollLeft();
 *
 *  // set the horizontal scroll of the body
 *  body.scrollLeft(250);
 *
 *  // chaining
 *  elements.scrollLeft(250).addClass('foo');
 *
 *  @param  {integer}   [value]     Sets the horizontal position of the scrollbar for every matched element.
 *
 *  @return {ZebraJS|integer}       When `setting` the horizontal position, this method returns the set of matched elements.
 *                                  When `reading` the horizontal position, this method returns the horizontal position of
 *                                  the scrollbar for the first element in the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      scrollLeft
 *  @instance
 */
$.fn.scrollLeft = function(value) {

    // if value is not specified, return the scrollLeft value of the first element in the set of matched elements
    if (undefined === value) return this[0] instanceof Window || this[0] instanceof Document ? document.documentElement.scrollLeft : this[0].scrollLeft;

    // iterate through the set of matched elements
    this.forEach(element => {

        // set the scrollLeft value for each element
        // apply "parseFloat" in case is provided as string or suffixed with "px"
        element.scrollLeft = parseFloat(value);

    });

    // return the matched elements
    return this;

}
