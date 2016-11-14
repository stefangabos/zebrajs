/**
 *  Inserts content specified by the argument after each element in the set of matched elements.
 *
 *  Both this and the {@link $.$#insertAfter .insertAfter()} method perform the same task, the main difference being in
 *  the placement of the content and the target. With `.after()`, the selector expression preceding the method is the
 *  target after which the content is to be inserted. On the other hand, with `.insertAfter()`, the content precedes the
 *  method and it is the one inserted after the target element.
 *
 *  > Clones of the inserted element will be created after each element in the set of matched elements, except for the last
 *  one. The original item will be inserted after the last element.
 *
 *  > If the content to be inserted is an element existing on the page, clones of the element will be created after each
 *  element in the set of matched elements, except for the last one. The original item will be moved (not cloned) after
 *  the last element.
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
 *  // inserting elements already existing on the page
 *  target.after($('ul'));
 *
 *  // insert a string (which will be transformed in HTML)
 *  target.after('<div>hello</div>');
 *
 *  // chaining
 *  target.append($('div')).addClass('foo');
 *
 *  @param  {mixed}     content     DOM element, text node, HTML string or ZebraJS object to be inserted after each
 *                                  element in the set of matched elements.
 *
 *  @return {$}         Returns the set of matched elements.
 */
this.after = function(content) {

    // call the "_dom_insert" private method with these arguments
    return this._dom_insert(content, 'after');

}
