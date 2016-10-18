/**
 *  @todo   Needs to be written!
 */
this.attr = function(attribute, value) {

    var i, j;

    for (i in elements)

        for (j in attribute)

            elements[i].setAttribute(j, attribute[j]);

    return elements;

}
