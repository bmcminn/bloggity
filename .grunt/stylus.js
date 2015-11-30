

module.exports = {

  dev: {
    options: {
      compress: false
    , linenos: true
    }

  , files: {
      './styles/main.css': './styles/main.styl'
    }
  },

  build: {
    options: {
      compress: true
    , linenos: false
    }
  , files: {
      './styles/main.css': './styles/main.styl'
    }
  }

};
