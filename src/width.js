/**
 *  Returns the content width (without `padding`, `border` and `margin`) of the first element in the set of matched
 *  elements as `float`, or sets the `width` CSS property of every element in the set.
 *
 *  See {@link ZebraJS#outerWidth .outerWidth()} for getting the width including `padding`, `border` and, optionally,
 *  `margin`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
 *
 *  // returns the content width of the first element in the set of matched elements
 *  elements.width();
 *
 *  // sets the "width" CSS property of all elements in the set to 200px
 *  elements.width(200);
 *  elements.width('200');
 *  elements.width('200px');
 *
 *  // sets the "width" CSS property of all elements in the set to 5em
 *  elements.width('5em');
 *
 *  // chaining
 *  elements.width(200).addClass('foo');
 *
 *  @param  {undefined|number|string}   [width]     If not given, this method will return content width (without `padding`,
 *                                                  `border` and `margin`) of the first element in the set of matched
 *                                                  elements.
 *                                                  <br><br>
 *                                                  If given, this method will set the `width` CSS property of all
 *                                                  the elements in the set to that particular value, making sure
 *                                                  to apply the "px" suffix if not otherwise specified.
 *
 *  > For hidden elements the returned value is `0`!
 *
 *  @return {ZebraJS|float}     When **setting** the `width`, this method returns the set of matched elements. Otherwise,
 *                              it returns the content width (without `padding`, `border` and `margin`) of the first
 *                              element in the set of matched elements, as `float`.
 *
 *  @memberof   ZebraJS
 *  @alias      width
 *  @instance
 */
$.fn.width = function(width) {

    // if "width" is given, set the width of every matched element, making sure to suffix the value with "px"
    // if not otherwise specified
    if (width !== undefined) return this.css('width', width + (parseFloat(width) === width ? 'px' : ''));

    // for the "window"
    if (this[0] === window) return window.innerWidth;

    // for the "document"
    if (this[0] === document)

        // return width
        return Math.max(
            document.body.offsetWidth,
            document.body.scrollWidth,
            document.documentElement.clientWidth,
            document.documentElement.offsetWidth,
            document.documentElement.scrollWidth
        );

    // get the first element's width, left/right padding and borders
    const styles = window.getComputedStyle(this[0]);
    const offset_width = this[0].offsetWidth;
    const border_left_width = parseFloat(styles.borderLeftWidth);
    const border_right_width = parseFloat(styles.borderRightWidth);
    const padding_left = parseFloat(styles.paddingLeft);
    const padding_right = parseFloat(styles.paddingRight);

    // return width
    return offset_width - border_left_width - border_right_width - padding_left - padding_right;

}
