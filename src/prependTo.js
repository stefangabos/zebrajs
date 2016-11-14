/**
 *  Inserts every element in the set of matched elements to the beginning of the parent element(s), specified by the argument.
 *
 *  Both this and the {@link $.$#prepend .prepend()} method perform the same task, the main difference being in the
 *  placement of the content and the target. With `.prepend()`, the selector expression preceding the method is the
 *  container into which the content is to be inserted. On the other hand, with `.prependTo()`, the content precedes the
 *  method, and it is inserted into the target container.
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
 *  // prepend a div that we create on the fly
 *  $('<div>').text('hello').prependTo(parent);
 *
 *  // same thing as above
 *  $('<div>hello</div>').prependTo(parent);
 *
 *  // prepend one or more elements that already exist on the page
 *  // if "parent" is a single element than the list will be moved inside the parent element
 *  // if "parent" is a collection of elements, clones of the list element will be created for
 *  // each target except for the last one; for the last target, the original list will be moved
 *  $('ul').appendTo(parent);
 *
 *  @param  {$}     parent      A ZebraJS object at beginning of which to insert each element in the set of matched elements.
 *
 *  @return {$}     Returns the ZebraJS object you are appending to.
 */
this.prependTo = function(parent) {

    // call the "_dom_insert" private method with these arguments
    return $(parent)._dom_insert(this, 'prepend');

}
