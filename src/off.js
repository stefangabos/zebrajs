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
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      off
 *  @instance
 */
$.fn.off = function(event_type, callback) {

    var event_types = event_type ? event_type.split(' ') : Object.keys(event_listeners),
        namespace, index, entry,
        remove_all_event_handlers = !event_type;

    // iterate through the set of matched elements
    this.forEach(function(element) {

        // iterate through the event types we have to remove the handler from
        event_types.forEach(function(event_type) {

            // handle namespacing
            namespace = event_type.split('.')
            event_type = namespace[0];
            namespace = namespace[1] || '';

            // if we have registered event of this type
            if (undefined !== event_listeners[event_type])

                // iterate through the registered events of this type
                // we're going backwards to avoid memory leaks while iterating through an array while
                // simultaneously splicing from it
                for (index = event_listeners[event_type].length - 1; index >= 0; index--) {

                    entry = event_listeners[event_type][index];

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
                        element.removeEventListener(event_type, entry[3] || entry[1]);

                        // remove entry from the event listeners array
                        event_listeners[event_type].splice(index, 1);

                        // if nothing left for this event type then also remove the event type's entry
                        if (event_listeners[event_type].length === 0) delete event_listeners[event_type];

                        // don't look further
                        return;

                    }

                }

        });

    });

    // return the set of matched elements, for chaining
    return this;

}
