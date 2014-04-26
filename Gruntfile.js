/*
 * Generated on 2014-04-26
 * generator-assemble v0.4.8
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'directory-source',
      dist: 'directory',
      iconsSrc: 'icons-source',
      iconsDist: 'icons'
    },

    makeIcons: {
      icons: {
        src: ['<%= config.iconsSrc %>/*'],
        filter: 'isDirectory'
      }
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates,assets}/{,*/}*.{md,hbs,yml,sass,scss,js}'],
        tasks: ['assemble', 'sass', 'copy']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.src %>/assets/styles',
          src: ['*.scss', '*.sass'],
          dest: '<%= config.dist %>/assets/css',
          ext: '.css'
        }]
      }
    },

    copy: {
      directory: {
        files: [
          // Copy any vanilla CSS files included in the style source
          {expand: true, cwd: '<%= config.src %>/assets/styles', src: ['**', '!*.scss', '!*.sass'], dest: '<%= config.dist %>/assets/css'},

          // Copy any images
          {expand: true, cwd: '<%= config.src %>/content', src: ['*.jpg', '*.png', '*.jpeg'], dest: '<%= config.dist %>/'},

          // Copy any vanilla JS files included in the script source
          {expand: true, cwd: '<%= config.src %>/assets/scripts', src: ['**', '!*.coffee'], dest: '<%= config.dist %>/assets/js'}
        ]
      },
      icons: {
        files: [
          // Copy all the SVG source icons
          {expand: true, cwd: '<%= config.iconsSrc %>', src: ['**'], dest: '<%= config.iconsDist %>'}
        ]
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= config.dist %>/assets',
          layout: '<%= config.src %>/templates/layouts/default.hbs',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/templates/partials/*.hbs',
          plugins: ['assemble-markdown-data'],
          helpers: ['handlebars-helper-slugify', 'handlebars-helper-compose']
        },
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs']
        }
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    // ** ALL FILES IN `<%= config.dist %>` WILL BE DELETED **
    //clean: ['<%= config.dist %>/**/*.{html,xml}', '<%= config.dist %>/assets/**/*.{js,css,img}']

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerMultiTask('makeIcons', 'Log stuff.', function() {
  });

  grunt.registerTask('server', [
    //'clean',
    'copy:directory',
    'sass',
    'assemble',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build:directory', [
    //'clean',
    'copy:directory',
    'sass',
    'assemble',
  ]);

  grunt.registerTask('build:icons', [
    'copy:icons',
    'makeIcons'
  ]);
  grunt.registerTask('build', [
    //'clean',
    'build:icons',
    'build:directory'
  ]);
  grunt.registerTask('default', [
    'build'
  ]);

};
