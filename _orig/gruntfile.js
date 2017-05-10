module.exports = function(grunt) {

  'use strict';

  var path = require('path')
    ;

  require('time-grunt')(grunt);

  grunt.loadTasks('./.tasks/');

  require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), '.grunt')
    , data: {
        pkg:      grunt.file.readJSON('package.json'),
        sculpin:  grunt.file.readJSON('sculpin.json')
      }
    });

};
