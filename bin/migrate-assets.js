
const fs        = require('grunt').file;
const path      = require('path');
const chalk     = require('chalk');

const pkgSrc    = path.join(process.cwd(), 'package.json');
const pkg       = fs.readJSON(pkgSrc);

const configSrc = path.join(process.cwd(), 'config.yml');
const Config    = fs.readYAML(configSrc);

const prod      = !!process.env.production;  // coerce env.production to bool
const log       = console.log.bind(console);


const assets = {
    omitFilePrefix: '_'
,   fileExt:        '.+(' + Config.site.assetExts.join('|') + ')'

,   srcDir:     path.join(process.cwd(), Config.site.clientDir)
,   destDir:    path.join(process.cwd(), Config.site.publicDir)
};


const assetsPatterns = [
    path.join(assets.srcDir, `**/*${assets.fileExt}`)
,   '!' + path.join(assets.srcDir, `**/${assets.omitFilePrefix}*`)
];


const globFiles = {
    filter: 'isFile'
};


const assetFiles = fs.expand(globFiles, assetsPatterns);


if (!assetFiles.length > 0) {
    console.log(chalk.yellow('No files found.'));
    return;
}


assetFiles.map(asset => {

    log(chalk.green('> migrating', chalk.cyan(asset)));

    let filepath    = asset.substr(assets.srcDir.length + 1);

    const destPath  = path.join(assets.destDir, filepath);

    fs.copy(asset, destPath);

});
