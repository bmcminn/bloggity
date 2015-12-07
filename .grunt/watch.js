

module.exports = {

  js: {
    files: [
      'scripts/**/*.js'
    ],
    tasks: [
      'jshint',
      'uglify'
    ]
    //   options: {
    //     compress: false
    //   , linenos: true
    //   }

    // , files: {
    //     'source/css/style.css': 'source/stylus/main.styl'
    //   }
  },

  dist: {
    files: ['.dist/**'],
    options: {
      livereload: true
    }
  },


  content: {
    files: [
      '**/*.md'
    , 'pages/*.jade'
    , 'templates/*.jade'
    ],
    tasks: [
      'bloggity'
    ]
  },

  // pages: {
  //   files: [
  //     'posts/**',
  //     'layouts/**',
  //     'pages/**'
  //   ],
  //   tasks: ['pages']
  // },


  copy: {
    files: [
      'images/**',
      'scripts/**.min.js',
      'styles/**.css',
      'styles/fonts/**'
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
