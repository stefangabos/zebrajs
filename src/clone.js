/**
 *  Creates a deep copy of the set of matched elements.
 *
 *  This method performs a deep copy of the set of matched elements meaning that it copies the matched elements as well
 *  as all of their descendant elements and text nodes.
 *
 *  Normally, any event handlers bound to the original element are not copied to the clone. Setting the `with_data_and_events`
 *  argument to `true` will copy the event handlers and element data bound to the original element.
 *
 *  > This method may lead to duplicate element IDs in a document. Where possible, it is recommended to avoid cloning
 *  elements with this attribute or using class attributes as identifiers instead.
 *
 *  Element data will be shallow-copied when `with_data_and_events` is `true`. This means objects, arrays, and functions
 *  will be shared between the original and clone. To deep copy data, copy each property manually.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // clone element with data and events, including data and events of children
 *  const clones = element.clone(true, true)
 *
 *  // chaining - clone and insert into the body element
 *  element.clone(true, true).appendTo($('body'));
 *
 *  @param  {boolean}   with_data_and_events        Setting this argument to `true` will instruct the method to also copy
 *                                                  event handlers and element data along with the elements.
 *
 *  @param  {boolean}   deep_with_data_and_events   Setting this argument to `true` will instruct the method to also copy
 *                                                  event handlers and data for all children of the cloned element.
 *
 *  @return {ZebraJS}   Returns the cloned elements, as a {@link ZebraJS} object.
 *
 *  @memberof   ZebraJS
 *  @alias      clone
 *  @instance
 */
$.fn.clone = function(with_data_and_events, deep_with_data_and_events) {

    const result = [];
    const $this = this;

    // iterate over the set of matched elements
    this.forEach(element => {

        // clone the element (together with its children)
        const clone = element.cloneNode(true);

        // add to array
        result.push(clone);

        // if events and data needs to be cloned too
        if (with_data_and_events) {

            // iterate over all the existing event listeners
            Object.keys(event_listeners).forEach(event_type => {

                // iterate over the events of current type
                event_listeners[event_type].forEach(properties => {

                    // if this is an event attached to element we've just cloned
                    if (with_data_and_events && properties[0] === element)

                        // also add the event to the clone element
                        $(clone).on(event_type + (properties[2] ? '.' + properties[2] : ''), properties[1]);

                });

            });

            // if WeakMap storage has been initialized
            if ($._data_storage) {

                // do we have complex objects stored for the element?
                const element_data = $._data_storage.get(element);

                // if we do
                if (element_data) {

                    // create a shallow copy of the data object
                    // objects, arrays, and functions are shared (not deep cloned)
                    const cloned_data = {};

                    for (const key in element_data)
                        cloned_data[key] = element_data[key];

                    // store the cloned data for the cloned element
                    $._data_storage.set(clone, cloned_data);

                }

            }

        }

        // if event handlers and data for all children of the cloned element should be also copied
        if (deep_with_data_and_events) $this._clone_data_and_events(element, clone);

    });

    // return the clone elements
    return $(result);

}
