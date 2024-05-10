/**
 *  Attaches an event handler function for one or more events to the selected elements. The event handler is executed at
 *  most once per element per event type.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // create a function
 *  var callback = function(e) {
 *      console.log('clicked!');
 *  }
 *
 *  // handle clicks on element using the function created above
 *  // (the callback will be executed only once)
 *  element.one('click', callback);
 *
 *  // handle clicks on element using an anonymous function
 *  // (the callback will be executed only once)
 *  element.one('click', function(e) {
 *      console.log('clicked!');
 *  });
 *
 *  // namespacing, so that you can remove only certain events
 *  // (the callback will be executed only once)
 *  element.one('click.namespace', function(e) {
 *      console.log('clicked!');
 *  });
 *
 *  // using delegation
 *  // handle clicks on all the "div" elements
 *  // that are children of the element
 *  // (the callback will be executed only once for each matched element)
 *  element.one('click', 'div', function(e) {
 *      console.log('clicked!');
 *  });
 *
 *  // chaining
 *  element.one('click', function() {
 *      console.log('clicked!');
 *  }).addClass('foo');
 *
 *  @param  {string}    event_type  One or more space-separated event types and optional namespaces, such as "click" or
 *                                  "click.namespace".
 *
 *  @param  {string}    [selector]  A selector string to filter the descendants of the selected elements that will call
 *                                  the handler. If the selector is null or omitted, the handler is always called when it
 *                                  reaches the selected element.
 *
 *  @param  {function}  callback    A function to execute when the event is triggered.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      one
 *  @instance
 */
$.fn.one = function(event_type, selector, callback) {

    // call the "on" method with last argument set to TRUE
    return this.on(event_type, selector, callback, true);

}
