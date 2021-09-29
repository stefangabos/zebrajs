/**
 *  Perform a custom animation of a set of CSS properties using transitions.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var elements = $('selector');
 *
 *  // fade out
 *  elements.animate({
 *      opacity: 0
 *  }, 250, function() {
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
 *  >   This argument my be skipped!
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

    var unitless_properties = [
        'animationIterationCount',
        'columnCount',
        'fillOpacity',
        'flexGrow',
        'flexShrink',
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
        'widows',
        'zIndex',
        'zoom'
    ];

    // iterate over the set of matched elements
    this.forEach(function(element) {

        var property,
            styles = window.getComputedStyle(element),
            animation_duration = (duration === 'fast' ? 200 : (duration === 'slow' ? 600 : (duration || 400))) / 1000,
            animation_easing = typeof easing === 'string' ? (['ease', 'ease-in', 'ease-in-out', 'ease-out', 'linear', 'swing'].indexOf(easing) > -1 || easing.match(/cubic\-bezier\(.*?\)/g) ? easing : 'swing') : 'swing';

        // apply formulas for these easing
        if (animation_easing === 'linear') animation_easing = 'cubic-bezier(0.0, 0.0, 1.0, 1.0)';
        else if (animation_easing === 'swing') animation_easing = 'cubic-bezier(.02, .01, .47, 1)';

        // explicitly set the current values of the
        // properties we are about to animate
        for (property in properties)
            element.style[property] = styles[property];

        // if the "easing" argument is skipped
        if (typeof easing === 'function') callback = easing;

        // if a callback is set
        // run it once transitions end
        if ('function' === typeof callback) $(element).one('transitionend', callback, true);

        // set the transition property
        // default animation speed is 400
        element.style.transition = 'all ' + animation_duration + 's ' + animation_easing;

        // console.log('all ' + animation_duration + 's' + animation_easing);

        // set the final values of the
        // properties we are about to animate
        for (property in properties)
            element.style[property] = properties[property] + (!isNaN(properties[property]) && unitless_properties.indexOf(property) === -1 ? 'px' : '');

    });

    return this;

}
