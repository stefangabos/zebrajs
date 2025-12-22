/**
 *  Returns the height (including `padding`, `border` and, optionally, `margin`) for the first element in the set of
 *  matched elements.
 *
 *  > For hidden elements the returned value is `0`!
 *
 *  See {@link ZebraJS#height .height()} for getting the **inner** height without `padding`, `border` and `margin`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('selector');
 *
 *  // get the element's outer height
 *  var height = element.outerHeight();
 *
 *  @param  {boolean}   [include_margins]   If set to `TRUE`, the result will also include **top** and **bottom**
 *                                          margins.
 *
 *  @return {float}
 *
 *  @memberof   ZebraJS
 *  @alias      outerHeight
 *  @instance
 */
$.fn.outerHeight = function(include_margins) {

    // get computed styles only if we need margins
    var computed_styles = include_margins ? window.getComputedStyle(this[0]) : null;

    // return outer height (content + padding + border)
    return this[0].offsetHeight +

        // include margins, if requested
        (include_margins ? parseFloat(computed_styles.marginTop) + parseFloat(computed_styles.marginBottom) : 0);

}
