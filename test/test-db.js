const fs    = require('grunt').file;
const path  = require('path');
const fm    = require('front-matter');
const chalk = require('chalk');


const DB    = require('../middleware/db.js');



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

    data.template   = data.template || 'pages/default';

    if (data.published) {

        data.published = new Date(data.published);

        if (data.published > new Date()) {
            console.log(chalk.green('  >> future post, won\'t publish'));
            data.published = false;
        }
    }

    return data;
}



function handleTaxonomies(data) {

    let insert = DB.updateTaxonomies(data);

}



files.map((filepath) => {

    console.log(chalk.cyan(filepath));

    let data = compileData(filepath);

    let insert = DB.insertDocument(data);

    if (!insert) {
        DB.updateDocument(data.filepath, data);
    }

    handleTaxonomies(data);

});





console.log(DB);


DB.save();
