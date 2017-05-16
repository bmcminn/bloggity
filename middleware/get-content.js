
const fs    = require('grunt').file;
const path  = require('path');
const DB    = require('./db');


function getContent(req, res, next) {

    let locals = {};
    let pageName = '';

    // HOMEPAGE
    // -----------------------------------------------------------------
    if (!req.params.length && req.url === '/') {

        res.template = 'index';

        pageName = 'index.md';

        // locals.content =

    }


    // STANDALONE PAGE (eg: About, Contact, Terms, Privacy Notice, etc)
    // -----------------------------------------------------------------



    // console.log(req.params.length);
    // console.log(req.url);


    let filepath = path.join(req.app.get('paths').content, pageName);

    console.log(filepath);

    DB.content.findOne({ filepath: filepath }, (err, file) => {

        if (file.author) {

            let authorName  = file.author
                                .toUpperCase()
                                .replace(/\s/gi, '_')
            ;
            console.log(authorName);
            file.author     = req.app.get('config').authors[authorName];

        }

        locals = Object.assign({}, file);

        console.log(locals);

        req.app.locals = Object.assign({}, req.app.locals, locals);

        next();

    });

}


module.exports = getContent;
