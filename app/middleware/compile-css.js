const path = require('path');

function buildCSS(req, res, next) {

    let buildCssPath = path.join(process.cwd(), './bin/compile-css');

    require(buildCssPath);

    next();

}

module.exports = buildCSS;
