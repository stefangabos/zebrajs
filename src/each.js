/**
 *  Iterates over the set of matched elements, executing a callback function for each element in the set.
 *
 *  @param  {function}  callback    The function to execute for each item in the set. The callback function
 *                                  receives as single argument the element's position in the set, called `index`
 *                                  (0-based). The `this` keyword inside the callback function refers to the
 *                                  wrapped element (in a "$" object) the callback function is currently applied
 *                                  to.
 *                                  <br><br>
 *                                  *Use {@link $#_dom _dom()} to refer to the DOM node instead.*
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
 *      // remember, the "this" keyword refers
 *      // to the wrapped element (in a "$" object)
 *      this.css('display', 'none');
 *
 *      // the original DOM node
 *      console.log(this._dom());
 *
 *  });
 */
this.each = function(callback) {

    // iterate through the set of matched elements
    for (var i = 0; i < elements.length; i++)

        //  apply the callback function (the index is the argument to the function, while the "this" keyword
        //  inside the callback function refers to wrapped element (in a "$" object)
        //  returning false from the callback function exists the loop
        if (callback.call(new $(elements[i]), i) === false) return;

}
