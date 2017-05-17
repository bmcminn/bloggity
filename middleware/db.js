const path      = require('path');
const fs        = require('grunt').file;
const fm        = require('front-matter');
const Promise   = require('bluebird');

const NEDB  = require('nedb');
const DB    = {};



DB.config = function(filepath) {
    return new NEDB({
        filename:   filepath
    ,   autoload:   true
    });
};



compileData = function(filepath, stats) {

    let parts = fm(fs.read(filepath));

    let data = {};

    data.filepath   = filepath;
    data.published  = parts.attributes.published    ? new Date(parts.attributes.published)  : true;
    data.draft      = parts.attributes.draft        ? parts.attributes.draft                : false;
    data.content    = parts.body;

    data.template   = parts.attributes.template     ? parts.attributes.template             : 'pages/default';

    return Object.assign({}, stats, parts.attributes, data);
}




DB.insertDocument = function(filepath, stats) {

    let doc = DB.content.findOne({ filepath: filepath }, function(err, doc) {
        if (!doc) {

            let data = compileData(filepath, stats);

            doc = DB.content.insert(data);
        }
    });

};



DB.updateDocument = function(filepath, stats) {

    let doc = DB.content.findOne({ filepath: filepath }, function(err, res) {

        let data = compileData(filepath, stats);

       // normalize updated time strings
        if (res.updated) { res.updated = new Date(res.updated); }

        // update DB record with new information
        DB.content.update({ filepath: filepath }, res);

        return res;
    });

    return doc;
};



DB.readDocument = function(filepath) {
    let doc = DB.content.findOne({ filepath: filepath }, function(err, res) {
        return res;
    });

    return doc;
}


// init respective DB modules
DB.content = DB.config(path.join(process.cwd(), '__db/content.dbjs'));


module.exports = DB;
