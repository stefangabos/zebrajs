/**
 *  Inserts content, specified by the argument, after each element in the set of matched elements.
 *
 *  Both this and the {@link $#insertAfter .insertAfter()} method perform the same task, the main difference being in the
 *  placement of the content and the target. With `.after()`, the selector expression preceding the method is the target
 *  after which the content is to be inserted. On the other hand, with `.insertAfter()`, the content precedes the method,
 *  and it is the one inserted after the target container.
 *
 *  > If there is more than one target element, clones of the inserted element will be created after each target except
 *  for the last one. The original item will be inserted after the last target.
 *
 *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created
 *  after each target except for the last one. The original item will be moved (not cloned) after the last target.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var target = $('#selector');
 *
 *  // insert a div that we create on the fly
 *  target.after($('<div>').text('hello'));
 *
 *  // same thing as above
 *  target.after($('<div>hello</div>'));
 *
 *  // use one or more elements that already exist on the page
 *  // if "target" is a single element than the list will be moved after the target element
 *  // if "parent" is a collection of elements, clones of the list element will be created after
 *  // each target, except for the last one; the original list will be moved after the last target
 *  target.after($('ul'));
 *
 *  // insert a string (which will be transformed in HTML)
 *  // this is more efficient memory wise
 *  target.append('<div>hello</div>');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  target.append($('div')).addClass('classname');
 *
 *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to be inserted after each
 *                                  element in the set of matched elements.
 *
 *  @return {$}         Returns the set of matched elements (the parents, not the inserted elements), for chaining.
 */
this.after = function(content) {

    var i, j;

    // if element to insert is an $ object, we'll use the array of DOM elements
    if (content instanceof $) content = content.get();

    // if content to insert is a DOM element or a text node, wrap it in an array
    else if (content instanceof Element || content instanceof Text) content = [content];

    // if content to insert is not a string, don't go further
    else if (typeof content !== 'string') return false;

    // iterate through the set of matched elements
    for (i in elements)

        // if content to insert is a string (plain text or HTML)
        if (typeof content === 'string')

            // insert it like this
            elements[i].insertAdjacentHTML('afterend', content);

        // since content is an array of DOM elements or text nodes
        // iterate over the array
        else for (j in content)

            // insert a clone to each parent except for the last one where we move the element itself
            elements[i].parentNode.insertBefore(i < elements.length - 1 ? content[j].cloneNode(true) : content[j], elements[i].nextSibling);

    // return the set of matched elements, for chaining
    return $this;

}
