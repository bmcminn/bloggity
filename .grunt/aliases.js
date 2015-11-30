
module.exports = function(grunt) {

  grunt.registerTask('default', [
    'server'
  ]);


  grunt.registerTask('deploy', [
    'build',
    'ftpush'
  ]);


  grunt.registerTask('server', [
    'dev',
    'connect',
    'open',
    'watch'
  ]);


  grunt.registerTask('dev', [
    'linty',
    'stylus:dev',
    'bloggity:dev',
    'copy'
  ]);


  grunt.registerTask('build', [
    'linty',
    // 'clean',
    'stylus:build',
    'uglify',
    'bloggity:build',
    'copy'
  ]);


  grunt.registerTask('linty', [
    'jsonlint'
  , 'jshint'
  ]);

};
