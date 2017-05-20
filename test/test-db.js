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


files.map((filepath) => {

    console.log(chalk.cyan(filepath));

    let data    = require('fs').statSync(filepath);
    let content = fs.read(filepath);

    content     = fm(content);
    data        = Object.assign({}, data, content.attributes);

    data.filepath   = filepath;
    data.content    = content.body.trim();

    data.template   = data.template     || 'pages/default';

    if (data.published) {

        data.published = new Date(data.published);

        if (data.published > new Date()) {
            console.log(chalk.green('  >> future post, won\'t publish'));
            data.published = false;
        }
    }


    let insert = DB.insertDocument(data);

    if (!insert) {
        DB.updateDocument(data.filepath, data);
    }

});


console.log(DB);


DB.save();
