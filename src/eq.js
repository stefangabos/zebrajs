/**
 *  Reduces the set of matched elements to the one at the specified index.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('.selector');
 *
 *  // assuming there are 6 elements in the set of matched elements
 *  // add the "foo" class to the 5th element
 *  elements.eq(4).addClass('foo');
 *
 *  @param  {integer}   index   An integer indicating the 0-based position of the element. If a negative integer is
 *                              given the counting will go backwards, starting from the last element in the set.
 *
 *  @return {ZebraJS}   Returns the element at the specified index, as a ZebraJS object.
 *
 *  @memberof   ZebraJS
 *  @alias      eq
 *  @instance
 */
$.fn.eq = function(index) {

    // return the element at the specified index
    return this._add_prev_object($(this.get(index)));

}
