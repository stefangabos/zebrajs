/**
 *  Returns the current computed **inner** height (without `padding`, `border` and `margin`) of the first element
 *  in the set of matched elements as `float`, or sets the `height` CSS property of every element in the set.
 *
 *  See {@link $.$#outerHeight .outerHeight()} for getting the height including `padding`, `border` and, optionally,
 *  `margin`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // returns the current computed inner height of the first element in the set of matched elements
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
 *  @param  {undefined|number|string}   [height]    If not given, the method will return the computed **inner**
 *                                                  height (without `padding`, `border` and `margin`) for the first
 *                                                  element in the set of matched elements.
 *                                                  <br><br>
 *                                                  If given, the method will set the `height` CSS property of all
 *                                                  the elements in the set to that particular value, making sure
 *                                                  to apply the "px" suffix if not otherwise specified.
 *
 *  > For hidden elements the returned value is `0`!
 *
 *  @return {$|float}   When **setting** the `height`, this method returns the set of matched elements.
 *                      Otherwise, it returns the current computed **inner** height (without `padding`, `border` and
 *                      `margin`) of the first element in the set of matched elements, as `float`.
 */
this.height = function(height) {

    // if "height" is given, set the height of every matched element, making sure to suffix the value with "px"
    // if not otherwise specified
    if (height) return this.css('height', height + (parseFloat(height) === height ? 'px' : ''));

    // for the "window"
    if (this.get()[0] === window) return window.innerHeight;

    // for the "document"
    if (this.get()[0] === document)

        // return height
        return Math.max(
            document.body.offsetHeight,
            document.body.scrollHeight,
            document.documentElement.clientHeight,
            document.documentElement.offsetHeight,
            document.documentElement.scrollHeight
        );

    // get the first element's height, top/bottom padding and borders
    var styles = window.getComputedStyle(elements[0]),
        offset_height = elements[0].offsetHeight,
        border_top_width = parseFloat(styles.borderTopWidth),
        border_bottom_width = parseFloat(styles.borderBottomWidth),
        padding_top = parseFloat(styles.paddingTop),
        padding_bottom = parseFloat(styles.paddingBottom);

    // return height
    return offset_height - border_bottom_width - border_top_width - padding_top - padding_bottom;

}
