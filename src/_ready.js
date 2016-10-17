/**
 *  @todo   Needs documentation!
 */
this.ready = function(callback) {

    if (document.readyState === 'complete' || document.readyState !== 'loading') callback();

    else document.addEventListener('DOMContentLoaded', callback);

}
