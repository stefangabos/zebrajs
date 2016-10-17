/**
 *  @todo   Needs to be written!
 */
this.on = function(event_name, callback) {

    for (var i in collection)
        collection[i].addEventListener(event_name, callback.call(this));

}
