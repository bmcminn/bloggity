
var grunt = require('grunt');

module.exports = {

  options: {
    mangle: true
  , mangleProperties: true
  , reserveDOMProperties: true
  , compress: true
  , report: 'gzip'
  , preserveComments: false
  // , screwIE8: true
  , banner: '<%= settings.banner %>'
  },

  dist: {
    files: grunt.file.expandMapping(['scripts/**/*.js'], '.dist/scripts/', {
      flatten: true,
      rename: function(destBase, destPath) {
        return destBase+destPath.replace('.js', '.min.js');
      }
    })
    // files: [
    //   {
    //     expand: true,
    //     cwd: '.dist',
    //     src: '**/*.js',
    //     dest: '.dist/scripts'
    //   }
    // ]
  }

};
