/**
 *  Stops the currently-running animation on the matched elements.
 *
 *  When `.stop()` is called on an element, the currently-running animation (if any) is immediately stopped. If an
 *  element is being animated, the animation stops in its current position. If `jump_to_end` is set to `true`, the
 *  animation will jump to its end position.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('#selector');
 *
 *  // start an animation
 *  elements.animate({
 *      left: '+=100px',
 *      opacity: 0.5
 *  }, 1000);
 *
 *  // stop the animation at current position
 *  elements.stop();
 *
 *  // stop and jump to end position
 *  elements.stop(false, true);
 *
 *  @param  {boolean}   [clear_queue]   This parameter is included for jQuery compatibility but is currently not used
 *                                      as ZebraJS does not implement animation queuing. Reserved for future use.
 *                                      <br><br>
 *                                      Default is `false`
 *
 *  @param  {boolean}   [jump_to_end]   A boolean indicating whether to complete the current animation immediately.
 *                                      When `true`, the animation will jump to its end state. When `false` or omitted,
 *                                      the animation stops at its current position.
 *                                      <br><br>
 *                                      Default is `false`
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      stop
 *  @instance
 */
$.fn.stop = function(clear_queue, jump_to_end) {

    // iterate over the set of matched elements
    this.forEach(element => {

        let property, transition_property, properties_list;
        const $element = $(element);

        // if for whatever reason we don't have this property initialized stop now
        if (!$._data_storage) return;

        // get animation data stored by animate() method
        const animation_data = $._data_storage.get(element);

        // if no animation data found, nothing to stop
        if (!animation_data || !animation_data.zjs_animating) return;

        // get current computed styles to freeze or jump
        const computed_style = window.getComputedStyle(element);

        // remove the "transitionend" event listener
        if (animation_data.zjs_animation_cleanup) $element.off('transitionend', animation_data.zjs_animation_cleanup);

        // clear the timeout fallback
        if (animation_data.zjs_animation_timeout) clearTimeout(animation_data.zjs_animation_timeout);

        // stop the transition by setting it to 'none'
        element.style.transition = 'none';

        // if we need to jump_to_end
        if (jump_to_end && animation_data.zjs_animation_properties)

            // jump to end: apply the target (end) properties
            for (property in animation_data.zjs_animation_properties)
                element.style[property] = animation_data.zjs_animation_properties[property];

        // if we need to "freeze" the animation at current position
        // (apply computed values as inline styles)
        else {

            // get the list of properties being transitioned
            transition_property = computed_style.transitionProperty;

            // if transition property is set
            if (transition_property && transition_property !== 'none') {

                // split into individual properties
                properties_list = transition_property.split(', ');

                // apply current computed values
                properties_list.forEach(prop => {

                    // skip 'all' and 'none' keywords
                    if (prop !== 'all' && prop !== 'none') {

                        // convert CSS property name (e.g., 'margin-left') to camelCase (e.g., 'marginLeft')
                        prop = prop.replace(/\-([a-z])/g, (match, letter) => letter.toUpperCase());

                        // apply the current computed value
                        element.style[prop] = computed_style[prop];

                    }

                });

            }

        }

        // force a reflow to apply the changes immediately
        void element.offsetHeight;

        // reset transition property for future animations
        element.style.transition = '';

        // clean up animation data
        animation_data.zjs_animating = false;
        animation_data.zjs_animation_properties = null;
        animation_data.zjs_animation_cleanup = null;
        animation_data.zjs_animation_timeout = null;

    });

    return this;

}
