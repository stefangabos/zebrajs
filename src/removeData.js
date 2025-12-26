/**
 *  Removes a previously-stored piece of data from the matched elements.
 *
 *  The `.removeData()` method allows us to remove values that were previously set using `.data()`. When called with
 *  the name of a key, it removes that particular value. When called without any arguments, it removes all data.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  const element = $('#selector');
 *
 *  // set some data
 *  element.data('foo', 'bar');
 *  element.data('baz', {key: 'value'});
 *
 *  // remove specific data
 *  element.removeData('foo');
 *
 *  // remove all data
 *  element.removeData();
 *
 *  @param  {string}    [name]  A string naming the piece of data to remove. If omitted, all data will be removed.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      removeData
 *  @instance
 */
$.fn.removeData = function(name) {

    // iterate through the set of matched elements
    this.forEach(element => {

        // if a specific name is provided
        if (undefined !== name) {

            // make sure the name follows the Dataset API specs
            // http://www.w3.org/TR/html5/dom.html#dom-dataset
            name = name

                // replace "-" followed by an ascii letter to that letter in uppercase
                .replace(/\-([a-z])/ig, (match, letter) => letter.toUpperCase())

                // remove any left "-"
                .replace(/\-/g, '');

            // try to remove from WeakMap storage
            if ($._data_storage) {

                const element_data = $._data_storage.get(element);

                // if we have data for this element
                if (element_data && element_data[name] !== undefined)

                    // remove the specific property
                    delete element_data[name];

            }

            // try to remove from dataset
            if (element.dataset && element.dataset[name] !== undefined)

                // remove the data attribute
                delete element.dataset[name];

        // if no name is provided, remove all data
        } else {

            // remove all WeakMap data for this element
            if ($._data_storage) $._data_storage.delete(element);

            // remove all dataset attributes
            if (element.dataset) {

                // get all data attribute names
                const keys = Object.keys(element.dataset);

                // remove each one
                keys.forEach(key => {
                    delete element.dataset[key];
                });

            }

        }

    });

    // return the set of matched elements, for chaining
    return this;

}
