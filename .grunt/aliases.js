
module.exports = function(grunt) {

  grunt.registerTask('default', [
    'lintify'
  , 'clean:dev'
  , 'watch'
  ]);


  grunt.registerTask('build', [
    'lintify'
  , 'exec:sculpin_prod'
  , 'clean:prod'
  ]);


  grunt.registerTask('lintify', [
    'jsonlint'
  , 'jshint'
  ]);

};
