/**
 *  Private helper function to handle jQuery-specific pseudo-selectors.
 *
 *  This function intercepts selectors containing jQuery pseudo-selectors (like :first, :even, :eq(n), etc.) and processes
 *  them.
 *
 *  Supported pseudo-selectors:
 *  - :first - First element in the set
 *  - :last - Last element in the set
 *  - :even - Even-indexed elements (0, 2, 4...)
 *  - :odd - Odd-indexed elements (1, 3, 5...)
 *  - :eq(n) - Element at index n (supports negative indices)
 *  - :gt(n) - Elements after index n
 *  - :lt(n) - Elements before index n
 *  - :has(selector) - Elements containing a descendant matching selector
 *  - :contains(text) - Elements containing the specified text
 *  - :visible - Visible elements
 *  - :hidden - Hidden elements
 *  - :parent - Elements that have children
 *  - :header - All header elements (h1-h6)
 *  - :input - All form input elements
 *  - :text, :checkbox, :radio, :password, :submit, :reset, :button, :file, :image - Input types
 *
 *  @param  {string}    selector    The selector string potentially containing jQuery pseudo-selectors
 *  @param  {Element}   parent      The parent element to query from (default: document)
 *
 *  @return {array|null}            Returns array of matched elements, or null if no jQuery pseudo-selectors found
 *
 *  @private
 */
var _process_pseudo_selector = function(selector, parent) {

    // pattern to match jQuery pseudo-selectors at the end of the selector
    // this handles the most common case: 'div.foo:first', 'ul > li:even', etc.
    var pseudo_pattern = /:(first|last|even|odd|eq|gt|lt|has|contains|visible|hidden|parent|header|input|text|checkbox|radio|password|submit|reset|button|file|image)\s*(\([^)]*\))?$/;

    var match = selector.match(pseudo_pattern);

    // if no jQuery pseudo-selector found, return null to use normal querySelectorAll path
    if (!match) return null;

    // the pseudo selector (i.e. "first")
    var pseudo_name = match[1];

    // the argument of the pseudo selector (if any)
    // i.e the "text" in ":contains(text)"
    var pseudo_arg = match[2] ? match[2].slice(1, -1) : null; // remove parentheses

    // the base CSS selector (if any) that precedes the pseudo-selector
    // i.e. the "div > li" in "div > li:first"
    var base_selector = selector.replace(pseudo_pattern, '').trim();

    // if base selector is empty after removing pseudo, use universal selector
    if (!base_selector) base_selector = '*';

    // this will contain the matched elements
    var elements = [];

    try {

        // get base elements using the base CSS selector
        elements = Array.from(parent.querySelectorAll(base_selector));

    } catch (e) {

        // if base selector is invalid, return null to fall back to normal error handling
        return null;

    }

    // apply the jQuery pseudo-selector filter
    switch (pseudo_name) {

        case 'first':

            return elements.length > 0 ? [elements[0]] : [];

        case 'last':

            return elements.length > 0 ? [elements[elements.length - 1]] : [];

        case 'even':

            return elements.filter(function(el, index) { return index % 2 === 0; });

        case 'odd':

            return elements.filter(function(el, index) { return index % 2 === 1; });

        case 'eq':
        case 'gt':
        case 'lt':

            // we treat the argument as a numeric value
            var index = parseInt(pseudo_arg, 10);

            // but if converting using parseInt yields "NaN" stop now
            if (isNaN(index)) return [];

            if (pseudo_name === 'eq') {

                // we're supporting negative indices (count from end)
                if (index < 0) index = elements.length + index;

                // if value is in range, return the element at position, or empty array otherwise
                return index >= 0 && index < elements.length ? [elements[index]] : [];

            }

            // return the matching elements otherwise, or whatever is already in elements if nothing matches
            return elements.filter(function(el, idx) { return (pseudo_name === 'gt' && idx > index) || (pseudo_name === 'lt' && idx < index); });

        // elements that contain a descendant matching the selector
        case 'has':

            // if the argument is not available stop now
            if (!pseudo_arg) return [];

            // filter for a match
            return elements.filter(function(el) {
                try {
                    return el.querySelectorAll(pseudo_arg).length > 0;
                } catch (e) {
                    return false;
                }
            });

        // elements containing the specified text (case-sensitive)
        case 'contains':

            // if the argument is not available stop now
            if (!pseudo_arg) return [];

            // filter for a match
            return elements.filter(function(el) {
                return el.textContent.indexOf(pseudo_arg) !== -1;
            });

        // elements that are visible (not display:none, visibility:hidden, or opacity:0)
        case 'visible':

            // filter elements
            return elements.filter(function(el) {

                // if element doesn't take up space
                if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;

                // check visibility
                var style = window.getComputedStyle(el);

                return style.display !== 'none' &&
                       style.visibility !== 'hidden' &&
                       style.opacity !== '0';

            });

        // elements that are hidden (opposite of :visible)
        case 'hidden':

            // filter elements
            return elements.filter(function(el) {

                // if element takes up space
                if (el.offsetWidth === 0 && el.offsetHeight === 0) return true;

                // check visibility
                var style = window.getComputedStyle(el);

                return style.display === 'none' ||
                       style.visibility === 'hidden' ||
                       style.opacity === '0';

            });

        // elements that have children (element or text nodes)
        case 'parent':

            return elements.filter(function(el) {
                return el.childNodes.length > 0;
            });

        // all header elements (h1-h6)
        case 'header':

            return elements.filter(function(el) {
                return /^H[1-6]$/.test(el.tagName);
            });

        // all form input elements
        case 'input':

            return elements.filter(function(el) {
                return /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName);
            });

        // input type pseudo-selectors
        case 'text':
        case 'checkbox':
        case 'radio':
        case 'password':
        case 'submit':
        case 'reset':
        case 'button':
        case 'file':
        case 'image':

            return elements.filter(function(el) {
                return el.tagName === 'INPUT' && el.type === pseudo_name;
            });

        default:
            return elements;

    }

};
