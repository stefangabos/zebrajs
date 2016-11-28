/**
 *  Execute all handlers attached to the matched elements for the given event type, in the same order they would be if
 *  the event were triggered naturally by the user.
 *
 *  `.trigger()`ed events bubble up the DOM tree; an event handler can stop the bubbling by returning `false` from the
 *  handler or calling the `.stopPropagation()` method on the event object passed into the event.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // handle clicks on element
 *  element.on('click', function(e) {
 *
 *      // will return "undefined" when element is clicked
 *      // but will return "baz" when triggered manually
 *      console.log(e.foo)
 *
 *  });
 *
 *  // manually trigger the click event
 *  element.trigger('click', {foo: 'baz'});
 *
 *  // chaining
 *  element.trigger('click', {foo: 'baz'}).addClass('foo');
 *
 *  @param  {string}    event_type  A string containing a JavaScript event type, such as `click` or `submit`.
 *
 *  @param  {object}    data        Additional parameters to pass along to the event handler.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      trigger
 *  @instance
 */
$.fn.trigger = function(event_type, data) {

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // create the event
        var event = document.createEvent('HTMLEvents');

        // define the event's name
        // the event will bubble and it is cancelable
        event.initEvent(event_type, true, true);

        // if data is specified and is an object
        if (typeof data === 'object')

            // iterate over the object's keys
            Object.keys(data).forEach(function(key) {

                // attach them to the event object
                event[key] = data[key];

            });

        // dispatch the event
        element.dispatchEvent(event);

    });

    // return the set of matched elements, for chaining
    return this;

}
