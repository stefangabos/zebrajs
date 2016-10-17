/**
 *  @todo   Needs to be written!
 */
this.attr = function(attribute, value) {

    var i, j;

    for (i in collection)

        for (j in attribute)

            collection[i].setAttribute(j, attribute[j]);

    return collection;

}
