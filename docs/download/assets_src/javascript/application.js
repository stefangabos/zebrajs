$(document).ready(function() {

    var

        // the template for the modules blocks
        template = $('script#template').html().trim(),

        // cache some selectors
        global_object = $('#object'),
        modules_container = $('#packager .optional-methods'),
        helper_modules_container = $('#packager .private-methods'),
        total_download_size_container = $('.result strong span'),
        checkboxes,
        downloadable_content = $('textarea'),

        // todo: this needs to be built automatically
        dependencies = {
            'addClass':     ['_class'],
            'after':        ['_dom_insert'],
            'append':       ['_dom_insert'],
            'appendTo':     ['_dom_insert'],
            'before':       ['_dom_insert'],
            'children':     ['_dom_search', '_random'],
            'height':       ['css'],
            'insertAfter':  ['_dom_insert'],
            'insertBefore': ['_dom_insert'],
            'next':         ['_dom_search', '_random'],
            'prepend':      ['_dom_insert'],
            'prependTo':    ['_dom_insert'],
            'prev':         ['_dom_search', '_random'],
            'removeClass':  ['_class'],
            'siblings':     ['_dom_search', '_random'],
            'toggleClass':  ['_class'],
            'width':        ['css']
        },

        reversed_dependencies = {}, methods = {}, private_methods = {},

        // extract all the available methods
        extract_methods = function() {

            var source = '@import "../../../../dist/zebra.min.js"',
                source_length = source.length,
                i, tmp = '', is_private_method, matches, matching_brackets = false, method_name;

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

                    // is this a private method? (starting with an underscore)
                    is_private_method = method_name.indexOf('_') === 0;

                    // add the global function this way
                    if (method_name === 'get') methods[method_name] = (source.substr(0, i) + '}}};').trim();

                    // store private methods
                    else if (is_private_method) private_methods[method_name] = matches[0] + tmp + ';';

                    // store public methods
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

        wells, modules, block, i, j,

        manage_dependencies = function(module, checked) {

            var i;

            // if module was specified
            if (undefined === module)

                // iterate over the existing modules
                modules.each(function() {

                    // the ID of the current module
                    var id = this.getAttribute('id').replace(/method\_/, '');

                    // if checkbox is checked
                    if (this.checked) manage_dependencies(id, true);

                });

            // if this module requires other modules and we've just checked it
            else if (undefined !== dependencies[module] && checked)

                // iterate over the rules
                for (i in dependencies[module])

                    // iterate over the existing checkboxes
                    checkboxes.each(function() {

                        // check the modules required by this module
                        if (this.getAttribute('id') === 'method_' + dependencies[module][i]) this.checked = true;

                    });

            // if there are modules requiring this module and we've just unchecked it
            else if (undefined !== reversed_dependencies[module] && !checked)

                // iterate over the rules
                for (i in reversed_dependencies[module])

                    // uncheck all the modules that require this module
                    checkboxes.each(function() {
                        if (this.getAttribute('id') === 'method_' + reversed_dependencies[module][i]) this.checked = false;
                    });

        },

        manage_modules = function(e) {

            var code = '', global_object_name = global_object.val().trim();

            // if this method is called when selecting/deselecting a module, compute the module's dependencies
            if (undefined !== e) manage_dependencies(e.target.getAttribute('id').replace(/^method\_/, ''), e.target.checked);

            // scan all modules and handle the dependencies for all of them, depending on their state
            else manage_dependencies();

            // iterate over the existing modules
            modules.each(function(index) {

                // the ID of the current module
                var id = this.getAttribute('id').replace(/method\_/, '');

                // if checkbox is checked
                if (this.checked) {

                    // highlight the checkbox's container
                    wells[index].classList.add('selected');

                    // add module's source to the existing source code
                    code += id.indexOf('_') === 0 ? private_methods[id] : (methods[id === '$' ? 'get' : id]);

                // if not checked, remove highlight from checkbox's container
                } else wells[index].classList.remove('selected');

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

    // get an object with the existing methods
    extract_methods();

    // iterate over the available public methods
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

    // iterate over the available private methods
    for (i in private_methods)

        // generate the HTML for the module, based on the template
        block = $(parse_template({
            method: private_methods[i].match(/^this\.(.*?)\=/)[1],
            size: private_methods[i].length

        // ...and add it to the section of optional modules
        })).appendTo(helper_modules_container);

    // the wells containing the checkboxes
    wells = $('.well');

    // now that all modules were added cache them
    modules = $('.well input');

    // toggling a checkbox, means generating the source code, selecting/deselecting dependencies and updating the downloadable size
    $('.well').on('change', 'input', manage_modules);

    // update source code when global object's name is changed
    global_object.on('blur', manage_modules);

    // handle "select all" button
    $('a.select-all').on('click', function(e) {

        e.preventDefault();

        // iterate over all available modules
        modules.each(function() {

            // check each module, unless this is the global object
            if (this.getAttribute('id') !== 'method_$') this.checked = true;

        });

        // generate source code
        manage_modules();

    });

    // handle "deselect all" button
    $('a.deselect-all').on('click', function(e) {

        e.preventDefault();

        // iterate over all available modules
        modules.each(function() {

            // uncheck each module, unless this is the global object
            if (this.getAttribute('id') !== 'method_$') this.checked = false;

        });

        // generate source code
        manage_modules();

    });

    // cache all the checkboxes
    checkboxes = $('input[type="checkbox"]');

    // iterate over the existing dependencies
    for (i in dependencies)

        // iterate over the associated methods
        for (j in dependencies[i]) {

            // create a reverse lookup array to be used when deselecting a method that it is used by other methods,
            // so we can also deselect those
            if (undefined === reversed_dependencies[dependencies[i][j]]) reversed_dependencies[dependencies[i][j]] = [];
            if (reversed_dependencies[dependencies[i][j]].indexOf(i) === -1) reversed_dependencies[dependencies[i][j]].push(i);
        }

    // generate initial source code
    manage_modules();

});
