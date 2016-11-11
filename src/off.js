/**
 *  Remove an event handler.
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
 *  // remove that particular click event
 *  element.off('click', callback);
 *
 *  // remove *all* the click events
 *  element.off('click');
 *
 *  // remove *only* the click events that were namespaced
 *  element.off('click.namespace');
 *
 *  @param  {string}    event_type  One or more space-separated event types and optional namespaces, such as "click" or
 *                                  "click.namespace".
 *
 *  @param  {function}  callback    A function to execute when the event is triggered.
 *
 *  @return {$}         Returns the set of matched elements.
 */
this.off = function(event_type, callback) {

    var namespace = event_type.split('.'), event_types = event_type.split(' ');

    // handle namespacing
    event_type = namespace[1];
    namespace = namespace[1] || '';

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        // iterate through the event types we have to remove the handler from
        event_types.forEach(function(event_type) {

            // if this is the first time we have this event type
            if (undefined !== event_listeners[event_type])

                // iterate through the registered event of this type
                event_listeners[event_type].forEach(function(entry) {

                    // if
                    if (

                        // this is an event registered for the current element
                        entry[0] === element &&

                        // no callback was specified (we need to remove all events of this type) OR
                        // callback is given and we've just found it
                        (undefined === callback || callback === entry[1]) &&

                        // we're looking at the right namespace
                        namespace === entry[2]
                    )

                        // remove the event listener
                        element.removeEventListener(event_type, entry[3] || entry[1]);

                });

        });

    });

    // return the set of matched elements, for chaining
    return $this;

}
