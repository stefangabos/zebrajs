'use strict';

module.exports = function(grunt) {

    // show time spent on each taks
    require('time-grunt')(grunt);

    grunt.initConfig({

        // load packages.json
        pkg: grunt.file.readJSON('package.json'),

        /***************************************************************************************************************
         *  NOTIFY
         *  https://github.com/dylang/grunt-notify
         **************************************************************************************************************/
        'notify': {
            done: {
                options: {
                    title: 'Grunt ',
                    message: 'All taks were successfully completed!'
                }
            }
        },

        /***************************************************************************************************************
         *  INCLUDES
         *  https://github.com/vanetix/grunt-includes
         **************************************************************************************************************/
        'includes': {
            library: {
                options: {
                    includeRegexp: /^(\s*)\/\/\s*import\s+['"]?([^'"]+)['"]?\s*$/,
                    duplicates: true,
                    debug: false
                },
                files: [{
                    cwd: 'src/',
                    src: '$.js',
                    dest: 'dist/zebra.src.js'
                }]
            },
            site: {
                options: {
                    includeRegexp: /\@import \"(.*?)\"/,
                    duplicates: true,
                    debug: false
                },
                files: [{
                    src: 'docs/download/public/javascript/application.min.js',
                    dest: 'docs/download/public/javascript/application.min.js'
                }]
            }
        },

        /***************************************************************************************************************
         *  SASS
         *  https://www.npmjs.org/package/grunt-sass
         **************************************************************************************************************/
        'sass': {
            options: {
                sourceMap: false,
                outputStyle: 'compressed',
                precision: 4
            },
            build: {
                files: {
                    'docs/download/public/css/screen.css': 'docs/download/assets_src/css/**/*.scss'
                }
            }
        },

        /***************************************************************************************************************
         *  ESLINT
         *  http://eslint.org/docs/rules/
         **************************************************************************************************************/
        'eslint' : {
            options: {
                configFile: 'eslint.json'
            },
            library: {
                src: ['src/**/*.js']
            },
            site: {
                src: ['docs/download/assets_src/javascript/**/*.js']
            }
        },

        /***************************************************************************************************************
         *  JSHINT
         *  https://npmjs.org/package/grunt-contrib-jshint
         **************************************************************************************************************/
        'jshint': {
            options: {
                strict:     false,       //  requires all functions to run in ECMAScript 5's strict mode
                asi:        true,       //  suppresses warnings about missing semicolons
                globals: {              //  white list of global variables that are not formally defined in the source code
                    '$':                true,
                    '$this':            true,
                    'alert':            true,
                    'console':          true,
                    'elements':         true,
                    'internal_counter': true,
                    'event_listeners':  true
                },
                browser:    true,       //  defines globals exposed by modern browsers (like `document` and `navigator`)
                bitwise:    true,       //  prohibits the use of bitwise operators such as ^ (XOR), | (OR) and others
                curly:      false,      //  whether to always put curly braces around blocks in loops and conditionals
                eqeqeq:     true,       //  this options prohibits the use of == and != in favor of === and !==
                freeze:     true,       //  this options prohibits overwriting prototypes of native objects such as Array, Date and so on
                latedef:    true,       //  this option prohibits the use of a variable before it was defined
                nonew:      true,       //  this option prohibits the use of constructor functions without assigning them to a variable
                loopfunc:   true,       //  allow functions to be defined inside loops
                undef:      true        //  this option prohibits the use of explicitly undeclared variables
            },
            library: {
                src: ['src/**/*.js']
            },
            site: {
                src: ['docs/download/assets_src/**/*.js']
            }
        },

        /***************************************************************************************************************
         *  JSDOC
         *  https://www.npmjs.com/package/jsdoc
         **************************************************************************************************************/
        'jsdoc': {
            build : {
                src: ['dist/zebra.src.js'],
                options: {
                    destination: 'docs',
                    template : "node_modules/docdash",
                    configure : "jsdoc.json",
                    readme: "Readme.md",
                    private: true
                }
            }
        },

        /***************************************************************************************************************
         *  UGLIFY
         *  https://npmjs.org/package/grunt-contrib-uglify
         **************************************************************************************************************/
        'uglify': {
            library: {
                files: [{
                    src: 'dist/zebra.src.js',
                    dest: 'dist/zebra.min.js'
                }]
            },
            site: {
                files: [{
                    src: 'docs/download/assets_src/javascript/application.js',
                    dest: 'docs/download/public/javascript/application.min.js'
                }]
            }
        },

        /***************************************************************************************************************
         *  WATCH
         *  https://npmjs.org/package/grunt-contrib-watch
         **************************************************************************************************************/
        'watch': {
            library: {
                files: ['src/**/*.js'],
                tasks: ['includes:library', 'newer:eslint:library', 'newer:jshint:library', 'jsdoc', 'newer:uglify:library', 'uglify:site', 'includes:site', 'notify:done'],
                options: {
                    livereload: true
                }
            },
            site_js: {
                files: ['docs/download/assets_src/javascript/**/*.js'],
                tasks: ['newer:eslint:site', 'newer:jshint:site', 'newer:uglify:site', 'includes:site', 'notify:done'],
                options: {
                    livereload: true
                }
            },
            site_css: {
                files: ['docs/download/assets_src/css/**/*.scss'],
                tasks: ['newer:sass', 'notify:done'],
                options: {
                    livereload: true
                }
            },
            readme: {
                files: ['Readme.md'],
                tasks: ['jsdoc']
            }
        }

    });

    // register plugins
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var tasks = [];

    tasks.push('includes:library');
    tasks.push('sass');
    tasks.push('eslint');
    tasks.push('jshint');
    tasks.push('jsdoc');
    tasks.push('uglify');
    tasks.push('includes:site');
    tasks.push('watch');

    grunt.registerTask('default', tasks);

};