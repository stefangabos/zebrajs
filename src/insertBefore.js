/**
 *  Inserts every element in the set of matched elements before the parent element(s), specified by the argument.
 *
 *  Both this and the {@link ZebraJS#before .before()} method perform the same task, the main difference being in the
 *  placement of the content and the target. With `.before()`, the selector expression preceding the method is the target
 *  before which the content is to be inserted. On the other hand, with `.insertBefore()`, the content precedes the method,
 *  and it is the one inserted before the target element(s).
 *
 *  > If there is more than one target element, clones of the inserted element will be created before each target except
 *  for the last one. The original item will be inserted before the last target.
 *
 *  > If an element selected this way is inserted elsewhere in the DOM, clones of the inserted element will be created
 *  before each target except for the last one. The original item will be moved (not cloned) before the last target.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const target = $('#selector');
 *
 *  // insert a div that we create on the fly
 *  $('<div>').text('hello').insertBefore(target);
 *
 *  // same thing as above
 *  $('<div>hello</div>').insertBefore(target);
 *
 *  // use one or more elements that already exist on the page
 *  // if "target" is a single element than the list will be moved before the target element
 *  // if "parent" is a collection of elements, clones of the list element will be created before
 *  // each target, except for the last one; the original list will be moved before the last target
 *  $('ul').insertBefore(target);
 *
 *  @param  {ZebraJS}   target  A ZebraJS object before which to insert each element in the set of matched elements.
 *
 *  @return {ZebraJS}   Returns the ZebraJS object before which the content is inserted.
 *
 *  @memberof   ZebraJS
 *  @alias      insertBefore
 *  @instance
 */
$.fn.insertBefore = function(target) {

    // call the "_dom_insert" private method with these arguments
    return $(target)._dom_insert(this, 'before');

}
