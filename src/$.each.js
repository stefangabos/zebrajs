/**
 *  Iterates over an array or an object, executing a callback function for each item.
 *
 *  For iterating over a set of matched elements, see the {@link ZebraJS#each each()} method.
 *
 *  @param  {function}  callback    The function to execute for each item in the set. The callback function receives two
 *                                  arguments: the item's position in the set, called `index` (0-based), and the item.
 *                                     The `this` keyword inside the callback function refers to the item.
 *                                  <br><br>
 *                                  *Returning `FALSE` from the callback function breaks the loop!*
 *
 *  > **This method is here only for compatibility purposes and you shouldn't use it - you should use instead JavaScript's
 *  native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach forEach}**
 *
 *  @example
 *
 *  $.each([1, 2, 3, 4], function(index, value) {
 *      console.log(index + ': ' + value);
 *  });
 *
 *  const obj = {
 *      prop1:  'value1',
 *      prop2:  'value2'
 *  };
 *  $.each(obj, function(index, value) {
 *      console.log(index + ': ' + value);
 *  });
 *
 *  @return {undefined}
 *
 *  @memberof   ZebraJS
 *  @alias      $&period;each
 *  @instance
 */
$.each = function(array, callback) {

    let key;

    // if argument is an array
    if (Array.isArray(array) || (array.length !== undefined && typeof array !== 'string')) {

        // iterate through the element in the array
        for (key = 0; key < array.length; key++)

            //  apply the callback function
            if (callback.call(array[key], key, array[key]) === false) return;

    // if argument is an object
    } else

        // iterate over the object's properties
        for (key in array)

            //  apply the callback function
            if (callback.call(array[key], key, array[key]) === false) return;

};

