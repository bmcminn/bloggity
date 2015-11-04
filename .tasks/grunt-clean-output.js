
var path  = require('path')
  , _     = require('lodash')
  ;

module.exports = function(grunt) {

  'use strict';

  grunt.registerMultiTask('clean', 'Cleans up the output_dev/prod environments', function() {

    console.log(JSON.stringify(this, null, 2));

    var self = this;

    _.each(self.data.remove, function(filePath) {

      var file = {
            orig: filePath
          , path: path.resolve(process.cwd(), self.data.path, filePath)
          }
        ;

      if (grunt.file.isDir(file.path)) {
        grunt.file.delete(file.path);
      }

      console.log(file);
    });

  });

};
