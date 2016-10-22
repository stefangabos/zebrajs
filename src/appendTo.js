/**
 *  Inserts every element in the set of matched elements to the end of the parent element, specified by the argument.
 *
 *  Both this and the {@link $#append .append()} method perform the same task, the main difference being in the placement
 *  of the content and the target. With `.append()`, the selector expression preceding the method is the container into
 *  which the content is to be inserted. On the other hand, with `.appendTo()`, the content precedes the method, and it
 *  is inserted into the target container.
 *
 *  > If there is more than one target element, clones of the inserted element will be created for each target except for
 *  the last one. For the last target, the original item will be inserted.
 *
 *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created for
 *  each target except for the last one. For the last target, the original item will be moved (not cloned).
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var parent = $('#selector');
 *
 *  // append a div that we create on the fly
 *  $('<div>').text('hello').appendTo(parent);
 *
 *  // same thing as above
 *  $('<div>hello</div>').appendTo(parent);
 *
 *  // append one or more elements that already exist on the page
 *  // if "parent" is a single element than the list will be moved inside the parent element
 *  // if "parent" is a collection of elements, clones of the list element will be created for
 *  // each target except for the last one; for the last target, the original list will be moved
 *  $('ul').appendTo(parent);
 *
 *  // append a text node we create on the fly
 *  $(document.createTextNode('hello')).appendTo(parent);
 *
 *  @param  {mixed}     parent      A ZebraJS object at end of which to insert each element in the set of matched elements.
 *
 *  @return {$}         Returns the ZebraJS object you are appending to.
 */
this.appendTo = function(parent) {

    // reverse the arguments and call the "append" method
    return $(parent).append(this);

}
