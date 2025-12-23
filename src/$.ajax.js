/**
 *  Performs an asynchronous HTTP (Ajax) request.
 *
 *  @example
 *
 *  $.ajax({
 *      url: 'http://mydomain.com/index.html',
 *      method: 'GET',
 *      data: {
 *          foo: 'baz',
 *          bar: 'bax'
 *      },
 *      error: function() {
 *          alert('error!');
 *      },
 *      success: function() {
 *          alert('success!');
 *      }
 *  });
 *
 *  @param  {string}    [url]       The URL to which the request is to be sent.<br>
 *                                  You may skip it and set it in the *options* object
 *
 *  @param  {object}    options     A set of key/value pairs that configure the Ajax request.
 *
 *  |  Property         |   Type                |   Description
 *  |-------------------|-----------------------|----------------------------------------------
 *  |   **url**         |   *string*            |   The URL to which the request is to be sent.
 *  |   **async**       |   *boolean*           |   By default, all requests are sent *asynchronously*. If you need synchronous requests, set this option to `false`. Note that synchronous requests may temporarily lock the browser, disabling any actions while the request is active.<br>Default is `true`
 *  |   **beforeSend**  |   *function*          |   A pre-request callback function that can be used to modify the XMLHTTPRequest object before it is sent. Use this to set custom headers, etc. The XMLHTTPRequest object and settings objects are passed as arguments. Returning false from this function will cancel the request.
 *  |   **cache**       |   *boolean*           |   If set to `false`, will force requested pages not to be cached by the browser. Note: Setting cache to `false` will only work correctly with `HEAD` and `GET` requests. It works by appending "_={timestamp}" to the GET parameters. The parameter is not needed for other types of requests.<br>Default is `true`
 *  |   **complete**    |   *function*          |   A function to be called when the request finishes (after `success` and `error` callbacks are executed). The function gets passed two arguments: The XMLHTTPRequest object and a string with the status of the request.
 *  |   **data**        |   *string* / *object* |   Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET requests. Object must be `key/value` pairs, where `value` can also be an array.
 *  |   **error**       |   *function*          |   A function to be called if the request fails. The function receives two arguments: The XMLHttpRequest object and a string describing the type of error that occurred.
 *  |   **method**      |   *string*            |   The HTTP method to use for the request (e.g. `POST`, `GET`, `PUT`).
 *  |   **success**     |   *function*          |   A function to be called if the request succeeds. The function gets passed two arguments: the data returned from the server and a string describing the status.
 *
 *
 *  @memberof   ZebraJS
 *  @alias      $&period;ajax
 *  @instance
 */
$.ajax = function(url, options) {

    var defaults = {

            async: true,
            beforeSend: null,
            cache: true,
            complete: null,
            data: null,
            error: null,
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

                    // if the request was successful and we have a callback function ready to handle this situation
                    if (httpRequest.status === 200 && typeof options.success === 'function')

                        // call that function now
                        options.success.call(null, httpRequest.responseText, httpRequest.status);

                    // if the request was unsuccessful and we have a callback function ready to handle this situation
                    if (httpRequest.status !== 200 && typeof options.error === 'function')

                        // call that function now
                        options.error.call(null, httpRequest.status, httpRequest.responseText);

                    // if we have a callback function ready to handle the fact that the request completed (regardless if
                    // it was successful or not)
                    if (typeof options.complete === 'function')

                        // call that function now
                        options.complete.call(null, httpRequest, httpRequest.status);

                    break;
            }

        },

        // helper function to recursively serialize objects and arrays
        serialize = function(obj, prefix) {
            var str = [], k, v, key_name;

            for (k in obj)

                if (obj.hasOwnProperty(k)) {

                    v = obj[k];

                    // build the key - use prefix if available (for nested objects/arrays)
                    key_name = prefix ? prefix + '[' + k + ']' : k;

                    // if value is an object or array, serialize it recursively
                    if (v !== null && typeof v === 'object' && !v.nodeType) str.push(serialize(v, key_name));

                    // otherwise, encode the key-value pair
                    else str.push(encodeURIComponent(key_name) + '=' + encodeURIComponent(v));

                }

            return str.join('&');
        };

    // if method is called with a single argument
    if (!options) {

        // then "options" is actually the first argument
        options = url;

        // and the "url" is taken from the "options" object
        url = options.url;

    }

    // extend the default options with the ones provided by the user
    options = $.extend(defaults, options);

    // the method of the request needs to be uppercase
    options.method = options.method.toUpperCase();

    // if data is provided and is an object
    if (options.data && typeof options.data === 'object')

        // serialize the data object (handles nested objects and arrays)
        options.data = serialize(options.data);

    // if we don't want to cache requests, append a query string to the existing ones
    if (!options.cache) options.data = options.data + (options.data ? '&' : '') + '_=' + (+new Date());

    // if the XMLHttpRequest object is available
    if (window.XMLHttpRequest) {

        // instantiate the XMLHttpRequest object
        httpRequest = new XMLHttpRequest();

        // this will be called as the call progresses
        httpRequest.onreadystatechange = callback;

        // this makes the call...
        httpRequest.open(options.method, url + (options.method === 'GET' && options.data ? '?' + options.data : ''), options.async);

        // set the request header
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        // with any additional parameters, if provided
        httpRequest.send(options.data);

    }

}
