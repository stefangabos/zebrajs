/**
 *  Gets the text content of the first element in the set of matched elements (combined with the text content of all its
 *  descendants), or sets the text contents of the matched elements.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // set the text content for all the matched elements
 *  elements.text('Hello');
 *
 *  // get the text content of the first element in the
 *  // set of matched elements (including its descendants)
 *  var content = elements.text();
 *
 *  // chaining
 *  elements.text('Hello').addClass('classname');

 *  @param  {string}    [content]   The text to set as the content of all the matched elements. Note that any text
 *                                  content that was previously in that element is completely replaced by the new
 *                                  content.
 *
 *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched
 *                                  elements. Otherwise it returns the text content of the first element in the set of
 *                                  matched elements (combined with the text content of all its descendants)
 */
this.text = function(content) {

    // if content is provided
    if (content)

        // iterate through the set of matched elements
        elements.forEach(function(element) {

            // set the text content of each element
            element.textContent = content;

        });

    // if content is not provided
    // return the text content of the first element in the set of matched elements
    // (combined with the text content of all its descendants)
    else return elements[0].textContent;

    // return the set of matched elements
    return $this;

}
