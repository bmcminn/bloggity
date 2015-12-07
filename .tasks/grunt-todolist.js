module.exports = function(grunt) {

  'use strict';

  var path  = require('path')
    , _     = require('lodash')

    , todo  = {}
    , temp  = {}
    ;


  /**
   * [description]
   * @return {[type]}  [description]
   */
  grunt.registerTask('todolist', 'builds a todo list for the current project', function() {

    // setup our list collection
    todo.list = [];


    // build list of target files
    todo.files = grunt.file.expand({
        filter: 'isFile'
      },
      path.resolve('.', '**'),
      '!' + path.resolve('.', 'node_modules', '**')
    );


    console.log(todo.files);


    // iterate over each file we found
    _.each(todo.files, function(file, index) {

      temp.content = grunt.file.read(file);


      console.log(temp.content);

      // TODO: add check for all instances of TODO*

    });

    return false;

  });

}
