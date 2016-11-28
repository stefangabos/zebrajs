/**
 *  Attaches an event handler function for one or more events to the selected elements.
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
 *  element.on('click', callback);
 *
 *  // handle clicks on element using an anonymous function
 *  element.on('click', function(e) {
 *      console.log('clicked!');
 *  });
 *
 *  // namespacing, so that you can only remove certain events
 *  element.on('click.namespace', function(e) {
 *      console.log('clicked!');
 *  });
 *
 *  // using delegation
 *  // handle clicks on all the "div" elements
 *  // that are children of the element
 *  element.on('click', 'div', function(e) {
 *      console.log('clicked!');
 *  });
 *
 *  // chaining
 *  element.on('click', function() {
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
 *  @alias      on
 *  @instance
 */
$.fn.on = function(event_type, selector, callback) {

    var event_types = event_type.split(' '), namespace, actual_callback;

    // if method is called with just 2 arguments,
    // the seconds argument is the callback not a selector
    if (undefined === callback) callback = selector;

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // iterate through the event types we have to attach the handler to
        event_types.forEach(function(event_type) {

            actual_callback = false;

            // handle namespacing
            namespace = event_type.split('.')
            event_type = namespace[0];
            namespace = namespace[1] || '';

            // if this is the first time we have this event type
            if (undefined === event_listeners[event_type])

                // initialize the entry for this event type
                event_listeners[event_type] = [];

            // if selector is a string
            if (typeof selector === 'string') {

                // this will be the actual callback function
                actual_callback = function(e) {

                    // trigger the callback function only if the clicked element matches the selector
                    if (this !== e.target && e.target.matches(selector)) callback.apply(e.target);

                };

                // attach event listener
                element.addEventListener(event_type, actual_callback);

            // set the event listener
            } else element.addEventListener(event_type, callback);

            // add element/callback combination to the array of events of this type
            event_listeners[event_type].push([element, callback, namespace, actual_callback]);

        });

    });

    // return the set of matched elements, for chaining
    return this;

}
