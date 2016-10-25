/**
 *  Private helper method used by {@link $#append .append()}, {@link $#appendTo .appendTo()}, {@link $#after .after()},
 *  {@link $#insertAfter .insertAfter()}, {@link $#before .before()}, {@link $#insertBefore .insertBefore()},
 *  {@link $#prepend .prepend()} and {@link $#prependTo .prependTo()} methods.
 *
 *  @param  {mixed}     content     Depending on the caller method this is the DOM element, text node, HTML string, or
 *                                  ZebraJS object to insert in the DOM.
 *
 *  @param  {string}    where       Indicated where the content should be inserted, relative to the set of matched elements.
 *                                  <br><br>
 *                                  Posssible values are `after`, `append` and `before`.
 *
 *  @return {$}     Returns the set of matched elements (the parents, not the appended elements), for chaining.
 *
 *  @access private
 */
this._dom_insert = function(content, where) {

    var i, j;

    // if element to append is an $ object, we'll use the array of DOM elements
    if (content instanceof $) content = content.get();

    // if content to append is a DOM element or a text node, wrap it in an array
    else if (content instanceof Element || content instanceof Text) content = [content];

    // if content to append is not a string, don't go further
    else if (typeof content !== 'string') return false;

    // iterate through the set of matched elements
    for (i in elements)

        // if content to append is a string (plain text or HTML)
        if (typeof content === 'string')

            // where the content needs to be moved in the DOM
            switch (where) {

                // if content is to be inserted after an element
                case 'after': elements[i].insertAdjacentHTML('afterend', content); break;

                // if content is to be appended into an element
                case 'append': elements[i].insertAdjacentHTML('beforeend', content); break;

                // if content is to be inserted before an element
                case 'before': elements[i].insertAdjacentHTML('beforebegin', content); break;

                // if content is to be prepended into an element
                case 'prepend': elements[i].insertAdjacentHTML('afterbegin', content); break;

            }

        // since content is an array of DOM elements or text nodes
        // iterate over the array
        else for (j in content)

            // where the content needs to be moved in the DOM
            switch (where) {

                // insert a clone after each target except for the last one after which we insert the original content
                case 'after': elements[i].parentNode.insertBefore(i < elements.length - 1 ? content[j].cloneNode(true) : content[j], elements[i].nextSibling); break;

                // add a clone to each parent except for the last one where we add the original content
                case 'append': elements[i].appendChild(i < elements.length - 1 ? content[j].cloneNode(true) : content[j]); break;

                // insert a clone before each target except for the last one before which we insert the original content
                case 'before': elements[i].parentNode.insertBefore(i < elements.length - 1 ? content[j].cloneNode(true) : content[j], elements[i]); break;

                // prepend a clone to each parent except for the last one where we add the original content
                case 'prepend': elements[i].insertBefore(i < elements.length - 1 ? content[j].cloneNode(true) : content[j], elements[i].firstChild); break;

            }

    // return the set of matched elements, for chaining
    return $this;

}
