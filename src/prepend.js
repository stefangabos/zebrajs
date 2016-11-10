/**
 *  Inserts content, specified by the argument, to the beginning of each element in the set of matched elements.
 *
 *  Both this and the {@link $#prependTo .prependTo()} method perform the same task, the main difference being in the placement
 *  of the content and the target. With `.prepend()`, the selector expression preceding the method is the container into
 *  which the content is to be inserted. On the other hand, with `.prependTo()`, the content precedes the method, and it
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
 *  parent.prepend($('<div>').text('hello'));
 *
 *  // same thing as above
 *  parent.prepend($('<div>hello</div>'));
 *
 *  // prepend one or more elements that already exist on the page
 *  // if "parent" is a single element than the list will be moved inside the parent element
 *  // if "parent" is a collection of elements, clones of the list element will be created for
 *  // each target except for the last one; for the last target, the original list will be moved
 *  parent.prepend($('ul'));
 *
 *  // prepend a string (which will be transformed in HTML)
 *  // this is more efficient memory wise
 *  parent.prepend('<div>hello</div>');
 *
 *  // chaining
 *  parent.prepend($('div')).addClass('foo');
 *
 *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to insert at the beginning
 *                                  of each element in the set of matched elements.
 *
 *  @return {$}         Returns the set of matched elements (the parents, not the prepended elements).
 */
this.prepend = function(content) {

    // call the "_dom_insert" private method with these arguments
    return this._dom_insert(content, 'prepend');

}
