const path = require('path');

function fileWatchHandler(filepath, stats) {

    // make chokidar filepaths more explicit
    filepath = path.join(process.cwd(), filepath);


    if (path.extname(filepath) === '.md') {
        require('./db').updateDocument(filepath);
    }

    // handle stylus file updates
    if (path.extname(filepath) === '.styl') {
        require('../bin/compile-css').renderStylesheet(filepath);
    }

    // handle javascript file updates
    if (path.extname(filepath) === '.js') {
        // console.log('JS FILE');
        require('../bin/compile-js').uglifyScript(filepath);
    }

}


module.exports = fileWatchHandler;