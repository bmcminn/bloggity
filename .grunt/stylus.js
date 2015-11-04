

module.exports = {

  dev: {
      options: {
        compress: false
      , linenos: true
      }

    , files: {
        'source/css/style.css': 'source/stylus/main.styl'
      }
  },

  build: {
      options: {
        compress: true
      , linenos: false
      }
    , files: {
        'source/css/style.css': 'source/stylus/main.styl'
      }
  }

};
