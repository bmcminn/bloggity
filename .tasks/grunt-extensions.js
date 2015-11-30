
/**
 * This is a set of helpers for our grunt runtime.
 * It contains overrides, extensions and various improvements to the default grunt workflow.
 * @param  {[type]} grunt [description]
 * @return {[type]}       [description]
 */
module.exports = function(grunt) {

  JSON.minify = require('jsonminify');


  /**
   * [readJSON description]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  grunt.file.readJSON = function(target) {
    var content = grunt.file.read(target);
    return JSON.parse(JSON.minify(content));
  }

  /**
   * [writeJSON description]
   * @param  {[type]} targetLoc [description]
   * @param  {[type]} data      [description]
   * @param  {[type]} pretty    [description]
   * @return {[type]}           [description]
   */
  grunt.file.writeJSON = function(targetLoc, data, pretty) {
    pretty = pretty || 2;
    grunt.file.write(targetLoc, JSON.stringify(data, null, pretty));
  }

  return grunt;
};
