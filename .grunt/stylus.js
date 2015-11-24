

module.exports = {

  dev: {
      options: {
        compress: false
      , linenos: true
      }

    , files: {
        'dist/styles/main.css': './src/styles/main.styl'
      }
  },

  build: {
      options: {
        compress: true
      , linenos: false
      }
    , files: {
        'dist/styles/main.css': './src/styles/main.styl'
      }
  }

};
