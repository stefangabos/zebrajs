$(document).ready(function() {

    var

        // the template for the modules blocks
        template = $('script#template').html().trim(),

        // cache some selectors
        global_object = $('#object'),
        modules_container = $('#packager .optional-methods'),
        helper_modules_container = $('#packager .helper-methods'),
        private_modules_container = $('#packager .private-methods'),
        total_download_size_container = $('.result strong span'),
        checkboxes,
        downloadable_content = $('textarea'),

        // dependencies between methods
        dependencies = {

            // class-related methods
            'addClass':     ['_class'],
            'removeClass':  ['_class'],
            'toggleClass':  ['_class'],

            // DOM insertion methods
            'after':        ['_dom_insert'],
            'append':       ['_dom_insert'],
            'appendTo':     ['_dom_insert'],
            'before':       ['_dom_insert'],
            'insertAfter':  ['_dom_insert'],
            'insertBefore': ['_dom_insert'],
            'prepend':      ['_dom_insert'],
            'prependTo':    ['_dom_insert'],
            'replaceWith':  ['_dom_insert'],
            'wrap':         ['_dom_insert'],

            // traversal/navigation methods
            'children':     ['_dom_search', '_add_prev_object'],
            'siblings':     ['_dom_search', '_add_prev_object'],
            'next':         ['_dom_search', '_add_prev_object'],
            'prev':         ['_dom_search', '_add_prev_object'],
            'first':        ['_add_prev_object'],
            'eq':           ['get', '_add_prev_object'],
            'not':          ['is', '_add_prev_object'],
            'closest':      ['_add_prev_object'],
            'parent':       ['_add_prev_object'],
            'parents':      ['_add_prev_object'],
            'find':         ['_add_prev_object'],

            // element manipulation methods
            'clone':        ['on', '_clone_data_and_events'],
            'detach':       ['clone', 'remove'],
            'remove':       ['off'],
            'unwrap':       ['parent', 'replaceWith'],

            // dimension methods
            'height':       ['css'],
            'width':        ['css'],

            // CSS and animation methods (these need the unitless properties array)
            'css':          ['_unitless_properties'],
            'animate':      ['one', '_unitless_properties'],
            'stop':         ['off'],

            // Event methods
            'one':          ['on']

        },

        reversed_dependencies = {}, methods = {}, private_methods = {}, helper_methods = {}, script_header, script_footer, unitless_properties = '',

        // extract all the available methods
        extract_methods = function() {

            var source = '@import "zebra.min.js"'.replace(/\(([a-z]{1})\.fn=\{version\:\"(.*?)\"\}\)/, '$1.fn={version:"$2"};$1.fn'),
                source_length = source.length,
                i, tmp = '', is_private_method, is_helper_method, matches, matching_brackets = false, method_name;

            // go over the source code, character by character
            for (i = 0; i < source_length; i++) {

                // concatenate characters
                tmp += source[i];

                // if we're not looking for a matching closing bracket and we found a method
                if (matching_brackets === false && (matches = tmp.match(/[a-z$]{1}(\.fn)?\.([^\=]+?)\s*=\s*function\([^\)]*?\)\s*\{/))) {

                    // we start looking for the matching closing bracket
                    tmp = '';
                    matching_brackets = 1;

                // if we were looking for matching brackets and we found an opening bracket
                } else if (matching_brackets !== false && source[i] === '{') matching_brackets++;

                // if we were looking for matching brackets and we found an closing bracket
                else if (matching_brackets !== false && source[i] === '}') matching_brackets--;

                // if we found a method
                if (matching_brackets === 0 && tmp !== '') {

                    // the start of the script (everything until the first method)
                    if (!method_name) script_header = source.substring(0, source.indexOf(matches[0]) - 1);

                    is_helper_method = matches[0].indexOf('.fn') === -1;

                    // this is the method's name
                    method_name = matches[0].match(/^[a-z$]{1}\.(fn\.)?(.*?)\s*=/)[2];

                    // is this a method_name method? (starting with an underscore)
                    is_private_method = method_name.indexOf('_') === 0;

                    // store private methods
                    if (is_private_method) private_methods[method_name] = matches[0] + tmp;

                    // store helper methods
                    else if (is_helper_method) helper_methods[method_name] = matches[0] + tmp;

                    // store public methods
                    else methods[method_name] = matches[0] + tmp;

                    // start looking for other methods
                    tmp = '';
                    matching_brackets = false;

                }

            }

            // the end of the main script - everything after the last method
            script_footer = tmp;

            // extract the unitless properties array
            unitless_properties = source.match(/,(\["animationIterationCount"[^\]]+\])/)[1];

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

            var code = script_header, global_object_name = global_object.val().trim(), helper_methods_code = '';

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

                    // if this is not the "$" module (which we're adding via script_header and script_footer)
                    if (id !== '$')

                        // special handling for unitless array
                        if (id === '_unitless_properties') {
                            if (unitless_properties) helper_methods_code += (helper_methods_code !== '' ? ',' : '') + unitless_properties;
                        }

                        // helper methods go to the end, so add them to a different place
                        else if ($(this).next('strong').text().match(/^\$/) && helper_methods[id]) helper_methods_code += (helper_methods_code !== '' ? ',' : '') + helper_methods[id];

                        // add module's source to the existing source code
                        else code += ',' + (id.indexOf('_') === 0 ? private_methods[id] : methods[id]);

                // if not checked, remove highlight from checkbox's container
                } else wells[index].classList.remove('selected');

            });

            // add helper methods and the script's footer
            code += ',' + helper_methods_code + (helper_methods_code === '' ? script_footer.substring(1) : script_footer);

            // if we have a global object name
            if (global_object_name !== '')

                // replace instances of "$" in the source code (with those of the given name)
                downloadable_content.val(code.replace(/window\.\$/, 'window.' + global_object_name));

            // otherwise simply set the downloadable content
            else downloadable_content.val(code);

            // update the total downloadable size
            total_download_size_container.html(downloadable_content.val().length);

        };

    // get an object with the existing methods
    extract_methods();

    // add the required $ method
    block = $('.well', $(parse_template({
        method: '$',
        size: script_header.length + script_footer.length,
        prefix: '',
        readonly: '',
        doclink: ''

    // ...and add it to the section of required modules
    }))).appendTo($('.required-modules'));

    // additionally, disable the checkbox
    $('input', block).attr({
        checked: 'checked',
        readonly: 'readonly',
        disabled: 'disabled'
    });

    // iterate over the available public methods
    Object.keys(methods).sort().forEach(function(i) {

        var method_name = methods[i].match(/^[a-z$]{1}\.fn\.(.*?)\s*=/)[1];

        // generate the HTML for the module, based on the template
        block = $(parse_template({
            method: method_name,
            size: methods[i].length + 1, // the ',' prefix
            prefix: '',
            readonly: '',
            doclink: ' | <a href="../ZebraJS.html#' + method_name + '">documentation</a>'

        // ...and add it to the section of optional modules
        })).appendTo(modules_container);

    });

    // iterate over the available helper methods
    Object.keys(helper_methods).sort().forEach(function(i) {

        var method_name = helper_methods[i].match(/^[a-z$]{1}\.(.*?)\s*=/)[1];

        // generate the HTML for the module, based on the template
        block = $(parse_template({
            method: method_name,
            size: helper_methods[i].length + 1, // the ',' prefix
            prefix: '$.',
            readonly: '',
            doclink: ' | <a href="../ZebraJS.html#$.' + method_name + '">documentation</a>'

        // ...and add it to the section of optional modules
        })).appendTo(helper_modules_container);

    });

    // iterate over the available private methods
    Object.keys(private_methods).sort().forEach(function(i) {

        var method_name = private_methods[i].match(/^[a-z$]{1}\.fn\.(.*?)\s*=/)[1];

        // generate the HTML for the module, based on the template
        block = $(parse_template({
            method: method_name,
            size: private_methods[i].length + 1, // the ',' prefix
            prefix: '',
            readonly: 'readonly',
            doclink: ''

        // ...and add it to the section of optional modules
        })).appendTo(private_modules_container);

    });

    // add the unitless array
    block = $(parse_template({
        method: '_unitless_properties',
        size: unitless_properties.length + 1,
        prefix: '',
        readonly: '',
        doclink: ''
    })).appendTo(private_modules_container);

    // update the checkbox ID to match the dependency system
    $('input', block).attr('id', 'method__unitless_properties');

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
