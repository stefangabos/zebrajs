/**
 *  Gets the children of each element in the set of matched elements, optionally filtered by a selector.
 *
 *  @example
 *
 *  // always cache selectors
 *  // to avoid DOM scanning over and over again
 *  var element = $('#selector');
 *
 *  // get all the element's children
 *  var children_all = element.children();
 *
 *  // get all the "div" children of the element
 *  var children_filtered = element.children('div');
 *
 *  // since this method returns a ZebraJS object, we can use chaining
 *  element.children('div').addClass('someclass');
 *
 *  @param  {string}    selector    If the selector is supplied, the elements will be filtered by testing whether they
 *                                  match it.
 *
 *  @return {$}         Returns the children of each element in the set of matched elements, as a ZebraJS object, so you
 *                      can use chaining.
 */
this.children = function(selector) {

    var result = [], remove_id;

    // iterate through the set of matched elements
    elements.forEach(function(element) {

        remove_id = false;

        // if selector is specified and element does not have an ID
        if (selector && null === element.getAttribute('id')) {

            // generate and set a random ID for the element
            element.setAttribute('id', $this._random('id'));

            // set this flag so that we know to remove the randomly generated ID when we're done
            remove_id = true;

        }

        // get the element's children nodes which, optionally, match a given selector
        // and add them to the results array
        result = result.concat(Array.prototype.slice.call(selector ? element.parentNode.querySelectorAll('#' + element.id + '>' + selector) : element.children));

        // if present, remove the randomly generated ID
        if (remove_id) element.removeAttribute('id');

    });

    // return the result, as a ZebraJS object
    return $(result);

}
