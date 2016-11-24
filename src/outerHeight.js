/**
 *  Returns the current computed height for the first element in the set of matched elements, including `padding`,
 *  `border` and, optionally, `margin`.
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
elements.outerHeight = function(include_margins) {

    // get the values of all the CSS properties of the element
    // after applying the active stylesheets and resolving any
    // basic computation those values may contain
    var computed_style = window.getComputedStyle(elements[0]);

    // return the result of inner height together with
    return (parseFloat(computed_style.height) +

        // top and bottom paddings
        parseFloat(computed_style.paddingTop) + parseFloat(computed_style.paddingBottom) +

        // top and bottom borders
        parseFloat(computed_style.borderTopWidth) + parseFloat(computed_style.borderBottomWidth) +

        // include margins, if requested
        (include_margins ? parseFloat(computed_style.marginTop) + parseFloat(computed_style.marginBottom) : 0)) || 0;

}
