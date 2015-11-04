

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

  style: {
    files: ['**/*.styl'],
    tasks: ['stylus:dev'],
    options: {
      spawn: false,
    }
  }

};
