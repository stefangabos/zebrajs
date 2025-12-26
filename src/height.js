/**
 *  Returns the content height (without `padding`, `border` and `margin`) of the first element in the set of matched
 *  elements as `float`, or sets the `height` CSS property of every element in the set.
 *
 *  See {@link ZebraJS#outerHeight .outerHeight()} for getting the height including `padding`, `border` and, optionally,
 *  `margin`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
 *
 *  // returns the content height of the first element in the set of matched elements
 *  elements.height();
 *
 *  // sets the "height" CSS property of all elements in the set to 200px
 *  elements.height(200);
 *  elements.height('200');
 *  elements.height('200px');
 *
 *  // sets the "height" CSS property of all elements in the set to 5em
 *  elements.height('5em');
 *
 *  // chaining
 *  elements.height(200).addClass('foo');
 *
 *  @param  {undefined|number|string}   [height]    If not given, this method will return content height (without `padding`,
 *                                                  `border` and `margin`) of the first element in the set of matched
 *                                                  elements.
 *                                                  <br><br>
 *                                                  If given, this method will set the `height` CSS property of all
 *                                                  the elements in the set to that particular value, making sure
 *                                                  to apply the "px" suffix if not otherwise specified.
 *
 *  > For hidden elements the returned value is `0`!
 *
 *  @return {ZebraJS|float}     When **setting** the `height`, this method returns the set of matched elements. Otherwise,
 *                              it returns the content height (without `padding`, `border` and `margin`) of the first
 *                              element in the set of matched elements, as `float`.
 *
 *  @memberof   ZebraJS
 *  @alias      height
 *  @instance
 */
$.fn.height = function(height) {

    // if "height" is given, set the height of every matched element, making sure to suffix the value with "px"
    // if not otherwise specified
    if (height !== undefined) return this.css('height', height + (parseFloat(height) === height ? 'px' : ''));

    // for the "window"
    if (this[0] === window) return window.innerHeight;

    // for the "document"
    if (this[0] === document)

        // return height
        return Math.max(
            document.body.offsetHeight,
            document.body.scrollHeight,
            document.documentElement.clientHeight,
            document.documentElement.offsetHeight,
            document.documentElement.scrollHeight
        );

    // get the first element's height, top/bottom padding and borders
    const styles = window.getComputedStyle(this[0]);
    const offset_height = this[0].offsetHeight;
    const border_top_width = parseFloat(styles.borderTopWidth);
    const border_bottom_width = parseFloat(styles.borderBottomWidth);
    const padding_top = parseFloat(styles.paddingTop);
    const padding_bottom = parseFloat(styles.paddingBottom);

    // return height
    return offset_height - border_bottom_width - border_top_width - padding_top - padding_bottom;

}
