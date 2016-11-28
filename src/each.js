/**
 *  Iterates over the set of matched elements, executing a callback function for each element in the set.
 *
 *  @param  {function}  callback    The function to execute for each item in the set. The callback function receives two
 *                                  arguments: the element's position in the set, called `index` (0-based), and the DOM
 *                                  element. The `this` keyword inside the callback function refers to the DOM element.
 *                                  <br><br>
 *                                  *Returning `FALSE` from the callback function breaks the loop!*
 *
 *  @example
 *
 *  $('selector').each(function(index) {
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
 *  @alias      each
 *  @instance
 */
$.fn.each = function(callback) {

    // iterate through the set of matched elements
    for (var i = 0; i < this.length; i++)

        //  apply the callback function
        if (callback.call(this[i], i, this[i]) === false) return;

}
