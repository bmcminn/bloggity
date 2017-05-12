const path  = require('path');
const chalk = require('chalk');



function fileAddWatcher(filepath, stats) {

    // make chokidar filepaths more explicit
    filepath = path.join(process.cwd(), filepath);

    if (path.extname(filepath) === '.md') {
        console.log(filepath);
    }

    // handle stylus file updates
    if (path.extname(filepath) === '.styl') {
        // require('../bin/compile-css').renderStylesheet(filepath);
    }

    // handle javascript file updates
    if (path.extname(filepath) === '.js') {
        // require('../bin/compile-js').uglifyScript(filepath);
    }

}


module.exports = fileAddWatcher;
