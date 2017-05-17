const path = require('path');

function fileDeleteHandler(filepath, stats) {
    console.log(`${filepath} deleted...`);
    // TODO: setup a warning that this file was deleted from the file system
}


module.exports = fileDeleteHandler;
