
require('dotenv-safe').load();

const fs    = require('grunt').file;
const path  = require('path');
const fm    = require('front-matter');
const chalk = require('chalk');


const log   = require('../middleware/log');
const DB    = require('../middleware/db');
const regex = require('../middleware/regex');


DB.init();


const Paths = {
    base: path.join(process.cwd(), 'content')
};


let files = fs.expand({ filter: 'isFile' }, [
    path.join(Paths.base, '**/*.md')
]);


function compileData(filepath) {

    let data        = require('fs').statSync(filepath);
    let content     = fs.read(filepath);

    content         = fm(content);
    data            = Object.assign({}, data, content.attributes);

    data.filepath   = filepath;
    data.content    = content.body.trim();

    // compose URL of filepath
    data.url        = filepath
        .substr(Paths.base.length)
        .replace(regex.FILE_EXT, '')
        ;

    if (data.url.match(/index/i)) {
        data.url = '/';
        data.isHomepage = true;
    }

    data.template   = data.template || 'pages/default';

    if (data.published) {

        data.published = new Date(data.published);

        if (data.published > DB.config.currentDate) {
            log(chalk.green('  >> future post, won\'t publish'));
            data.published = false;
        }
    }

    return data;
}


function handleTaxonomies(data) {

    let insert = DB.updateTaxonomies(data);

}


files.map((filepath) => {

    let data    = compileData(filepath);

    let insert  = DB.insertDocument(data);

    if (!insert) {
        DB.updateDocument(data.filepath, data);
    }

    handleTaxonomies(data);

});


log.info(DB.getDocumentCount());
log.info(DB);


DB.save();
