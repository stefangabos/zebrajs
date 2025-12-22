/**
 *  Returns the current computed width for the first element in the set of matched elements, including `padding`,
 *  `border` and, optionally, `margin`.
 *
 *  > For hidden elements the returned value is `0`!
 *
 *  See {@link ZebraJS#width .width()} for getting the **inner** width without `padding`, `border` and `margin`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('selector');
 *
 *  // get the element's outer width
 *  var height = element.outerWidth();
 *
 *  @param  {boolean}   [include_margins]   If set to `TRUE`, the result will also include **left** and **right**
 *                                          margins.
 *
 *  @return {float}
 *
 *  @memberof   ZebraJS
 *  @alias      outerWidth
 *  @instance
 */
$.fn.outerWidth = function(include_margins) {

    // get computed styles only if we need to include margins
    var computed_styles = include_margins ? window.getComputedStyle(this[0]) : null;

    // return outer width (content + padding + border)
    return this[0].offsetWidth +

        // include margins, if requested
        (include_margins ? parseFloat(computed_styles.marginLeft) + parseFloat(computed_styles.marginRight) : 0);

}
