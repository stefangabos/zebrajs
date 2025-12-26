/**
 *  Private helper method used by {@link ZebraJS#addClass .addClass()}, {@link ZebraJS#removeClass .removeClass()} and
 *  {@link ZebraJS#toggleClass .toggleClass()} methods.
 *
 *  @param  {string}    action      What to do with the class(es)
 *                                  <br><br>
 *                                  Possible values are `add`, `remove` and `toggle`.
 *
 *  @param  {string}    class_names One or more space-separated class names to be added/removed/toggled for each element
 *                                  in the set of matched elements.
 *
 *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the appended elements), for chaining.
 *
 *  @access private
 */
$.fn._class = function(action, class_names) {

    // split by space and create an array
    class_names = class_names.split(' ');

    // iterate through the set of matched elements
    this.forEach(element => {

        // iterate through the class names to add
        class_names.forEach(class_name => {

            // add or remove class(es)
            element.classList[action === 'add' || (action === 'toggle' && !element.classList.contains(class_name)) ? 'add' : 'remove'](class_name);

        });

    });

    // return the set of matched elements, for chaining
    return this;

}

/**
 *  Private helper method used by {@link ZebraJS#clone .clone()} method when called with the `deep_with_data_and_events`
 *  argument set to TRUE. It recursively attaches events and data from an original element's children to its clone
 *  children.
 *
 *  @param  {DOM_element}   element     Element that was cloned
 *
 *  @param  {DOM_element}   clone       Clone of the element
 *
 *  @return {void}
 *
 *  @access private
 */
$.fn._clone_data_and_events = function(element, clone) {

    // get the original element's and the clone's children
    const elements = Array.from(element.children),
        clones = Array.from(clone.children),
        $this = this;

    // if the original element's has any children
    if (elements && elements.length)

        // iterate over the original element's children
        elements.forEach((element, index) => {

            // iterate over all the existing event listeners
            Object.keys(event_listeners).forEach(event_type => {

                // iterate over the events of current type
                event_listeners[event_type].forEach(properties => {

                    // if this is an event attached to element we've just cloned
                    if (properties[0] === element) {

                        // also add the event to the clone element
                        $(clones[index]).on(event_type + (properties[2] ? '.' + properties[2] : ''), properties[1]);

                        // if original element has some data attached to it
                        if (element.zjs && element.zjs.data) {

                            // clone it
                            clones[index].zjs = {};
                            clones[index].zjs.data = element.zjs.data;

                        }

                    }

                });

            });

            // recursively attach events to children's children
            $this._clone_data_and_events(element, clones[index]);

        });

}

/**
 *  Private helper method used by {@link ZebraJS#append .append()}, {@link ZebraJS#appendTo .appendTo()},
 *  {@link ZebraJS#after .after()}, {@link ZebraJS#insertAfter .insertAfter()}, {@link ZebraJS#before .before()},
 *  {@link ZebraJS#insertBefore .insertBefore()}, {@link ZebraJS#prepend .prepend()}, {@link ZebraJS#prependTo .prependTo()}
 *  and {@link ZebraJS#wrap .wrap()} methods.
 *
 *  @param  {mixed}     content     Depending on the caller method this is the DOM element, text node, HTML string, or
 *                                  {@link ZebraJS} object to insert in the DOM.
 *
 *  @param  {string}    where       Indicated where the content should be inserted, relative to the set of matched elements.
 *                                  <br><br>
 *                                  Possible values are `after`, `append`, `before`, `prepend` and `wrap`.
 *
 *  @return {ZebraJS}   Returns the set of matched elements (the parents, not the appended elements), for chaining.
 *
 *  @access private
 */
