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
        location:   path.join(process.cwd(), 'db/db.json')
    };

    this.config = Object.assign({}, defaults, config);


    if (!fs.exists(this.config.location)) {
        console.log(chalk.yellow('initializing database:'), chalk.cyan(this.config.location));
        this.data = {};

    } else {
        console.log(chalk.yellow('reading database:'), chalk.cyan(this.config.location));
        this.data = fs.readJSON(this.config.location);

    }


    this.data.content       = this.data.content || [];
    this.data.renderList    = this.data.renderList || [];
    this.data.taxonomies    = this.data.taxonomies || {};


    console.log(this.data);


    this.backup();
};




DB.backup = function() {

    let self = this;

    fs.write(self.config.location, JSON.stringify(self.data));

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






DB.insertDocument = function(data) {

    let self = this;

    self.data.pages = self.data.pages || [];

    let pages = self.data.pages;

    if (!data.filepath) {
        console.error(chalk.red(`'data.filepath' was not defined`));
        return null;
    }

    let doc = pages.find(doc => {
        return doc.filepath === data.filepath;
    });


    if (doc) {
        console.error(
            chalk.red(`${data.filepath} already exists\n`,
                chalk.yellow('try updating the document with '),
                chalk.cyan('chalk.DB.updateDocument(data)')
            )
        );

        return null;
    }

    this.data.content.push(data);
};



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
