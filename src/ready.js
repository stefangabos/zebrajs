/**
 *  Specifies a function to execute when the DOM is fully loaded.
 *
 *  @example
 *
 *  $(document).ready(function() {
 *      // code to be executed when the DOM is ready
 *  });
 *
 *  @param  {function}  callback    A function to execute when the DOM is ready and safe to manipulate.
 *
 *  @return {ZebraJS}   Returns the set of matched elements.
 *
 *  @memberof   ZebraJS
 *  @alias      ready
 *  @instance
 */
$.fn.ready = function(callback) {

    // if DOM is already ready, fire the callback now
    if (document.readyState === 'complete' || document.readyState !== 'loading') callback();

    // otherwise, wait for the DOM and execute the callback when the it is ready
    else document.addEventListener('DOMContentLoaded', callback);

    // return the set of matched elements
    return this;

}
