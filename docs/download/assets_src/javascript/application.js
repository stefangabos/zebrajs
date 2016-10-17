$(document).ready(function() {

    var

        // the template for the modules blocks
        template = $('script#template').html().trim(),

        // cache some selectors
        global_object = $('#object'),
        modules_container = $('#packager .row:first-child'),
        total_download_size_container = $('.result strong span'),
        downloadable_content = $('textarea'),

        // extract all the available methods
        extract_methods = function() {

            var source = '@import "../../../../dist/zebra.min.js"',
                source_length = source.length,
                i, tmp = '', matches, matching_brackets = false, method_name, methods = {};

            // go over the source code, character by character
            for (i = 0; i < source_length; i++) {

                // concatenate characters
                tmp += source[i];

                // if we're not looking for a matching closing bracket and we found a method
                if (matching_brackets === false && (matches = tmp.match(/this\.([^\(]+?)=function\([^\)]*?\)\{/))) {

                    // we start looking for the matching closing bracket
                    tmp = '';
                    matching_brackets = 1;

                // if we were looking for matching brackets and we found an opening bracket
                } else if (matching_brackets !== false && source[i] === '{') matching_brackets++;

                // if we were looking for matching brackets and we found an closing bracket
                else if (matching_brackets !== false && source[i] === '}') matching_brackets--;

                // if we found a method
                if (matching_brackets === 0 && tmp !== '') {

                    // this is the method's name
                    method_name = matches[0].match(/^this\.(.*?)\=/)[1];

                    // add the global function this way
                    if (method_name === 'get') methods[method_name] = (source.substr(0, i) + '}}};').trim();

                    // add the methods
                    else methods[method_name] = matches[0] + tmp + ';';

                    // start looking for other methods
                    tmp = '';
                    matching_brackets = false;

                }

            }

            // return the array of methods
            return methods;

        },

        // parses the modules template and replaces placeholders with actual values
        parse_template = function(variables) {

            var content = template, i;

            // iterate over the variables object given as argument
            for (i in variables)

                // replace placeholders with values
                content = content.replace(new RegExp('{{' + i + '}}', 'g'), variables[i]);

            // return HTML ready to be inserted into the DOM
            return content;

        },

        // get an object with the existing methods
        methods = extract_methods(),

        modules, block, i,

        manage_modules = function() {

            var code = '', global_object_name = global_object.val().trim();

            // iterate over the existing modules
            modules.each(function() {

                // the ID of the current module
                var id = this.getAttribute('id').replace(/method\_/, '');

                // if checkbox is checked
                if (this.checked)

                    // add module's source to the existing source code
                    code += methods[id === '$' ? 'get' : id];

            });

            // if we have a global object name
            if (global_object_name !== '')

                // replace instances of "$" in the source code (with those of the given name)
                downloadable_content.val(code.replace(/\B\$=/g, global_object_name + '=').replace(/\B\$\(/g, global_object_name + '(').replace(/instanceof \$/g, 'instance of ' + global_object_name));

            // otherwise simply set the downloadable content
            else downloadable_content.val(code);

            // update the total downloadable size
            total_download_size_container.html(downloadable_content.val().length);

        };

    // iterate over the available methods
    for (i in methods)

        // if this is not the global object
        if (i !== 'get')

            // generate the HTML for the module, based on the template
            block = $(parse_template({
                method: methods[i].match(/^this\.(.*?)\=/)[1],
                size: methods[i].length

            // ...and add it to the section of optional modules
            })).appendTo(modules_container);

        // if this is the global object
        else {

            // generate the HTML, based on the template
            block = $('.well', $(parse_template({
                method: '$',
                size: methods[i].length + 3

            // ...and add it to the section of required modules
            }))).appendTo($('.required-modules'));

            // additionally, disable the checkbox
            $('input', block).attr({
                checked: 'checked',
                readonly: 'readonly',
                disabled: 'disabled'
            });

        }

    // toggling a checkbox, means generating the source code and updating the downloadable size
    $('.well').on('change', 'input', manage_modules);

    // update source code when global object's name is changed
    global_object.on('blur', manage_modules);

    // now that all modules were added cache them
    modules = $('.well input');

    // generate initial source code
    manage_modules();

});
