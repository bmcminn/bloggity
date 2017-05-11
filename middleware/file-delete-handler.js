const path = require('path');

function fileDeleteHandler(filepath, stats) {
    console.log(`${filepath} deleted...`);

}



module.exports = fileDeleteHandler;
