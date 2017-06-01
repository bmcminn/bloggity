const path      = require('path');
const fs        = require('grunt').file;
const fm        = require('front-matter');
const chalk     = require('chalk');
const Promise   = require('bluebird');

const log       = require('../middleware/log');


const DB    = {};


DB.init = function(config) {

    log.info(chalk.yellow('[DB::init]'));

    config = config || {};

    let defaults = {
        dbLocation:   path.join(process.cwd(), 'db/db.json')
    ,   currentDate:  new Date()
    };

    this.config = Object.assign({}, defaults, config);

    if (!fs.exists(this.config.dbLocation)) {
        this.data = {};

    } else {
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

    log.info(chalk.yellow('[DB::save]', chalk.cyan(self.config.dbLocation)));

    let data = process.env.NODE_ENV === 'production'
        ? JSON.stringify(this.data)             // compress our JSON data in production
        : JSON.stringify(this.data, null, 4)    // prettify JSON data for dev
        ;

    fs.write(self.config.dbLocation, data);

};




// DOCUMENT MANAGEMENT
// -----------------------------------------------------------------

DB.getDocumentCount = function() {

    log.info(chalk.yellow('[DB::getDocumentCount]'));

    return this.data.content.length;
};


DB._getDocumentID = function(filepath) {

    let content = this.data.content;

    let docID = content.findIndex(index => {
        return index.filepath === filepath;
    });


    if (docID < 0) {
        // log.error(chalk.red('document does not exist:'), chalk.cyan(filepath));
        return null;
    }

    return docID;

};


DB.insertDocument = function(data) {

    log.info(chalk.yellow('[DB::insertDocument]', chalk.cyan(data.filepath)));

    if (!data.filepath) {
        log.error(chalk.red(`'data.filepath' was not defined`));
        return null;
    }

    let docID = this._getDocumentID(data.filepath);

    // FIXED: conditional coerces docID = 0 to false, giving false positive on first index records
    if (docID >= 0) {
        log(chalk.yellow('  >> document already exists:'), chalk.cyan(data.filepath));
        return null;
    }

    this.data.content.push(data);

    log('waffles', this.data.content);

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

/**
 * @sauce  http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array#9229821
 * @param  array a
 * @return sorted array
 */
DB._uniq = function(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
};


DB.updateTaxonomies = function(data) {

    let self = this;

    if (!data.taxonomies) { return; }

    let taxonomies = {};


    for (let taxonomy in data.taxonomies) {

        log(chalk.magenta('taxonomy:'), taxonomy, data.taxonomies[taxonomy]);

        let taxList = data.taxonomies[taxonomy];

        taxonomies[taxonomy] = this.data.taxonomies[taxonomy] || [];

        taxList.map(taxItem => {
            log(taxItem);

            taxonomies[taxonomy].push(data.filepath);

        }, self);

        // ensure our taxonomy index has unique values
        taxonomies[taxonomy] = DB._uniq(taxonomies[taxonomy]);

    }


    this.data.taxonomies = taxonomies;

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
        log.error(chalk.red(`${taxonomy} does not exist`));
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
