/**
 *  Gets the vertical position of the scrollbar for the first element in the set of matched elements, or sets the
 *  vertical position of the scrollbar for every matched element.
 *
 *  The vertical scroll position is the same as the number of pixels that are hidden from view above the scrollable area.
 *  If the scroll bar is at the very top, or if the element is not scrollable, this number will be `0`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var body = $('body');
 *
 *  // get the vertical scroll of the body
 *  body.scrollTop();
 *
 *  // set the vertical scroll of the body
 *  body.scrollTop(250);
 *
 *  // chaining
 *  elements.scrollTop(250).addClass('foo');
 *
 *  @param  {integer}   [value]     Sets the vertical position of the scrollbar for every matched element.
 *
 *  @return {ZebraJS|integer}       When `setting` the vertical position, this method returns the set of matched elements.
 *                                  When `reading` the vertical position, this method returns the vertical position of
 *                                  the scrollbar for the first element in the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      scrollTop
 *  @instance
 */
$.fn.scrollTop = function(value) {

    // if value is not specified, return the scrollTop value of the first element in the set of matched elements
    if (undefined === value) return this[0] instanceof Window || this[0] instanceof Document ? document.documentElement.scrollTop : this[0].scrollTop;

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // set the scrollTop value for each element
        // apply "parseFloat" in case is provided as string or suffixed with "px"
        element.scrollTop = parseFloat(value);

    });

    // return the matched elements
    return this;

}
