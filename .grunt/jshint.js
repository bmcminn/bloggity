
module.exports = {

  theme_js: [
    'gruntfile.js'
  , '.grunt/**/*.js'
  ],

  options: {
    ignores: [
      'build.js'
    ]

  , undef: true
  , laxcomma: true
  , laxbreak: true
  , unused: false
  , globals: {
      console: true
    , window: true
    , document: true
    , grunt: true
    , navigator: true
    , Image: true
    , $: true
    , V: true
    , setTimeout: true
    , order: true
    , typeOf: true
    , clearTimeout: true
    , module: true
    , define: true
    , require: true
    , Modernizr: true
    , process: true
    }
  }

};
