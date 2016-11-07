/**
 *  Returns the current computed **inner** width (without `padding`, `border` and `margin`) of the first element
 *  in the set of matched elements as `float`, or sets the `width` CSS property of every element in the set.
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
 *  // chaining
 *  elements.width(200).addClass('classname');
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

    // if "width" is not given, return the width of the first element in the set
    // or 0 if that yields NaN
    return parseFloat(window.getComputedStyle(elements[0], null).width) || 0;

}
