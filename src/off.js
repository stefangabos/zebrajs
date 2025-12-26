/**
 *  Remove an event handler.
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
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      off
 *  @instance
 */
$.fn.off = function(event_type, callback) {

    const event_types = event_type ? event_type.split(' ') : [...event_listeners.keys()];
    const remove_all_event_handlers = !event_type;
    let namespace, index, entry, actual_event_type;

    // iterate through the set of matched elements
    this.forEach(element => {

        // iterate through the event types we have to remove the handler from
        event_types.forEach(original_event => {

            // handle namespacing
            namespace = original_event.split('.')
            actual_event_type = namespace[0];
            namespace = namespace[1] || '';

            // if we have registered event of this type
            if (event_listeners.has(actual_event_type)) {

                const listeners = event_listeners.get(actual_event_type);

                // iterate through the registered events of this type
                // we're going backwards to avoid memory leaks while iterating through an array while
                // simultaneously splicing from it
                for (index = listeners.length - 1; index >= 0; index--) {

                    entry = listeners[index];

                    // if
                    if (

                        // this is an event registered for the current element
                        entry[0] === element &&

                        // no callback was specified (we need to remove all events of this type) OR
                        // callback is given and we've just found it
                        (undefined === callback || callback === entry[1]) &&

                        // we're looking at the right namespace (or we need to remove all event handlers)
                        (remove_all_event_handlers || namespace === entry[2])

                    ) {

                        // remove the event listener
                        element.removeEventListener(actual_event_type, entry[3] || entry[1]);

                        // remove entry from the event listeners array
                        listeners.splice(index, 1);

                        // if nothing left for this event type then also remove the event type's entry
                        if (listeners.length === 0) event_listeners.delete(actual_event_type);

                        // don't look further
                        return;

                    }

                }

            }

        });

    });

    // return the set of matched elements, for chaining
    return this;

}
