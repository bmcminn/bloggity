

var path        = require('path')
  , _           = require('lodash')
  , pygmentize  = require('pygmentize-bundled')
  , marked      = require('marked')
  , RSS         = require('rss')
  , fastmatter  = require('fastmatter')
  ;


var templateEngines = {
  hbs: {
    engine: require('handlebars'),
    extensions: ['.hbs', '.handlebars', '.html']
  },
  ejs: {
    engine: require('ejs'),
    extensions: ['.ejs']
  },
  jade: {
    engine: require('jade'),
    extensions: ['.jade']
  }
};


var config = {}
  , files = {
      bloggityJSON: path.resolve('.', 'bloggity.json')
    }
  ;


module.exports = function(grunt) {

  'use strict';


  // Allow for test objects to be used during unit testing
  var _this   = grunt.testContext || {};
  var options = grunt.testOptions || {};

  // Create a reference to the template engine that is available to all library methods
  var templateEngine;

  // Declare a global function to format URLs that is available to all library methods
  var formatPostUrl = function (urlSegment) {
    return urlSegment
      .toLowerCase() // change everything to lowercase
      .replace(/^\s+|\s+$/g, '') // trim leading and trailing spaces
      .replace(/[_|\s|\.]+/g, '-') // change all spaces, periods and underscores to a hyphen
      .replace(/[^a-z\u0400-\u04FF0-9-]+/g, '') // remove all non-cyrillic, non-numeric characters except the hyphen
      .replace(/[-]+/g, '-') // replace multiple instances of the hyphen with a single instance
      .replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
  };


  // Save start time to monitor task run time
  var start = new Date().getTime();


  /**
   * [description]
   * @param  {[type]}
   * @return {[type]}
   */
  grunt.registerTask('bloggity',
    'Generates the site',
    function() {

      // determine if the user has a cabin.json file or bloggity.json file
      if (!grunt.file.exists(files.bloggityJSON)) {
        grunt.fatal('You need to create a bloggity.json file.');

      } else {
        config = _.merge(config, grunt.file.readJSON(files.bloggityJSON));

      }


      // iterate over each post type and fire off the necessary compilation event
      _.each(config.postTypes, function(postType, index) {

        console.log(postType.name);

      });


      console.log(config);


    });


};

