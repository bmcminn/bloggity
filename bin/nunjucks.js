
const path        = require('path');
const fs          = require('grunt').file;
const nunjucks    = require('nunjucks');

const regex = {
    ext: /\.[\w\d]{2,}$/i
}


module.exports.reloader = new nunjucks.Loader.extend({

    init: function(viewspath, opts) {

        this.opts = opts || {};
        this.templates = {};

        this.baseDir    = viewspath[0];
        this.getFiles();
    }


,   getFiles: function() {

        let self = this;

        let viewFiles = fs.expand({ filter: 'isFile' }, path.join(self.baseDir, '**/*'));

        viewFiles.map(function(filepath) {
            let name = self.getFileName(filepath);
            this.templates[name] = fs.read(filepath);
        }, this);

    }


,   getFileName: function(filepath) {
        let self = this;

        let filename = filepath
                .substr(self.baseDir.length + 1) // remove the base directory path
                .replace(regex.ext, '')
                ;

        return filename;
    }


,   getSource: function(name) {

        let self = this;

        name = name.replace(regex.ext, '');

        if (!self.templates[name]) {
            throw Error(`No template '${name}' exists.`);
        }

        return {
            src: self.templates[name]
        ,   path: name
        ,   noCache: this.noCache || false
        };
    }
});



module.exports.filters = {

    // TODO: setup systemwide default date format
    // dateFilter.setDefaultForamt()

    date: require('nunjucks-date-filter')


,   shorten: function(str, count) {
        return str.slice(0, count || 5);
    }


,   spaceless: function(content) {
        return require('./nunjucks/filter-spaceless')(nunjucks)(content);
    }


,   sanitize: function(content) {
        return require('./nunjucks/filter-sanitize')(nunjucks)(content);
    }


,   log: function(content) {
        return require('./nunjucks/filter-log')(nunjucks)(content);
    }


,   hash: function(content) {
        return require('./nunjucks/filter-hash')(nunjucks)(content);
    }


    // @sauce: https://perishablepress.com/best-method-for-email-obfuscation/
,   email: function(content) {
        return require('./nunjucks/filter-email')(nunjucks)(content);
    }


,   phone: function(content) {
        return require('./nunjucks/filter-phone')(nunjucks)(content);
    }


};



// let nunjucksEnvironment = function(opts) {

//     'use strict';



//     // init custom nunjucks file loader instance
//     let ReLoader = nunjucks.Loader.extend(reloaderConfig);

//     // setup nunjucks environment
//     let env = new nunjucks.Environment(new ReLoader(opts.views));


//     // add filters to nunjucks environment
//     //----------------------------------------------------------------------

//     let dateFilter = require('nunjucks-date-filter');

//     // TODO: setup systemwide default date format
//     // dateFilter.setDefaultForamt()

//     env.addFilter('date', dateFilter);


//     env.addFilter('shorten', function shorten(str, count) {
//         return str.slice(0, count || 5);
//     });


//     env.addFilter('spaceless', function spacelessFilter(content) {
//         return require('./nunjucks/filter-spaceless')(nunjucks, env)(content);
//     });


//     env.addFilter('sanitize', function sanitizeFilter(content) {
//         return require('./nunjucks/filter-sanitize')(nunjucks, env)(content);
//     });


//     env.addFilter('log', function logFilter(content) {
//         return require('./nunjucks/filter-log')(nunjucks, env)(content);
//     });


//     env.addFilter('hash', function hashFilter(content) {
//         return require('./nunjucks/filter-hash')(nunjucks, env)(content);
//     });


//     /**
//      * { item_description }
//      * @sauce: https://perishablepress.com/best-method-for-email-obfuscation/
//      */
//     env.addFilter('email', function emailFilter(content) {
//         return require('./nunjucks/filter-email')(nunjucks, env)(content);
//     });


//     env.addFilter('phone', function phoneFilter(content) {
//         return require('./nunjucks/filter-phone')(nunjucks, env)(content);
//     });


//     // return nunjucks environment instance
//     return env;

// };



// module.exports = nunjucksEnvironment;
