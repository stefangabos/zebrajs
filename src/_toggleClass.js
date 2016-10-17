/**
 *  Adds or removes one or more classes from each element in the set of matched elements, depending on the presence of
 *  each class name given as argument.
 *
 *  > This method uses JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.contains},
 *  > {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.add} and
 *  > {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList classList.remove}.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // set a random class
 *  elements.addClass('some-class');
 *
 *  // toggle classes
 *  // the result will be that "some-class" will be removed from the matched elements while the "other-class" will be added
 *  elements.toggleClass('some-class other-class');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  elements.toggleClass('some-class').css('display', 'none');
 *
 *  @param  {string}    class_name  One or more space-separated class names to be toggled for each element in the set of
 *                                  matched elements.
 *
 *  @todo               This method currently doesn't work on IE9
 *
 *  @return {$}         Returns the set of matched elements, for chaining.
 */
this.toggleClass = function(class_name) {

    var i, j;

    // split by space and create an array
    class_name = class_name.split(' ');

    // iterate through the matched elements
    for (i in collection)

        // iterate through the class names to remove
        for (j in class_name)

            // if class is present, remove it
            if (collection[i].classList.contains(class_name[j])) collection[i].classList.remove(class_name[j]);

            // if class is not present, add it
            else collection[i].classList.add(class_name[j]);

    // return the set of matched elements, for chaining
    return $this;

}
