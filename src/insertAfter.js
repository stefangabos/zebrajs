/**
 *  Inserts every element in the set of matched elements after the parent element(s), specified by the argument.
 *
 *  Both this and the {@link $#after .after()} method perform the same task, the main difference being in the
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
 *  $('<div>').text('hello').insertAfter(target);
 *
 *  // same thing as above
 *  $('<div>hello</div>').insertAfter(target);
 *
 *  // use one or more elements that already exist on the page
 *  // if "target" is a single element than the list will be moved after the target element
 *  // if "parent" is a collection of elements, clones of the list element will be created after
 *  // each target, except for the last one; the original list will be moved after the last target
 *  $('ul').insertAfter(target);
 *
 *  @param  {$}     target  A ZebraJS object after which to insert each element in the set of matched elements.
 *
 *  @return {$}     Returns the ZebraJS object you are inserting your elements after.
 */
this.insertAfter = function(target) {

    // call the "_dom_insert" private method with these arguments
    return $(target)._dom_insert(this, 'after');

}
