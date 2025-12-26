/**
 *  Perform a custom animation of a set of CSS properties using transitions.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
 *
 *  // fade out
 *  elements.animate({
 *      opacity: 0
 *  }, 250, () => {
 *      console.log('Animation is complete!');
 *  });
 *
 *  @param  {object}        properties  An object of CSS properties and values that the animation will move toward.
 *
 *  @param  {number|string} [duration]  A string or a number determining how long, in milliseconds, the animation will run.
 *                                      <br><br>
 *                                      The strings `'fast'` and `'slow'` may also be supplied to indicate durations of
 *                                      `200` and `600` milliseconds, respectively.
 *                                      <br><br>
 *                                      Default is `400`
 *
 *  @param  {string}        [easing]    The easing function to use.
 *                                      <br><br>
 *                                      An easing function specifies the speed at which the animation progresses at
 *                                      different points within the animation.
 *                                      <br><br>
 *                                      Allowed values are:
 *                                      <ul>
 *                                          <li>ease</li>
 *                                          <li>ease-in</li>
 *                                          <li>ease-in-out</li>
 *                                          <li>ease-out</li>
 *                                          <li>linear</li>
 *                                          <li>swing</li>
 *                                          <li>{@link https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#the_cubic-bezier_class_of_easing_functions cubic-bezier(...)} (see {@link https://easings.net/ this} for some examples)</li>
 *                                      </ul>
 *                                      Default is `swing`
 *
 *  >   This argument may be skipped!
 *
 *  @param  {function}      [callback]  A function to call once the animation is complete, called once per matched element.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      animate
 *  @instance
 */
$.fn.animate = function(properties, duration, easing, callback) {

    const unitless_properties = [
        'animationIterationCount',
        'columnCount',
        'fillOpacity',
        'flex',
        'flexGrow',
        'flexShrink',
        'floodOpacity',
        'fontWeight',
        'gridArea',
        'gridColumn',
        'gridColumnEnd',
        'gridColumnStart',
        'gridRow',
        'gridRowEnd',
        'gridRowStart',
        'lineHeight',
        'opacity',
        'order',
        'orphans',
        'stopOpacity',
        'strokeMiterlimit',
        'strokeOpacity',
        'widows',
        'zIndex',
        'zoom'
    ];

    const animation_duration = (duration === 'fast' ? 200 : (duration === 'slow' ? 600 : (typeof duration === 'number' && duration >= 0 ? duration : 400))) / 1000;
    let animation_easing = typeof easing === 'string' ? (['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear', 'swing'].includes(easing) || easing.match(/cubic\-bezier\(.*?\)/g) ? easing : 'swing') : 'swing';
    const elements_data = [];

    // apply formulas for these easing
    if (animation_easing === 'linear') animation_easing = 'cubic-bezier(0.0, 0.0, 1.0, 1.0)';
    else if (animation_easing === 'swing') animation_easing = 'cubic-bezier(.02, .01, .47, 1)';

    // if the "easing" argument is skipped
    if (typeof easing === 'function') callback = easing;

    // batch all style reads to minimize reflows
    this.forEach(element => {
        elements_data.push({
            element: element,
            styles: window.getComputedStyle(element)
        });
    });

    // batch all style writes
    elements_data.forEach(data => {

        let property, animation_data;
        let cleanup_done = false;
        const final_properties = {};

        // cleanup function that handles both transitionend and timeout scenarios
        const cleanup = function(e) {

            // prevent double execution
            if (cleanup_done) return;
            cleanup_done = true;

            // clear the timeout if it exists
            if (timeout) clearTimeout(timeout);

            // cleanup - remove transition property so future CSS changes don't animate unexpectedly
            data.element.style.transition = '';

            // clean up animation data
            // (this is used in case .stop() is called on the element)
            if ($._data_storage) {

                animation_data = $._data_storage.get(data.element);

                // if we have this data set
                if (animation_data) {

                    // unset these values
                    animation_data.zjs_animating = false;
                    animation_data.zjs_animation_properties = null;
                    animation_data.zjs_animation_cleanup = null;
                    animation_data.zjs_animation_timeout = null;

                }

            }

            // call user callback if provided
            if (callback) callback.call(data.element, e);

        };

        // initialize WeakMap storage if needed
        if (!$._data_storage) $._data_storage = new WeakMap();

        // get data object for this element
        animation_data = $._data_storage.get(data.element);

        // if no data yet
        if (!animation_data) {

            // initialize and store now
            animation_data = {};
            $._data_storage.set(data.element, animation_data);

        }

        // prepare final properties object with units added
        for (property in properties)
            final_properties[property] = properties[property] + (!isNaN(properties[property]) && !unitless_properties.includes(property) ? 'px' : '');

        // store animation state for .stop() method
        animation_data.zjs_animating = true;
        animation_data.zjs_animation_properties = final_properties;
        animation_data.zjs_animation_cleanup = cleanup;

        // explicitly set the current values of the properties we are about to animate
        for (property in properties)
            data.element.style[property] = data.styles[property];

        // listen for transition end to clean up and call callback
        $(data.element).one('transitionend', cleanup);

        // set a timeout fallback in case transitionend never fires
        // (element removed from DOM, display:none, no actual transition, etc.)
        const timeout = setTimeout(cleanup, (animation_duration * 1000) + 50);

        // store timeout reference for .stop() method
        animation_data.zjs_animation_timeout = timeout;

        // set the transition property
        data.element.style.transition = 'all ' + animation_duration + 's ' + animation_easing;

        // set the final values of the properties we are about to animate
        for (property in final_properties)
            data.element.style[property] = final_properties[property];

    });

    return this;

}
