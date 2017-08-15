/**
 *  Search for a given value within an array and returns the first index where the value is found, or `-1` if the value
 *  is not found.
 *
 *  This method returns `-1` when it doesn't find a match. If the searched value is in the first position in the array
 *  this method returns `0`, if in second `1`, and so on.
 *
 *  > Because in JavaScript `0 == false` (but `0 !== false`), to check for the presence of value within array, you need to
 *  check if it's not equal to (or greater than) `-1`.
 *  <br><br>
 *  > **This method is here only for compatibility purposes and you shouldn't use it - you should use instead JavaScript's
 *  own {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf indexOf}**
 *
 *  @example
 *
 *  // returns 4
 *  $.inArray(5, [1, 2, 3, 4, 5, 6, 7]);
 *
 *  @param  {mixed}     value   The value to search for
 *
 *  @param  {array}     array   The array to search in
 *
 *  @return {integer}   Returns the position of the searched value inside the given array (starting from `0`), or `-1`
 *                      if the value couldn't be found.
 *
 *  @memberof   ZebraJS
 *  @alias      $&period;inArray
 *  @instance
 */
$.inArray = function(value, array) {

    // return the index of "value" in the "array"
    return array.indexOf(value);

}
