/**
 *  Determines whether the object given as argument is an array.
 *
 *  > **This method is here only for compatibility purposes and you shouldn't use it - you should use instead JavaScript's
 *  own {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray Array.isArray}**
 *
 *  @example
 *
 *  // returns TRUE
 *  $.isArray([1, 2, 3, 4, 5, 6, 7]);
 *
 *  @param  {mixed}     object  Object to test whether or not it is an array.
 *
 *  @return {bool}              A boolean indicating whether the object is a JavaScript array (not an array-like object
 *                              such as a ZebraJS object).
 *
 *  @memberof   ZebraJS
 *  @alias      $&period;isArray
 *  @instance
 */
$.isArray = function(object) {

    // returns a boolean indicating whether the object is a JavaScript array
    return Array.isArray(object);

}
