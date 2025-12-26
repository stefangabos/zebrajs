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
 *  const elements = $('selector');
 *
 *  // set the HTML content for all the matched elements
 *  elements.html('<p>Hello</p>');
 *
 *  // get the HTML content of the first
 *  // element in the set of matched elements
 *  const content = elements.html();
 *
 *  // chaining
 *  elements.html('<p>Hello</p>').addClass('foo');

 *  @param  {string}    [content]   The HTML content to set as the content of all the matched elements. Note that any
 *                                  content that was previously in that element is completely replaced by the new
 *                                  content.
 *
 *  @return {ZebraJS|string}        When the `content` argument is provided, this method returns the set of matched
 *                                  elements. Otherwise it returns the HTML content of the first element in the set of
 *                                  matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      html
 *  @instance
 */
$.fn.html = function(content) {

    // if content is provided
    if (undefined !== content)

        // iterate through the set of matched elements
        this.forEach(element => {

            // set the HTML content of each element
            element.innerHTML = content;

        });

    // if content is not provided
    // return the content of the first element in the set of matched elements
    else return this[0] ? this[0].innerHTML : undefined;

    // return the set of matched elements
    return this;

}