$.fn._dom_insert = function(content, where) {

    const $this = this;

    // make a ZebraJS object out of whatever given as content
    content = $(content);

    // iterate through the set of matched elements
    this.forEach((element, element_index) => {

        // since content is an array of DOM elements or text nodes
        // iterate over the array
        content.forEach(item => {

            // where the content needs to be moved in the DOM
            switch (where) {

                // insert a clone after each target except for the last one after which we insert the original content
                case 'after':
                case 'replace':
                case 'wrap': element.parentNode.insertBefore(element_index < $this.length - 1 ? item.cloneNode(true) : item, element.nextSibling); break;

                // add a clone to each parent except for the last one where we add the original content
                case 'append': element.appendChild(element_index < $this.length - 1 ? item.cloneNode(true) : item); break;

                // insert a clone before each target except for the last one before which we insert the original content
                case 'before': element.parentNode.insertBefore(element_index < $this.length - 1 ? item.cloneNode(true) : item, element); break;

                // prepend a clone to each parent except for the last one where we add the original content
                case 'prepend': element.insertBefore(element_index < $this.length - 1 ? item.cloneNode(true) : item, element.firstChild); break;

            }

            // if we're wrapping the element
            if (where === 'wrap' || where === 'replace') {

                // remove the original element
                element.parentNode.removeChild(element);

                // for the "wrap" method, insert the removed element back into the container
                if (where === 'wrap') item.appendChild(element);

            }

        });

    });

    // return the newly inserted element(s), for chaining
    return content;

}

/**
 *  Private helper method used by {@link ZebraJS#children .children()}, {@link ZebraJS#siblings .siblings()},
 *  {@link ZebraJS#next .next()} and {@link ZebraJS#prev .prev()} methods.
 *
 *  @param  {string}    action      Specified what type of elements to look for
 *                                  <br><br>
 *                                  Possible values are `children` and `siblings`.
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {ZebraJS}   Returns the found elements, as a ZebraJS object
 *
 *  @access private
 */
$.fn._dom_search = function(action, selector) {

    let result = [], remove_id, root, tmp;
    const $this = this;

    // iterate through the set of matched elements
    this.forEach(element => {

        remove_id = false;

        // if selector is specified
        if (selector) {

            // if we're looking for children nodes, the root element is the element itself
            if (action === 'children') root = element;

            // otherwise, the root element is the element's parent node
            else root = element.parentNode;

            // if the root element doesn't have an ID,
            if (null === root.getAttribute('id')) {

                // generate and set a random ID for the element's parent node
                root.setAttribute('id', $this._random('id'));

                // set this flag so that we know to remove the randomly generated ID when we're done
                remove_id = true;

            }

        }

        // if we're looking for siblings
        if (action === 'siblings') {

            // cache parent node to avoid multiple property accesses
            const parent = element.parentNode;

            // get the element's parent's children nodes which, optionally, match a given selector
            // and add them to the results array, skipping the current element
            result = result.concat(Array.from(selector ? parent.querySelectorAll('#' + parent.id + '>' + selector) : parent.children).filter(child => child !== element));

        }

        // if we're looking for children
        else if (action === 'children')

            // get the element's children nodes which, optionally, match a given selector
            // and add them to the results array
            result = result.concat(Array.from(selector ? root.querySelectorAll('#' + root.id + '>' + selector) : element.children));

        // if we're looking next/previous sibling
        else if (action === 'previous' || action === 'next') {

            // get the next/previous sibling
            tmp = element[(action === 'next' ? 'next' : 'previous') + 'ElementSibling'];

            // if there's no selector specified or there is and it matches
            if (!selector || $(tmp).is(selector))

                // add it to the results array
                result = result.concat([tmp]);

        }

        // if present, remove the randomly generated ID
        // we remove the randomly generated ID from the element
        if (remove_id) root.removeAttribute('id');

    });

    // return the result, as a ZebraJS object
    return $(result);

}

/**
 *  Private helper method
 *
 *  @access private
 */
$.fn._random = function(prefix) {

    // if the internal counter is too large, reset it
    if (internal_counter > Number.MAX_VALUE) internal_counter = 0;

    // return a pseudo-random string by incrementing the internal counter
    return prefix + '_' + internal_counter++;

}

/**
 *  Private helper method used by traversal/filtering methods to set prevObject for .end() support.
 *
 *  @param  {ZebraJS}   result  The ZebraJS object to set prevObject on
 *
 *  @return {ZebraJS}   Returns the result with prevObject set to this
 *
 *  @access private
 */
$.fn._add_prev_object = function(result) {

    // store reference to the previous object so .end() can restore it
    result.prevObject = this;

    // return the result
    return result;

}
