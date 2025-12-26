/**
 *  If the first element in the set of matched elements is a `form` element, this method returns the encodes string of
 *  the form's elements and their respective values.
 *
 *  > Only "successful controls" are serialized to the string. No submit button value is serialized since the form was
 *  not submitted using a button. For a form element's value to be included in the serialized string, the element must
 *  have a name attribute. Values from checkboxes and radio buttons (inputs of type "radio" or "checkbox") are included
 *  only if they are checked. Data from file select elements is not serialized. Image inputs (`type="image"`) are
 *  serialized by their value attribute if present, but click coordinates (.x/.y) are not included since this is
 *  programmatic serialization, not an actual form submission.
 *
 *  This method creates a text string in standard URL-encoded notation.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const form = $('#form');
 *
 *  // serialize form's elements and their values
 *  const serialized = form.serialize();
 *
 *  @return {string}    Returns the serialized form as a query string that could be sent to a server in an Ajax request.
 *
 *  @memberof   ZebraJS
 *  @alias      serialize
 *  @instance
 */
$.fn.serialize = function() {

    // return quickly if an empty selection
    if (!this[0]) return '';

    const form = this[0];
    const result = [];

    // if element is a form
    if (typeof form === 'object' && form.nodeName.toUpperCase() === 'FORM')

        // iterate over the form's elements
        Array.from(form.elements).forEach(control => {

            // if element has a name, it is not disabled and it is not a "file", a "reset", a "submit" not a "button"
            if (control.name && !control.disabled && !['file', 'reset', 'submit', 'button'].includes(control.type))

                // if element is a multiple select
                if (control.type === 'select-multiple')

                    // iterate over the available options
                    Array.from(control.options).forEach(option => {

                        // add each selected option to the result
                        if (option.selected) result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(option.value))

                    });

                // if not a radio or a checkbox, or a checked radio/checkbox
                else if (!['checkbox', 'radio'].includes(control.type) || control.checked)

                    // add to result
                    result.push(encodeURIComponent(control.name) + '=' + encodeURIComponent(control.value));

        });

    // return the serialized result
    return result.join('&').replace(/\%20/g, '+');

}
