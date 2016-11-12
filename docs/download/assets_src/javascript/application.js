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
            'replaceWith':  ['_dom_insert'],
            'siblings':     ['_dom_search', '_random'],
            'toggleClass':  ['_class'],
            'width':        ['css'],
            'wrap':         ['_dom_insert']
        },

        reversed_dependencies = {}, methods = {}, private_methods = {},

        // extract all the available methods
        extract_methods = function() {

            var source = '!function(){var a=0,b={};$=function(c,d,e){"use strict";if(!(this instanceof $)){if("string"==typeof c){if(0===c.indexOf("<"))return d=document.createElement("div"),d.innerHTML=c,new $(d.firstChild);if(d?d instanceof $&&(d=d.get(0)):d=document,c.match(/^\#[^\s]+$/))return new $(d.getElementById(c.substr(1)));if(e)try{return new $(d.querySelector(c))}catch(a){return!1}try{return new $(Array.prototype.slice.call(d.querySelectorAll(c)))}catch(a){return!1}}else{if("object"==typeof c&&(c instanceof Document||c instanceof Element||c instanceof Text||c instanceof Window)||Array.isArray(c))return new $(c);if(c instanceof $)return c}return!1}if(c){var f=this,g=c instanceof Document||c instanceof Element||c instanceof Text||c instanceof Window?[c]:[].concat(c);this.get=function(a){return void 0!==a?g[a]:g},this._class=function(a,b){return b=b.split(" "),g.forEach(function(c){b.forEach(function(b){c.classList["add"===a||"toggle"===a&&!c.classList.contains(b)?"add":"remove"](b)})}),f},this._dom_insert=function(a,b){if(a instanceof $)a=a.get();else if(a instanceof Element||a instanceof Text)a=[a];else if("wrap"!==b&&"replace"!==b||"string"!=typeof a){if("string"!=typeof a)return!1}else a=$(a).get();return g.forEach(function(c){"string"==typeof a?c.insertAdjacentHTML(("append"===b?"before":"after")+("before"===b||"prepend"===b?"begin":"end"),a):a.forEach(function(a,d){switch(b){case"after":case"replace":case"wrap":c.parentNode.insertBefore(d<g.length-1?a.cloneNode(!0):a,c.nextSibling);break;case"append":c.appendChild(d<g.length-1?a.cloneNode(!0):a);break;case"before":c.parentNode.insertBefore(d<g.length-1?a.cloneNode(!0):a,c);break;case"prepend":c.insertBefore(d<g.length-1?a.cloneNode(!0):a,c.firstChild)}"wrap"!==b&&"replace"!==b||(c.parentNode.removeChild(c),"wrap"===b&&a.appendChild(c))})}),f},this._dom_search=function(a,b){var c,d,e,h=[];return g.forEach(function(g){c=!1,b&&(d="children"===a?g:g.parentNode,null===d.getAttribute("id")&&d.setAttribute("id",f._random("id")),c=!0),"siblings"===a?h=h.concat(Array.prototype.filter.call(b?g.parentNode.querySelectorAll("#"+g.parentNode.id+">"+b):g.parentNode.children,function(a){return a!==g})):"children"===a?h=h.concat(Array.prototype.slice.call(b?g.parentNode.querySelectorAll("#"+g.id+">"+b):g.children)):"previous"!==a&&"next"!==a||(b?(e=[],Array.prototype.filter.call(g.parentNode.querySelectorAll("#"+g.parentNode.id+">"+b),function(b){return"next"===a?(b===g||e.indexOf(g)>-1)&&e.push(b):e.indexOf(g)===-1&&e.push(b)}),h=h.concat(e.length>=2?e[e.length-2]:[])):h=h.concat([g[("next"===a?"next":"previous")+"ElementSibling"]])),c&&d.removeAttribute("id")}),$(h)},this._random=function(b){return a>Number.MAX_VALUE&&(a=0),b+"_"+a++},this.addClass=function(a){return this._class("add",a)},this.after=function(a){return this._dom_insert(a,"after")},this.ajax=function(){},this.append=function(a){return this._dom_insert(a,"append")},this.appendTo=function(a){return $(a)._dom_insert(this,"append")},this.attr=function(a,b){var c;if("object"==typeof a)g.forEach(function(b){for(c in a)b.setAttribute(c,a[c])});else if("string"==typeof a){if(void 0===b)return g[0].getAttribute(a);g.forEach(function(c){b===!1||null===b?c.removeAttribute(a):c.setAttribute(a,b)})}return f},this.before=function(a){return this._dom_insert(a,"before")},this.children=function(a){return this._dom_search("children",a)},this.clone=function(){},this.closest=function(){},this.css=function(a,b){var c,d;if("object"==typeof a)g.forEach(function(b){for(c in a)b.style[c]=a[c]});else{if(void 0===b)return d=window.getComputedStyle(g[0]),d[a];g.forEach(function(c){b===!1||null===b?c.style[a]=null:c.style[a]=b})}return f},this.data=function(){},this.each=function(a){for(var b=0;b<g.length;b++)if(a.call(g[b],b)===!1)return},this.find=function(a){var b=[];return g.forEach(function(c){"object"==typeof a&&a instanceof $?a.get().forEach(function(a){a.isSameNode(c)&&b.push(c)}):"object"==typeof a&&(a instanceof Document||a instanceof Element||a instanceof Window)?a.isSameNode(c)&&b.push(c):b.push(c.querySelector(a))}),b=b.filter(function(a){return null!==a}),$(b)},this.first=function(){return $(g[0])},this.hasClass=function(a){for(var b=0;b<g.length;b++)if(g[b].classList.contains(a))return!0;return!1},this.height=function(a){return a?this.css("height",a+(parseFloat(a)===a?"px":"")):parseFloat(window.getComputedStyle(g[0],null).height)||0},this.html=function(a){return a?(g.forEach(function(b){b.innerHTML=a}),f):g[0].innerHTML},this.insertAfter=function(a){return $(a)._dom_insert(this,"after")},this.insertBefore=function(a){return $(a)._dom_insert(this,"before")},this.mq=function(){},this.next=function(a){return this._dom_search("next",a)},this.off=function(a,c){var d=a.split("."),e=a.split(" ");return a=d[1],d=d[1]||"",g.forEach(function(a){e.forEach(function(e){void 0!==b[e]&&b[e].forEach(function(b){b[0]!==a||void 0!==c&&c!==b[1]||d!==b[2]||a.removeEventListener(e,b[3]||b[1])})})}),f},this.offset=function(){var a=g[0].getBoundingClientRect();return{top:a.top+window.pageYOffset-document.documentElement.clientTop,left:a.left+window.pageXOffset-document.documentElement.clientLeft}},this.on=function(a,c,d){var e,h=a.split("."),i=a.split(" ");return a=h[0],h=h[1]||"",void 0===d&&(d=c),g.forEach(function(a){i.forEach(function(f){void 0===b[f]&&(b[f]=[]),"string"==typeof c?(e=function(a){this!==a.target&&a.target.matches(c)&&d.apply(a.target)},a.addEventListener(f,e)):a.addEventListener(f,d),b[f].push([a,d,h,e])})}),f},this.outerHeight=function(a){var b=window.getComputedStyle(g[0]);return parseFloat(b.height)+parseFloat(b.paddingTop)+parseFloat(b.paddingBottom)+parseFloat(b.borderTopWidth)+parseFloat(b.borderBottomWidth)+(a?parseFloat(b.marginTop)+parseFloat(b.marginBottom):0)||0},this.outerWidth=function(a){var b=window.getComputedStyle(g[0]);return parseFloat(b.width)+parseFloat(b.paddingLeft)+parseFloat(b.paddingRight)+parseFloat(b.borderLeftWidth)+parseFloat(b.borderRightWidth)+(a?parseFloat(b.marginLeft)+parseFloat(b.marginRight):0)||0},this.parent=function(a){var b=[];return g.forEach(function(c){a&&!c.parentNode.matches(a)||b.push(c.parentNode)}),$(b)},this.parents=function(){},this.position=function(){return{left:parseFloat(g[0].offsetLeft),top:parseFloat(g[0].offsetTop)}},this.prepend=function(a){return this._dom_insert(a,"prepend")},this.prependTo=function(a){return $(a)._dom_insert(this,"prepend")},this.prev=function(a){return this._dom_search("previous",a)},this.ready=function(a){"complete"===document.readyState||"loading"!==document.readyState?a():document.addEventListener("DOMContentLoaded",a)},this.remove=function(){},this.removeClass=function(a){return this._class("remove",a)},this.replaceWith=function(a){return this._dom_insert(a,"replace")},this.scrollLeft=function(){},this.scrollTop=function(){},this.serialize=function(){},this.siblings=function(a){return this._dom_search("siblings",a)},this.text=function(a){return a?(g.forEach(function(b){b.textContent=a}),f):g[0].textContent},this.toggleClass=function(a){return this._class("toggle",a)},this.trigger=function(){},this.unwrap=function(){},this.val=function(a){return void 0===a?g[0].value:(g.forEach(function(b){b.value=a}),f)},this.width=function(a){return a?this.css("width",a+(parseFloat(a)===a?"px":"")):parseFloat(window.getComputedStyle(g[0],null).width)||0},this.wrap=function(a){return this._dom_insert(a,"wrap")}}},$.inArray=function(){}}();',
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
