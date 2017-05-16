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
 *  // namespacing, so that you can remove only certain events
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
$.fn.on = function(event_type, selector, callback, once) {

    var event_types, namespace, actual_callback, i;

    // if event_type is given as object
    if (typeof event_type === 'object') {

        // iterate over all the events
        for (i in event_type)

            // bind them
            this.on(i, event_type[i]);

        // don't go forward
        return;

    }

    // if more than a single event was given
    event_types = event_type.split(' ');

    // if method is called with just 2 arguments,
    // the seconds argument is the callback not a selector
    if (undefined === callback) callback = selector;

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // iterate through the event types we have to attach the handler to
        event_types.forEach(function(original_event) {

            actual_callback = false;

            // handle namespacing
            namespace = original_event.split('.')
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

                    // if the callback needs to be executed only once, remove it now
                    if (once) $(this).off(original_event, callback);

                    // trigger the callback function only if the target element matches the selector
                    if (this !== e.target && e.target.matches(selector)) callback(e);

                };

                // attach event listener
                element.addEventListener(event_type, actual_callback);

            // if the callback needs to be executed only once
            } else if (once) {

                // the actual callback function
                actual_callback = function(e) {

                    // remove the event handler
                    $(this).off(original_event, callback);

                    // execute the callback function
                    callback(e);

                }

                // set the event listener
                element.addEventListener(event_type, actual_callback);

            // registering of default event listeners
            } else element.addEventListener(event_type, callback);

            // add element/callback combination to the array of events of this type
            event_listeners[event_type].push([element, callback, namespace, actual_callback]);

        });

    });

    // return the set of matched elements, for chaining
    return this;

}
