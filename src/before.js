/**
 *  Inserts content, specified by the argument, before each element in the set of matched elements.
 *
 *  Both this and the {@link $#insertBefore .insertBefore()} method perform the same task, the main difference being in the
 *  placement of the content and the target. With `.before()`, the selector expression preceding the method is the target
 *  before which the content is to be inserted. On the other hand, with `.insertBefore()`, the content precedes the method,
 *  and it is the one inserted before the target element.
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
 *  var target = $('#selector');
 *
 *  // insert a div that we create on the fly
 *  target.before($('<div>').text('hello'));
 *
 *  // same thing as above
 *  target.before($('<div>hello</div>'));
 *
 *  // use one or more elements that already exist on the page
 *  // if "target" is a single element than the list will be moved before the target element
 *  // if "parent" is a collection of elements, clones of the list element will be created before
 *  // each target, except for the last one; the original list will be moved before the last target
 *  target.before($('ul'));
 *
 *  // insert a string (which will be transformed in HTML)
 *  // this is more efficient memory wise
 *  target.append('<div>hello</div>');
 *
 *  // since this method returns the set of matched elements, we can use chaining
 *  target.append($('div')).addClass('classname');
 *
 *  @param  {mixed}     content     DOM element, text node, HTML string, or ZebraJS object to be inserted before each
 *                                  element in the set of matched elements.
 *
 *  @return {$}         Returns the set of matched elements (the parents, not the inserted elements), for chaining.
 */
this.before = function(content) {

    // call the "_dom_insert" private method with these arguments
    return this._dom_insert(content, 'before');

}
