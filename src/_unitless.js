/**
 * CSS properties that accept unitless numeric values.
 *
 * These properties don't need 'px' or other units appended when setting numeric values.
 * Includes standard CSS properties, flexbox, grid, and SVG properties.
 *
 * @private
 * @constant {Array<string>}
 */
// eslint-disable-next-line no-unused-vars
const unitless_properties = [

    // Animation
    'animationIterationCount',

    // Border & Image
    'borderImageOutset',
    'borderImageSlice',
    'borderImageWidth',

    // Flexbox (legacy)
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',

    // Columns
    'columnCount',
    'columns',

    // Flexbox
    'flex',
    'flexGrow',
    'flexNegative',
    'flexOrder',
    'flexPositive',
    'flexShrink',

    // Font
    'fontWeight',
    'lineClamp',
    'lineHeight',

    // Grid
    'gridArea',
    'gridColumn',
    'gridColumnEnd',
    'gridColumnSpan',
    'gridColumnStart',
    'gridRow',
    'gridRowEnd',
    'gridRowSpan',
    'gridRowStart',

    // Display & Opacity
    'opacity',
    'order',
    'orphans',

    // Miscellaneous
    'tabSize',
    'widows',
    'zIndex',
    'zoom',

    // SVG properties
    'fillOpacity',
    'floodOpacity',
    'stopOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeMiterlimit',
    'strokeOpacity',
    'strokeWidth'

];
