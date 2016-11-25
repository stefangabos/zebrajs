/**
 *  @todo   Needs to be written!
 *
 *  @memberof   ZebraJS
 *  @alias      ajax
 *  @instance
 */
$.ajax = function(url, options) {

    var defaults = {

            async: true,
            beforeSend: null,
            cache: true,
            complete: null,
            data: null,
            method: 'get',
            success: null

        }, httpRequest,

        // this callback functions is called as the AJAX call progresses
        callback = function() {

            // get the request's status
            switch (httpRequest.readyState) {

                // if the request is ready to be made
                case 1:

                    // if we have a callback function ready to handle this event, call it now
                    if (typeof options.beforeSend === 'function') options.beforeSend.call(null, httpRequest, options);
                    break;

                // if the request completed
                case 4:

                    // if the request was successfull and we have a callback function ready to handle this situation
                    if (httpRequest.status === 200 && typeof options.success === 'function')

                        // call that function now
                        options.success.call(null, httpRequest.responseText, httpRequest.status);

                    // if the request was unsuccessfull and we have a callback function ready to handle this situation
                    if (httpRequest.status !== 200 && typeof options.error === 'function')

                        // call that function now
                        options.success.call(null, httpRequest.status, httpRequest.responseText);

                    // if we have a callback function ready to handle the fact that the request completed (regardless if
                    // it was successful or not)
                    if (typeof options.complete === 'function')

                        // call that function now
                        options.complete.call(null, httpRequest, httpRequest.status);

                    break;
            }

        }, key, params = '';

    // extend the default options with the ones provided by the user
    options = $.extend(defaults, options);

    // the method of the request needs to be uppercase
    options.method = options.method.toUpperCase();

    // if data is provided and is an object
    if (options.data && typeof options.data === 'object') {

        // iterate over the object's properties
        for (key in options.data)

            // construct the query string
            params += (params !== '' ? '&' : '') + key + '=' + encodeURIComponent(options.data[key]);

        // change the data options to its string representation
        options.data = params;

    }

    // if we don't want to cache requests, append a query string to the existing ones
    if (!options.cache) options.data = options.data + (options.data ? '&' : '') + '_=' + (+new Date());

    // if the XMLHttpRequest object is available
    if (window.XMLHttpRequest) {

        // instantiate the XMLHttpRequest object
        httpRequest = new XMLHttpRequest();

        // this will be called as the call progresses
        httpRequest.onreadystatechange = callback;

        // set the request header
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        // this makes the call...
        httpRequest.open(options.method, url + (options.method === 'GET' && options.data ? '?' + options.data : ''), options.async);

        // with any additional parameters, if provided
        httpRequest.send(options.data);

    }

}
