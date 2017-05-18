
const fs    = require('grunt').file;
const path  = require('path');
const chalk = require('chalk');
const DB    = require('./db');


function getContent(req, res, next) {

    const PATHS = req.app.get('paths');


    let locals  = {};
    let page    = {};


    console.log(chalk.green('req.url'), req.url);
    console.log(chalk.green('PATHS'), PATHS);


    // ignore assets with a file extension
    if (path.extname(req.url)) {
        next();
        return;
    }


    // HOMEPAGE
    // -----------------------------------------------------------------
    if (req.url === '/') {

        page.name = 'index.md';

        // locals.content =

    }

    // console.log(req.params.length);
    // console.log(req.url);

    // STANDALONE PAGE (eg: About, Contact, Terms, Privacy Notice, etc)
    // -----------------------------------------------------------------



    // console.log(req.params.length);
    // console.log(req.url);


    let filepath = path.join(PATHS.content, page.name);

    console.log(chalk.green('filepath'), filepath);

    DB.content.findOne({ filepath: filepath }, (err, file) => {

        if (!file.author) {

            let authorName  = file.author
                                .toUpperCase()
                                .replace(/\s/gi, '_')
            ;

            file.author     = req.app.get('config').authors[authorName];

        }

        locals = Object.assign({}, file);

        console.log(chalk.green('locals'), locals);

        req.app.locals = Object.assign({}, req.app.locals, locals);

        next();

    });

}


module.exports = getContent;
