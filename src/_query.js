/**
 *  Selector engine that handles both standard CSS selectors and jQuery pseudo-selectors.
 *
 *  Supported pseudo-selectors:
 *
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
 *  @param  {string}    selector            The selector string (CSS or jQuery pseudo-selector)
 *
 *  @param  {Element}   [context]           The element to search within
 *                                          <br><br>
 *                                          Default is `document`
 *
 *  @param  {string}    [mode]              The mode in which to use the function.
 *                                          <br><br>
 *                                          Possible values are:
 *                                          <br><br>
 *                                          - `all` (default)   - the function returns `all` matched elements<br>
 *                                          - `first`           - the function returns the first element from the set<br>
 *                                          - `matches`         - the function works like JavaScript's native .matches() method
 *
 *  @return {array|Element|null|boolean}    Based on mode:
 *                                          <br><br>
 *                                          - `all`             - returns an array of elements (empty array if none found)<br>
 *                                          - `first`           - returns first element or null if none found<br>
 *                                          - `matches`         - returns `TRUE` or `FALSE` based on whether the element matches or not the selector
 *
 *  @private
 */
const _query = (selector, context = document, mode = 'all') => {

    // helper to warn about invalid selectors
    const err = (sel, msg) => {
        if (typeof console !== 'undefined' && console.warn)
            console.warn(`ZebraJS: Invalid selector "${sel}"${msg ? ', ' + msg : ''}`);
    };

    // default to "all" mode
    if (!mode || (mode !== 'first' && mode !== 'matches')) mode = 'all';

    // pattern to match jQuery pseudo-selectors at the end of the selector
    // this handles the most common case: "div.foo:first", "ul > li:even", etc.
    const pseudo_pattern = /:(first|last|even|odd|eq|gt|lt|has|contains|visible|hidden|parent|header|input|text|checkbox|radio|password|submit|reset|button|file|image)\s*(\([^)]*\))?$/;

    let match, elements = [], filtered = [];

    try {

        // if non-string or empty selector stop early
        if (typeof selector !== 'string' || selector.trim() === '') return mode === 'first' ? null : [];

        selector = selector.trim();

        // if the selector contains pseudo-selectors
        if ((match = selector.match(pseudo_pattern)) !== null) {

            // the pseudo_name is the pseudo-selector (i.e. "first")
            // pseudo_arg will be the argument of the pseudo selector (if any) (
            // i.e the "text" in ":contains(text)"
            // base_selector will be the base CSS selector (if any) that precedes the pseudo-selector
            // i.e. the "div > li" in "div > li:first"
            const [, pseudo_name, pseudo_arg_raw] = match;
            const pseudo_arg = pseudo_arg_raw?.slice(1, -1) ?? null;
            const base_selector = selector.replace(pseudo_pattern, '').trim();

            // if base selector is empty after removing pseudo, use universal selector
            if (!base_selector) base_selector = '*';

            // if we are in "matches" mode
            if (mode === 'matches') {

                // if we have a positional pseudo-selector
                if (mode === 'matches' && ['first', 'last', 'even', 'odd', 'eq', 'gt', 'lt'].includes(pseudo_name)) {

                    err(`:${pseudo_name}`, 'positional pseudo-selectors not supported in .matches() context');

                    return false;

                }

                // test if the context element matches the base selector
                try {

                    // if
                    if (

                        // base selector is just '*'
                        base_selector === '*' ||

                        // or context matches the base selector
                        context.matches(base_selector)

                    // it matches everything
                    ) elements = [context];

                    // doesn't match, empty array
                    else elements = [];

                } catch (e) {

                    err(base_selector, e.message);

                    return false;

                }

            // for the other modes, search for elements in context
            } else

                try {

                    // get all elements that match the base CSS selector
                    elements = Array.from(context.querySelectorAll(base_selector));

                // if base selector is invalid, return null to fall back to normal error handling
                } catch (e) {

                    err(base_selector, e.message);

                    return mode === 'first' ? null : [];

                }

            // apply the jQuery pseudo-selector filter
            switch (pseudo_name) {

                case 'first':

                    if (elements.length > 0) filtered = [elements[0]];
                    break;

                case 'last':

                    if (elements.length > 0) filtered = [elements[elements.length - 1]];
                    break;

                case 'even':

                    filtered = elements.filter((_el, index) => index % 2 === 0);
                    break;

                case 'odd':

                    filtered = elements.filter((_el, index) => index % 2 === 1);
                    break;

                case 'eq':
                case 'gt':
                case 'lt':

                    // we treat the argument as a numeric value
                    let index = parseInt(pseudo_arg, 10);

                    // ...but if converting using parseInt yields "NaN" stop now
                    if (isNaN(index)) break;

                    if (pseudo_name === 'eq') {

                        // we're supporting negative indices (count from end)
                        if (index < 0) index = Math.max(0, elements.length + index);

                        // if value is in range, extract the element at position, or empty array otherwise
                        if (index >= 0 && index < elements.length) {
                            filtered = [elements[index]];
                            break;
                        }

                    }

                    // extract the matching elements otherwise, or whatever is already in elements if nothing matches
                    filtered = elements.filter((_el, idx) => (pseudo_name === 'gt' && idx > index) || (pseudo_name === 'lt' && idx < index));

                    break;

                // elements that contain a descendant matching the selector
                case 'has':

                    // only if the argument is available
                    if (pseudo_arg !== null && pseudo_arg !== undefined)

                        // filter for a match
                        filtered = elements.filter(el => {
                            try {
                                return el.querySelectorAll(pseudo_arg).length > 0;
                            } catch (e) {
                                return false;
                            }
                        });

                    break;

                // elements containing the specified text (case-sensitive)
                case 'contains':

                    // only if the argument is available
                    if (pseudo_arg !== null && pseudo_arg !== undefined)

                        // filter for a match
                        filtered = elements.filter(el => el.textContent.includes(pseudo_arg));

                    break;

                // elements that are visible (not display:none, visibility:hidden, or opacity:0)
                case 'visible':

                    // filter elements
                    filtered = elements.filter(el => {

                        // if element doesn't take up space
                        if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;

                        // check visibility
                        const style = window.getComputedStyle(el);

                        return style.display !== 'none' &&
                            style.visibility !== 'hidden' &&
                            style.opacity !== '0';

                    });

                    break;

                // elements that are hidden (opposite of :visible)
                case 'hidden':

                    // filter elements
                    filtered = elements.filter(el => {

                        // if element takes up space
                        if (el.offsetWidth === 0 && el.offsetHeight === 0) return true;

                        // check visibility
                        const style = window.getComputedStyle(el);

                        return style.display === 'none' ||
                            style.visibility === 'hidden' ||
                            style.opacity === '0';

                    });

                    break;

                // elements that have children (element or text nodes)
                case 'parent':

                    filtered = elements.filter(el => el.childNodes.length > 0);

                    break;

                // all header elements (h1-h6)
                case 'header':

                    filtered = elements.filter(el => /^H[1-6]$/.test(el.tagName));

                    break;

                // all form input elements
                case 'input':

                    filtered = elements.filter(el => /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName));

                    break;

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

                    filtered = elements.filter(el => el.tagName === 'INPUT' && el.type === pseudo_name);

                    break;

                default:

                    filtered = elements;

            }

            // when in "matches" mode, return now
            if (mode === 'matches') return filtered.length > 0;

            // return based on whether the "mode" argument is set to "first" or "all"
            return mode === 'first' ? (filtered.length > 0 ? filtered[0] : null) : filtered;

        }

        // no pseudo-selector found, use native CSS selectors

        // if in "matches" mode
        if (mode === 'matches')

            // test if context element matches the selector
            try {

                return context.matches(selector);

            } catch (e) {

                err(selector, e.message);

                return false;

            }

        // for "all" and "first" modes, search for elements
        return mode === 'first' ? context.querySelector(selector) : Array.from(context.querySelectorAll(selector));

    } catch (e) {

        err(selector, e.message);

        return mode === 'matches' ? false : (mode === 'first' ? null : []);

    }

};
