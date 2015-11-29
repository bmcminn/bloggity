

var path        = require('path')
  , fs          = require('fs')
  , _           = require('lodash')
  // , pygmentize  = require('pygmentize-bundled')
  , marked      = require('marked')
  , RSS         = require('rss')
  , fastmatter  = require('fastmatter')
  ;


JSON.minify = require('jsonminify');

// build collection of template engines and their various implementation details
var templateEngines = {
  jade: {
    engine: require('jade'),
    extensions: ['.jade']
  }
};


// build collection of file locations
var files = {
      bloggityJSON: path.resolve('.', 'bloggity.json')
    , appCacheJSON: path.resolve('.', '.grunt','cache','bloggity.json')
    }
  ;


// initialize a temp storage variable
var temp;



/**
 * [exports description]
 * @param  {[type]} grunt [description]
 * @return {[type]}       [description]
 */
module.exports = function(grunt) {

  'use strict';


  /**
   * [readJSON description]
   * @param  {[type]} target [description]
   * @return {[type]}        [description]
   */
  grunt.file.readJSON = function(target) {
    var content = grunt.file.read(target);
    return JSON.parse(JSON.minify(content));
  };

  /**
   * [writeJSON description]
   * @param  {[type]} targetLoc [description]
   * @param  {[type]} data      [description]
   * @param  {[type]} pretty    [description]
   * @return {[type]}           [description]
   */
  grunt.file.writeJSON = function(targetLoc, data, pretty) {
    pretty = pretty || 2;
    grunt.file.write(targetLoc, JSON.stringify(data, null, pretty));
  };


  // Allow for test objects to be used during unit testing
  var _this   = grunt.testContext || {}
    , options = grunt.testOptions || {}
    ;


  // Initialize the app instance
  var app = grunt.file.exists(files.appCacheJSON) ? grunt.file.readJSON(files.appCacheJSON) : {};


  // initialize our app config instance
  app.config = {};


  // init the pages collection
  app.pages = [];


  // get the current cache date
  app.cacheDate = new Date();


  // Declare a global function to format URLs that is available to all library methods
  var formatPostUrl = function (urlSegment) {
    return urlSegment
      .toLowerCase()                              // change everything to lowercase
      .replace(/^\s+|\s+$/g, '')                  // trim leading and trailing spaces
      .replace(/[_|\s|\.]+/g, '-')                // change all spaces, periods and underscores to a hyphen
      .replace(/[^a-z\u0400-\u04FF0-9-]+/g, '')   // remove all non-cyrillic, non-numeric characters except the hyphen
      .replace(/[-]+/g, '-')                      // replace multiple instances of the hyphen with a single instance
      .replace(/^-+|-+$/g, '');                   // trim leading and trailing hyphens
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
        app.config = _.merge(app.config, grunt.file.readJSON(files.bloggityJSON));
      }


      // if post type already exists then kill the app and warn the user
      if (temp = app.checkForDuplicatePostTypes()) {
        grunt.fatal('postType(s) "' + temp.join('", "') + '" already exist in ' + files.bloggityJSON);
      }


      // Create a reference to the template engine that is available to all library methods
      app.templateEngine = templateEngines[app.config.templateEngine || 'jade'];


      // update app site model
      app.site = _.merge({
        baseUrl: "http://localhost:3005"

      }, app.config);


      //
      // APP RUNTIME
      //

      // get all postType files
      app.getPostTypes();

      // get all pages
      app.getPages();

      // save a snapshot of the current site model
      app.cacheAppState();


      app.renderPages();

      // TODO: generate .dist/page/index.html files
      // TODO: generate .dist/atom.xml
      // TODO: generate .dist/sitemap.xml
      // TODO: generate .dist/404.html
      // TODO: generate .dist/index.html
      // TODO: generate .dist/post-listings files (ie: blog.html)


    });



    //
    // APP MODULE DEFINITIONS
    //

    /**
     * Writes out the model cache file of current app state
     * @return {null}
     */
    app.cacheAppState = function() {
      grunt.file.writeJSON(files.appCacheJSON, this);
      return null;
    };



    /**
     * [checkForDuplicatePostTypes description]
     * @param  {[type]} postType [description]
     * @return {[type]}          [description]
     */
    app.checkForDuplicatePostTypes = function() {

      var postTypes = this.config.postTypes
        , tests = []
        ;

      // test each postType for duplicate configs
      _.map(postTypes, function(n) {
        var dups = _.pluck(_.filter(postTypes, { 'name': n.name }), 'name');
        if (dups.length > 1) { tests.push(dups[0]); }
      });

      // if we found duplicate names, return the names
      if (tests.length > 0) {
        return _.uniq(tests);

      } else {
        return false;

      }
    };



    /**
     * [buildFileData description]
     * @param  {[type]} fileCollection   [description]
     * @return {[type]}                  [description]
     */
    app.buildFileData = function(fileCollection) {

      var results = []
        , fileData
        ;

      // iterate over each page
      _.each(fileCollection, function(filepath, index) {

        fileData = path.parse(filepath.toLowerCase());

        fileData.filepath = filepath;
        fileData.originalContent = grunt.file.read(filepath);

        fileData = _.merge(
          fileData
        , fastmatter(fileData.originalContent)
        , fs.statSync(filepath)
        );

        //
        results.push(fileData);

      });

      return results;

    };



    /**
     * [getPostTypes description]
     * @return {[type]} [description]
     */
    app.getPostTypes = function() {

      var self      = this
        , postTypes = this.config.postTypes
        ;

      // iterate over each post type and generate their part of the site model
      _.each(postTypes, function(postType, index) {

        // normalize the post type name string
        postType.name = postType.name.toLowerCase();

        // collect all postType files
        var postFiles = grunt.file.expand({ filter: 'isFile' }, path.resolve(postType.src, '**'))
          ;

        // initialize the postType data object
        app[postType.name] = self.buildFileData(postFiles);
      });

      return false;
    };



    /**
     * [getPages description]
     * @return {[type]} [description]
     */
    app.getPages = function() {

      var self      = this
        , pages     = this.config.pages
        , pageFiles = grunt.file.expand({ filter: 'isFile' }, path.resolve(pages.name, '**'))
        ;

      // reassign our pages collection back to the app instance
      this.pages = this.buildFileData(pageFiles);

      return false;
    };




    app.renderPages = function() {

      var self  = this
        , pages = this.pages
        , config = this.config
        , templateEngine = this.templateEngine.engine
        ;

      // iteratate over each page
      _.each(pages, function(page, index) {

        self.filename = page.filepath;


        // render content
        page.renderedContent = templateEngine.render(page.body, self);

        // find the render path for the file
        if (page.filepath.match(/(index|\d{3,4})\.jade/)) {
          page.renderPath = path.resolve(config.dest, page.name + '.html');
        } else {
          page.renderPath = path.resolve(config.dest, page.name, 'index.html');
        }

        grunt.file.write(page.renderPath, page.renderedContent);

        console.log(page);
      });


      return false;
    };


};
