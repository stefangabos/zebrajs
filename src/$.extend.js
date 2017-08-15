/**
 *  Merges the properties of two or more objects together into the first object.
 *
 *  @example
 *
 *  // merge the properties of the last 2 objects into the first one
 *  $.extend({}, {foo:  'baz'}, {bar: 'biz'});
 *
 *  // the result
 *  // {foo: 'baz', bar: 'biz'}
 *
 *  @param  {object}    target  An object whose properties will be merged with the properties of the additional objects
 *                              passed as arguments to this method.
 *
 *  @return {object}    Returns an object with the properties of the object given as first argument merged with the
 *                      properties of additional objects passed as arguments to this method.
 *
 *  @memberof   ZebraJS
 *  @alias      $&period;extend
 *  @instance
 */
$.extend = function(target) {

    var i, property, result;

    // if the "assign" method is available, use it
    if (Object.assign) return Object.assign.apply(null, [target].concat(Array.prototype.slice.call(arguments, 1)));

    // if the "assign" method is not available

    // if converting the target argument to an object fails, throw an error
    try { result = Object(target); } catch (e) { throw new TypeError('Cannot convert undefined or null to object'); }

    // iterate over the method's arguments
    for (i = 1; i < arguments.length; i++)

        // if argument is an object
        if (typeof arguments[i] === 'object')

            // iterate over the object's properties
            for (property in arguments[i])

                // avoid bugs when hasOwnProperty is shadowed
                if (Object.prototype.hasOwnProperty.call(arguments[i], property))

                    // add property to the result
                    result[property] = arguments[i][property];

    // return the new object
    return result;

}
