/**
 *  Returns the current computed **inner** width (without `padding`, `border` and `margin`) of the first element
 *  in the set of matched elements as `float`, or sets the `width` CSS property of every element in the set.
 *
 *  See {@link $.$#outerWidth .outerWidth()} for getting the width including `padding`, `border` and, optionally,
 *  `margin`.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // returns the current computed inner width of the first element in the set of matched elements
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
 *  @param  {undefined|number|string}   [width]     If not given, this method will return the computed **inner**
 *                                                  width (without `padding`, `border` and `margin`) of the first
 *                                                  element in the set of matched elements.
 *                                                  <br><br>
 *                                                  If given, this method will set the `width` CSS property of all
 *                                                  the elements in the set to that particular value, making sure
 *                                                  to apply the "px" suffix if not otherwise specified.
 *
 *  > For hidden elements the returned value is `0`!
 *
 *  @return {$|float}   When **setting** the `width`, this method returns the set of matched elements. Otherwise, it
 *                      returns the current computed **inner** width (without `padding`, `border` and `margin`) of the
 *                      first element in the set of matched elements, as `float`.
 */
this.width = function(width) {

    // if "width" is given, set the width of every matched element, making sure to suffix the value with "px"
    // if not otherwise specified
    if (width) return this.css('width', width + (parseFloat(width) === width ? 'px' : ''));

    // for the "window"
    if (this.get()[0] === window) return window.innerWith;

    // for the "document"
    if (this.get()[0] === document)

        // return width
        return Math.max(
            document.body.offsetWidth,
            document.body.scrollWidth,
            document.documentElement.clientWidth,
            document.documentElement.offsetWidth,
            document.documentElement.scrollWidth
        );

    // get the first element's width, left/right padding and borders
    var styles = window.getComputedStyle(elements[0]),
        offset_width = elements[0].offsetWidth,
        border_left_width = parseFloat(styles.borderLeftWidth),
        border_right_width = parseFloat(styles.borderRightWidth),
        padding_left = parseFloat(styles.paddingLeft),
        padding_right = parseFloat(styles.paddingRight);

    // return width
    return offset_width - border_left_width - border_right_width - padding_left - padding_right;

}
