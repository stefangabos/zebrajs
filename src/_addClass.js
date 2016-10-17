/**
 *  Adds one or more classes to each element in the set of matched elements.
 *
 *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.add}
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // add a single class
 *  elements.addClass('some-class');
 *
 *  // add multiple classes
 *  elements.addClass('some-class some-other-class');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  elements.addClass('some-class some-other-class').css('display', 'none');

 *  @param  {string}    class_name  One or more space-separated class names to be added to each element in the
 *                                  set of matched elements.
 *
 *  @todo               This method currently doesn't work on IE9
 *
 *  @return {$}         Returns the set of matched elements, for chaining.
 */
this.addClass = function(class_name) {

    var i, j;

    // split by space and create an array
    class_name = class_name.split(' ');

    // iterate through the matched elements
    for (i in collection)

        // iterate through the class names to add
        for (j in class_name)

            // add class
            collection[i].classList.add(class_name[j]);

    // return the set of matched elements, for chaining
    return $this;

};

