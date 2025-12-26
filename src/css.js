/**
 *  Gets the value of a computed style property for the first element in the set of matched elements, or sets one or more
 *  CSS properties for every matched element.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const elements = $('selector');
 *
 *  // get the value of a computed style property
 *  // for the first element in the set of matched elements
 *  elements.css('width');
 *
 *  // set a single CSS property
 *  elements.css('position', 'absolute');
 *
 *  // set multiple CSS properties
 *  elements.css({
 *      position: 'absolute',
 *      left: 0,
 *      top: 0
 *  });
 *
 *  // remove a property
 *  elements.attr('position', false);
 *
 *  // chaining
 *  elements.css('position', 'absolute').removeClass('foo');
 *
 *  @param  {string|object} property    If given as a `string` representing a CSS property and `value` **is not** set,
 *                                      this method will return the computed style of that particular property for the
 *                                      first element in the set of matched elements.
 *                                      <br><br>
 *                                      If given as a `string` representing a CSS property and `value` **is** set, this
 *                                      method will set that particular CSS property's value for all the elements in the
 *                                      set of matched elements.
 *                                      <br><br>
 *                                      If given as an `object`, this method will set the given CSS properties to the
 *                                      given values for all the elements in the set of matched elements.
 *
 *  @param  {string}        [value]     The value to be set for the CSS property given as argument. *Only used if `property`
 *                                      is not an object!*
 *                                      <br><br>
 *                                      Setting it to `false` or `null` will instead **remove** the CSS property from the
 *                                      set of matched elements.
 *
 *  @return {ZebraJS|mixed}             When `setting` CSS properties, this method returns the set of matched elements.
 *                                      When `reading` CSS properties, this method returns the value(s) of the required computed style(s).
 *
 *  @memberof   ZebraJS
 *  @alias      css
 *  @instance
 */
$.fn.css = function(property, value) {

    // CSS properties that don't have a unit
    // *numeric* values for other CSS properties will be suffixed with "px", unless already suffixed with a unit
    // list taken from https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59
    const unitless_properties = [

        'animationIterationCount', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'boxFlex',
        'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'columns', 'flex', 'flexGrow', 'flexPositive',
        'flexShrink', 'flexNegative', 'flexOrder', 'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart',
        'gridColumn', 'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'fontWeight', 'lineClamp',
        'lineHeight', 'opacity', 'order', 'orphans', 'tabSize', 'widows', 'zIndex', 'zoom',

        // svg-related properties
        'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset',
        'strokeMiterlimit', 'strokeOpacity', 'strokeWidth'

    ];

    // if "property" is an object and "value" is not set
    if (typeof property === 'object')

        // iterate through the set of matched elements
        this.forEach(element => {

            // iterate through the "properties" object
            for (const i in property)

                // set each style property
                element.style[i] = property[i] +

                    // if value does not have a unit provided and is not one of the unitless properties, add the "px" suffix
                    (parseFloat(property[i]) === property[i] && !unitless_properties.includes(i) ? 'px' : '');

        });

    // if "property" is not an object, and "value" argument is set
    else if (undefined !== value)

        // iterate through the set of matched elements
        this.forEach(element => {

            // if value argument's value is FALSE or NULL
            if (value === false || value === null)

                // remove the CSS property
                element.style[property] = '';

            // set the respective style property
            else element.style[property] = value;

        });

    // if "property" is not an object and "value" is not set
    // return the value of the given CSS property, or "undefined" if property is not available
    else {

        // return "undefined" in case of an empty selection
        if (!this[0]) return undefined;

        // get the first element's computed styles
        const computedStyle = window.getComputedStyle(this[0]);

        // return the sought property's value
        return computedStyle[property];

    }

    // if we get this far, return the matched elements
    return this;

}
