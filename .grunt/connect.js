
module.exports = {

    dist: {
      options: {
      port: 5455,
      hostname: 'localhost',
        middleware: function (connect) {
          return [
            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
            connect.static(require('path').resolve('.dist'))
          ];
        }
      }
    }

};
