/**
 *  Iterates over an array, executing a callback function for each item in the array.
 *
 *  For iterating over a set of matched elements, see the {@link ZebraJS#each each()} method.
 *
 *  @param  {function}  callback    The function to execute for each item in the set. The callback function receives two
 *                                  arguments: the element's position in the set, called `index` (0-based), and the DOM
 *                                  element. The `this` keyword inside the callback function refers to the DOM element.
 *                                  <br><br>
 *                                  *Returning `FALSE` from the callback function breaks the loop!*
 *
 *  > **This method is here only for compatibility purposes and you shouldn't use it - you should use instead JavaScript's
 *  native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach forEach}**
 *
 *  @example
 *
 *  $.each([1, 2, 3, 4], function(index) {
 *
 *      // show the element's index in the set
 *      console.log(index);
 *
 *      // remember, inside the callback, the "this" keyword refers to the DOM element
 *      $(this).css('display', 'none');
 *
 *  });
 *
 *  @return {undefined}
 *
 *  @memberof   ZebraJS
 *  @alias      $&period;each
 *  @instance
 */
$.each = function(array, callback) {

    // iterate through the set of matched elements
    for (var i = 0; i < array.length; i++)

        //  apply the callback function
        if (callback.call(array[i], i, array[i]) === false) return;

}
