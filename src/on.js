/**
 *  Attaches an event handler function for one or more events to the selected elements.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // create a function
 *  const callback = e => {
 *      console.log('clicked!');
 *  }
 *
 *  // handle clicks on element using the function created above
 *  element.on('click', callback);
 *
 *  // handle clicks on element using an anonymous function
 *  element.on('click', e => {
 *      console.log('clicked!');
 *  });
 *
 *  // namespacing, so that you can remove only certain events
 *  element.on('click.namespace', e => {
 *      console.log('clicked!');
 *  });
 *
 *  // passing data to the event handler
 *  element.on('click', { foo: 'bar' }, e => {
 *      console.log(e.data.foo); // 'bar'
 *  });
 *
 *  // using delegation
 *  // handle clicks on all the "div" elements
 *  // that are children of the element
 *  element.on('click', 'div', e => {
 *      console.log('clicked!');
 *  });
 *
 *  // using delegation with data
 *  element.on('click', 'div', { userId: 123 }, e => {
 *      console.log(e.data.userId); // 123
 *  });
 *
 *  // chaining
 *  element.on('click', () => {
 *      console.log('clicked!');
 *  }).addClass('foo');
 *
 *  // multiple events
 *  element.on({
 *      mouseenter: () => { ... },
 *      mouseleave: () => { ... }
 *  });
 *
 *  @param  {string}    event_type  One or more space-separated event types and optional namespaces, such as "click" or
 *                                  "click.namespace". Can also be given as an object.
 *
 *  @param  {string}    [selector]  A selector string to filter the descendants of the selected elements that will call
 *                                  the handler. If the selector is null or omitted, the handler is always called when it
 *                                  reaches the selected element.
 *
 *  @param  {object}    [data]      Data to be passed to the handler in `event.data` when an event is triggered.
 *
 *  @param  {function}  callback    A function to execute when the event is triggered.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      on
 *  @instance
 */
$.fn.on = function(event_type, selector, data, callback, once) {

    let namespace, actual_callback, event_data;

    // if event_type is given as object
    if (typeof event_type === 'object') {

        // iterate over all the events
        for (const i in event_type)

            // bind them
            this.on(i, event_type[i]);

        // don't go forward
        return this;

    }

    // if more than a single event was given
    const event_types = event_type.split(' ');

    // handle optional selector and data
    // case 1: selector is a function - on(event_type, callback)
    if (typeof selector === 'function') {

        // shift parameters
        if (typeof data === 'boolean') once = data;
        callback = selector;
        selector = undefined;
        data = undefined;

    // case 2: selector is an object - on(event_type, data, callback)
    } else if (typeof selector === 'object' && selector !== null && !Array.isArray(selector)) {

        // shift parameters
        event_data = selector;
        if (typeof callback === 'boolean') once = callback;
        if (typeof data === 'function') callback = data;
        selector = undefined;
        data = undefined;

    // case 3: selector is a string
    } else if (typeof selector === 'string')

        // if data is a function - on(event_type, selector, callback)
        if (typeof data === 'function') {

            if (typeof callback === 'boolean') once = callback;
            callback = data;
            data = undefined;

        // if data is an object - on(event_type, selector, data, callback)
        } else if (typeof data === 'object' && data !== null && !Array.isArray(data))

            event_data = data;

    // iterate through the set of matched elements
    this.forEach(element => {

        // iterate through the event types we have to attach the handler to
        event_types.forEach(original_event => {

            actual_callback = false;

            // handle namespacing
            namespace = original_event.split('.')
            event_type = namespace[0];
            namespace = namespace[1] || '';

            // if this is the first time we have this event type
            if (!event_listeners.has(event_type))

                // initialize the entry for this event type
                event_listeners.set(event_type, []);

            // if selector is a string
            if (typeof selector === 'string') {

                // this will be the actual callback function
                actual_callback = function(e) {

                    // attach data to event object if provided
                    if (event_data) e.data = event_data;

                    // if the callback needs to be executed only once, remove it now
                    if (once) $(this).off(original_event, callback);

                    // walk up the DOM tree from e.target to "this" (the element the listener is attached to)
                    // to find an element that matches the selector
                    let target = e.target;

                    // as long as we didn't yet find the element the listener is attached to
                    while (target && target !== this) {

                        // if the element matches the selector
                        if (_query(selector, target, 'matches')) {

                            // call the callback with the matched element as 'this'
                            callback.call(target, e);

                            // stop after first match (don't continue bubbling up)
                            return;

                        }

                        // continue walking up the DOM tree
                        target = target.parentNode;

                    }

                };

                // attach event listener
                element.addEventListener(event_type, actual_callback);

            // if the callback needs to be executed only once
            } else if (once) {

                // the actual callback function
                actual_callback = function(e) {

                    // attach data to event object if provided
                    if (event_data) e.data = event_data;

                    // remove the event handler
                    $(this).off(original_event, callback);

                    // execute the callback function
                    callback.call(this, e);

                }

                // set the event listener
                element.addEventListener(event_type, actual_callback);

            // registering of default event listeners
            } else

                // if we have event data, wrap the callback
                if (event_data) {

                    actual_callback = function(e) {

                        // attach data to event object
                        e.data = event_data;

                        // execute the callback function
                        callback.call(this, e);

                    };

                    element.addEventListener(event_type, actual_callback);

                // no event data, register callback directly
                } else element.addEventListener(event_type, callback);

            // add element/callback combination to the array of events of this type
            event_listeners.get(event_type).push([element, callback, namespace, actual_callback]);

        });

    });

    // return the set of matched elements, for chaining
    return this;

}
