/**
 *  Gets the HTML content of the first element in the set of matched elements, or set the HTML content of every matched
 *  element.
 *
 *  > There are some {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#Security_considerations security considerations}
 *  that you should be aware of when using this method.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // set the HTML content for all the matched elements
 *  elements.html('<p>Hello</p>');
 *
 *  // get the HTML content of the first
 *  // element in the set of matched elements
 *  var content = elements.html();
 *
 *  // since this method returns the set of matched elements,
 *  // we can use chaining
 *  elements.html('<p>Hello</p>').addClass('classname');

 *  @param  {string}    [content]   The HTML content to set as the content of all the matched elements. Note that any
 *                                  content that was previously in that element is completely replaced by the new
 *                                  content.
 *
 *  @return {$|string}              When the `content` argument is provided, this method returns the set of matched elements,
 *                                  for chaining. Otherwise it returns the HTML content of the first element in the set
 *                                  of matched elements.
 */
this.html = function(content) {

    var i;

    // if content is provided
    if (content)

        // iterate through the set of matched elements
        for (i in elements)

            // set the HTML content of each element
            elements[i].innerHTML = content;

    // if content is not provided
    // return the content of the first element in the set of matched elements
    else return elements[0].innerHTML;

    // return the set of matched elements, for chaining
    return $this;

}
