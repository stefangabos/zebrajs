/**
 *  Returns the current computed **inner** width (without `padding`, `border` and `margin`) of the first element
 *  in the set of matched elements as `float`, or sets the `width` CSS property of every element in the set.
 *
 *  > When retrieving the width, this method uses the {@link $#css .css} method (which use JavaScript's
 *  {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle window.getComputedStyle}), and uses
 *  JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style style} when setting the width
 *  of elements.
 *
 *  See {@link $#outerWidth .outerWidth()} for getting the width including `padding`, `border` and, optionally,
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
 *  // when setting the width, you can use chaining
 *  elements.width(200).addClass('some-class');
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
 *  @return {$|float}   When **setting** the `width`, this method returns the set of matched elements, for chaining.
 *                      Otherwise, it returns the current computed **inner** width (without `padding`, `border` and
 *                      `margin`) of the first element in the set of matched elements, as `float`.
 */
this.width = function(width) {

    // if "width" is given, set the width of every matched element, making sure to suffix the value with "px"
    // if not otherwise specified
    if (width) return this.css('width', width + (parseFloat(width) === width ? 'px' : ''));

    // if "width" is not given, return the width of the first element in the set
    // or 0 if that yields NaN
    return parseFloat(window.getComputedStyle(elements[0], null).width) || 0;

}
