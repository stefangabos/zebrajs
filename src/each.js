/**
 *  Iterates over the set of matched elements, executing a callback function for each element in the set.
 *
 *  @param  {function}  callback    The function to execute for each item in the set. The callback function
 *                                  receives as single argument the element's position in the set, called `index`
 *                                  (0-based). The `this` keyword inside the callback function refers to the DOM element.
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
 *      // so we'll have to use $() around it to transform it into a ZebraJS object
 *      // (as always, cache it if you need to use it more than once)
 *      $(this).css('display', 'none');
 *
 *  });
 *
 *  @return {undefined}
 */
this.each = function(callback) {

    // iterate through the set of matched elements
    for (var i = 0; i < elements.length; i++)

        //  apply the callback function (the index is the argument to the function, while the "this" keyword
        //  inside the callback function refers to wrapped element (in a "$" object)
        //  returning false from the callback function exists the loop
        if (callback.call(elements[i], i) === false) return;

}
