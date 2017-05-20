const path      = require('path');
const fs        = require('grunt').file;
const fm        = require('front-matter');
const chalk     = require('chalk');
const Promise   = require('bluebird');


// const NEDB  = require('nedb');
const DB    = {};


DB.init = function(config) {

    config = config || {};

    let defaults = {
        dbLocation:   path.join(process.cwd(), 'db/db.json')
    };

    this.config = Object.assign({}, defaults, config);

    if (!fs.exists(this.config.dbLocation)) {
        console.log(chalk.yellow('initializing database:'), chalk.cyan(this.config.dbLocation));
        this.data = {};

    } else {
        console.log(chalk.yellow('reading database:'), chalk.cyan(this.config.dbLocation));
        this.data = fs.readJSON(this.config.dbLocation);

    }

    this.data.content       = this.data.content     || [];
    this.data.renderList    = this.data.renderList  || [];
    this.data.taxonomies    = this.data.taxonomies  || {};
    this.data.canonical     = this.data.canonical   || {};

    this.save();

};



DB.reset = DB.init;



DB.save = function() {

    let self = this;

    console.log(chalk.yellow('saving database: '), chalk.cyan(self.config.dbLocation));

    fs.write(self.config.dbLocation, JSON.stringify(self.data));

};


// DB.insert = function(data) {

// };



// DB.update = function(target, data) {



// };



// DB.read = function(target, data) {
//     let doc = DB.content.findOne({ filepath: filepath }, function(err, res) {
//         return res;
//     });

//     return doc;
// };





// DOCUMENT MANAGEMENT
// -----------------------------------------------------------------

DB.getDocumentCount = function() {
    return this.data.content.length;
};


DB._getDocumentID = function(filepath) {

    let content = this.data.content;

    let docID = content.findIndex(index => {
        return index.filepath === filepath;
    });

    if (docID < 0) {
        console.error(chalk.red('document does not exist:'), chalk.cyan(filepath));
        return null;
    }

    return docID;

};


DB.insertDocument = function(data) {

    let self = this;

    if (!data.filepath) {
        console.error(chalk.red(`'data.filepath' was not defined`));
        return null;
    }

    let docID = this._getDocumentID(data.filepath);

    // FIXED: conditional coerces docID = 0 to false, giving false positive on first index records
    if (docID > -1) {
        console.info(chalk.yellow('document already exists:'), chalk.cyan(data.filepath));
        return null;
    }

    this.data.content.push(data);

};


DB.readDocument = function(filepath) {

    let docID = this._getDocumentID(filepath);
    if (!docID) { return null; }

    return this.data.content[docID];

};


DB.updateDocument = function(filepath, data) {

    let docID = this._getDocumentID(filepath);
    if (!docID) { return null; }

    let content = this.readDocument(filepath);

    data = Object.assign({}, content, data);

    this.data.content[docID] = data;

};


DB.deleteDocument = function(filepath) {

    let doc = this.readDocument(filepath);

    delete(this.data.content[doc]);

};



// TAXONOMY MANAGEMENT
// -----------------------------------------------------------------

DB.insertTaxonomy = function(taxonomy, filepath) {



};



/**
 * Ensures paths to be rendered are unique before inserting them into the render list
 * @param  {[type]} route [description]
 * @return {[type]}       [description]
 */
DB.insertRenderItem = function(route) {

    let self = this;

    let renderItems = self.data.renderList;

    let doc = renderItems.find(renderItem => {
        return renderItem === route;
    });

    if (!doc) {
        this.data.renderList.push(route);
    }

}




/**
 * returns a list of documents pertaining to a given taxonomy
 * @param  {[type]} taxonomy [description]
 * @return {[type]}          [description]
 */
DB.getTaxonomyContent = function(taxonomy) {
    if (!this.data.taxonomies[taxonomy]) {
        console.error(chalk.red(`${taxonomy} does not exist`));
        return null;
    }

    return this.data.taxonomies[taxonomy];
};


// compileData = function(filepath, stats) {

//     let parts = fm(fs.read(filepath));

//     let data = {};

//     data.filepath   = filepath;
//     data.published  = parts.attributes.published    ? new Date(parts.attributes.published)  : true;
//     data.draft      = parts.attributes.draft        ? parts.attributes.draft                : false;
//     data.content    = parts.body;

//     data.template   = parts.attributes.template     ? parts.attributes.template             : 'pages/default';

//     return Object.assign({}, stats, parts.attributes, data);
// }






// init respective DB modules
// DB.content = DB.config(path.join(process.cwd(), '__db/content.dbjs'));


module.exports = DB;
