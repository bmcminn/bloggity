module.exports = function(grunt) {

  'use strict';

  var path  = require('path')
    , os    = require('os')
    ;


  // load up our grunt extensions
  grunt = require('./.tasks/grunt-extensions.js')(grunt);


  require('time-grunt')(grunt);

  grunt.loadTasks('./.tasks/');

  require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), '.grunt')
    , data: {
        pkg: grunt.file.readJSON('package.json')
      , bloggity: grunt.file.readJSON('bloggity.json')
      , templateEngine: 'hbs'
      , settings: {
          dest: '.dist'
        , banner: [
            '/**'
          , ' * Copyright © ' + new Date().getFullYear() + ' - Brandtley McMinn'
          , ' * @site: http://brandtley.name/'
          , ' */'
          ].join(os.EOL)
        }
      }
    });

};
