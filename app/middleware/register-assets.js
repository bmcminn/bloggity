
const fs    = require('grunt').file;
const path  = require('path');


function getAsset(ext) {

    let basepath = path.join(process.cwd(), 'public');

    let searchPaths = [
        path.join(basepath, `${ext}/**/*`)
    ,   '!' + path.join(basepath, `${ext}/**/_*`)
    ];

    let assetList = fs.expand({ filter: 'isFile' }, searchPaths);

    assetList = assetList.map(asset => {
        return asset.substr(basepath.length);
    });

    return assetList;
}



function registerAssets(req, res, next) {

    // find styles
    req.app.locals.styles  = getAsset('css');
    req.app.locals.scripts = getAsset('js');

    next();
}


module.exports = registerAssets;
