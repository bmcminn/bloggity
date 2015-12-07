module.exports = function(grunt) {

  'use strict';

  var path    = require('path')
    , _       = require('lodash')
    , os      = require('os')
    , moment  = require('moment')

    , todo    = {}
    , temp    = {}
    , message = []

    , paths = {
        todoList: path.resolve('.', 'todo.md')
      , nodeModules: path.resolve('.', 'node_modules', '**')
      }
    ;


  /**
   * [description]
   * @return {[type]}  [description]
   */
  grunt.registerTask('todolist', 'builds a todo list for the current project', function() {

    // setup messaging
    message.push('# TODO LIST');
    message.push('> Date: ' + moment().format('MMMM DD, YYYY'));
    message.push('')


    // setup our list collection
    todo.list = [];


    // build list of target files
    todo.files = grunt.file.expand({
        filter: 'isFile'
      },
      path.resolve('.', '**')
    , '!' + paths.nodeModules
    , '!' + paths.todoList
    );


    // iterate over each file we found
    _.each(todo.files, function(file, index) {

      // read file contents
      temp.content = grunt.file.read(file);

      // check file contents for all matches to TODO
      temp.todos = temp.content.match(/TODO[:\s]*?([\s\S]+?)(?:[\r\n])/g);

      // if we found TODOs
      if (temp.todos) {

        // get the current working directory and split the string
        temp.root = process.cwd().split(path.sep);

        // get the current file path and split its string
        temp.filepath = file.split('/');

        // remove the first part of the path using the root dir length and add '.' to the first index
        temp.filepath.splice(0, temp.root.length, '.');

        // rebuild the reference file path
        temp.filepath = temp.filepath.join('/');

        // add the heading of the current file we're parsing
        message.push('## ' + temp.filepath);
        message.push('');

        // iterate over ALL the todos we found and format that as a list of changes to each file
        _.each(temp.todos, function(todo, index) {
          message.push('- ' + todo.replace(/TODO[\:\s]*/, ''));
        });

      }
    });


    // build message
    message = message.join(os.EOL);

    // write to todo.md
    grunt.file.write(paths.todoList, message);

  });

}
