/**
 *  Gets the text content of the first element in the set of matched elements (combined with the text content of all its
 *  descendants), or sets the text contents of the matched elements.
 *
 *  > This method is a wrapper for JavaScript's {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent textContent}
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
 *  // since this method returns the set of matched elements,
 *  // we can use chaining
 *  elements.text('Hello').addClass('some-class');

 *  @param  {string}    [content]   The text to set as the content of all the matched elements. Note that any text
 *                                  content that was previously in that element is completely replaced by the new
 *                                  content.
 *
 *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched elements,
 *                                  for chaining. Otherwise it returns the text content of the first element in the set
 *                                  of matched elements (combined with the text content of all its descendants)
 */
this.text = function(content) {

    var i;

    // if content is provided
    if (content)

        // iterate through the set of matched elements
        for (i in elements)

            // set the text content of each element
            elements[i].textContent = content;

    // if content is not provided
    // return the text content of the first element in the set of matched elements
    // (combined with the text content of all its descendants)
    else return elements[0].textContent;

    // return the set of matched elements, for chaining
    return $this;

}
