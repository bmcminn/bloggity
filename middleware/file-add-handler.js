const path  = require('path');
const chalk = require('chalk');


function fileAddWatcher(filepath, stats) {

    // make chokidar filepaths more explicit
    filepath = path.join(process.cwd(), filepath);

    if (path.extname(filepath) === '.md') {
        require('./db').insertDocument(filepath, stats);
    }

    // handle stylus file updates
    if (path.extname(filepath) === '.styl') {

    }

    // handle javascript file updates
    if (path.extname(filepath) === '.js') {

    }

}


module.exports = fileAddWatcher;
