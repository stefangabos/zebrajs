/**
 *  Gets the current value of the first element in the set of matched elements or set the value of every matched element.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('selector');
 *
 *  // get the value of the first element in the list of matched elements
 *  // (if "element" was a select box with multiple selections allowed,
 *  // the returned value would be an array)
 *  var value = element.val();
 *
 *  // set the element's value
 *  element.val('foo');
 *
 *  // setting multiple values for multi-selects and checkboxes
 *  element.val(['option1', 'option2']);
 *
 *  @param  {mixed}     [value]     A string, a number, or an array of strings corresponding to the value of each matched
 *                                  element to set as selected/checked.
 *
 *  @return {ZebraJS|mixed}         If setting a value, this method returns the set of matched elements. If called without
 *                                  the argument, the method return the current value of the first element in the set of
 *                                  matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      val
 *  @instance
 */
$.fn.val = function(value) {

    var result = [];

    // if "value" argument is not specified
    if (undefined === value) {

        // if first element in the list of matched elements is a select box with the "multiple" attribute set
        if (this[0] && this[0].tagName.toLowerCase() === 'select' && this[0].multiple) {

            // add each selected option to the results array
            Array.prototype.slice.call(this[0].options).map(function(elem) {

                if (elem.selected && !elem.disabled) result.push(elem.value)

            });

            // return the values of selected options
            return result;

        }

        // for other elements, return the first element's value
        return this[0] ? this[0].value : '';

    }

    // if "value" argument is specified
    // iterate through the set of matched elements
    this.forEach(function(element) {

        // if value is not an array
        if (!Array.isArray(value))

            // set the value of of the current element
            element.value = value;

        // if value is an array, the current element is an checkbox/radio input and its value is in the array
        else if (element.tagName.toLowerCase() === 'input' && element.type && (element.type === 'checkbox' || element.type === 'radio') && element.value && value.indexOf(element.value) > -1)

            // mark the element as checked
            element.checked = true;

        // if element is a select box with the "multiple" attribute set
        else if (element.tagName.toLowerCase() === 'select' && element.multiple)

            // set the "selected" attribute to each matching option
            Array.prototype.slice.call(element.options).map(function(elem) {

                if (value.indexOf(elem.value) > -1) elem.selected = true;

            });

    });

    // return the set of matched elements
    return this;

}
