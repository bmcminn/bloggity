const path  = require('path');
const fs    = require('grunt').file;
const fm    = require('front-matter');

const NEDB  = require('nedb');
const DB    = {};


DB.config = function(filepath) {
    return new NEDB({
        filename:   filepath
    ,   autoload:   true
    });
};


DB.insertDocument = function(filepath, stats) {

    let doc = DB.content.findOne({ filepath: filepath }, function(err, doc) {
        if (!doc) {
            console.log(doc);
            let data = Object.assign({ filepath: filepath }, stats);
            doc = DB.content.insert(data);
        }
    });

};


DB.updateDocument = function(filepath) {

    let doc = DB.content.findOne({ filepath: filepath }, function(err, res) {

        let parts = fm(fs.read(filepath));

        res = Object.assign({}, parts.attributes, res);

        // normalize published time strings
        if (res.published) { res.published = new Date(res.published); }

        // normalize updated time strings
        if (res.updated) { res.updated = new Date(res.updated); }

        // write content into res.content
        res.content = parts.content;

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
