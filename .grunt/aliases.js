
module.exports = function(grunt) {

  grunt.registerTask('default', [
    'server'
  ]);


  grunt.registerTask('deploy', [
    'build',
    'ftpush'
  ]);


  grunt.registerTask('server', [
    'build',
    'connect',
    'open',
    'watch'
  ]);


  grunt.registerTask('build', [
    'lintify',
    'clean',
    'pages',
    'stylus',
    'copy'
  ]);


  grunt.registerTask('lintify', [
    'jsonlint'
  , 'jshint'
  ]);

};
