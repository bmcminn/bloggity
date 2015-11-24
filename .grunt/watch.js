

module.exports = {

  // js: {
  //     options: {
  //       compress: false
  //     , linenos: true
  //     }

  //   , files: {
  //       'source/css/style.css': 'source/stylus/main.styl'
  //     }
  // },

  dist: {
    files: ['dist/**'],
    options: {
      livereload: true
    }
  },


  pages: {
    files: [
      'posts/**',
      'src/layouts/**',
      'src/pages/**'
    ],
    tasks: ['pages']
  },


  copy: {
    files: [
      'src/images/**',
      'src/scripts/**',
      'src/styles/**.css',
      'src/styles/fonts/**'
    ],
    tasks: ['copy']
  },


  style: {
    files: ['**/*.styl'],
    tasks: ['stylus:dev'],
    options: {
      spawn: false,
    }
  }

};
