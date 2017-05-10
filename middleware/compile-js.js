const path = require('path');

function buildJS(req, res, next) {

    let buildJsPath = path.join(process.cwd(), './bin/compile-js');

    require(buildJsPath);

    next();

}

module.exports = buildJS;
