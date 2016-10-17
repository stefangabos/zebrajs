/**
 *  Removes one or more classes from each element in the set of matched elements.
 *
 *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.remove}
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // remove a single class
 *  elements.removeClass('some-class');
 *
 *  // remove multiple classes
 *  elements.removeClass('some-class some-other-class');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  elements.removeClass('some-class some-other-class').css('display', 'none');
 *
 *  @param  {string}    class_name  One or more space-separated class names to be removed from each element in
 *                                  the set of matched elements.
 *
 *  @todo               This method currently doesn't work on IE9
 *
 *  @return {$}         Returns the set of matched elements, for chaining.
 */
this.removeClass = function(class_name) {

    var i, j;

    // split by space and create an array
    class_name = class_name.split(' ');

    // iterate through the matched elements
    for (i in collection)

        // iterate through the class names to remove
        for (j in class_name)

            // remove class
            collection[i].classList.remove(class_name[j]);

    // return the set of matched elements, for chaining
    return $this;

}
