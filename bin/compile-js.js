
const fs        = require('grunt').file;
const path      = require('path');
const chalk     = require('chalk');
const uglify    = require('uglify-js');

const pkgSrc    = path.join(process.cwd(), 'package.json');
const pkg       = fs.readJSON(pkgSrc);

const configSrc = path.join(process.cwd(), 'config.yml');
const Config    = fs.readYAML(configSrc);

const prod      = !!process.env.production;  // coerce env.production to bool
const log       = console.log.bind(console);


const scripts = {
    omitFilePrefix: '_'
,   fileExt:        '.js'

,   srcDir:     path.join(process.cwd(), Config.site.clientDir + '/js')
,   destDir:    path.join(process.cwd(), Config.site.publicDir + '/js')
};


const scriptsPatterns = [
    path.join(scripts.srcDir, `**/*${scripts.fileExt}`)
,   '!' + path.join(scripts.srcDir, `**/${scripts.omitFilePrefix}*${scripts.fileExt}`)
];


const globFiles = {
    filter: 'isFile'
};


const scriptFiles = fs.expand(globFiles, scriptsPatterns);


if (!scriptFiles.length > 0) {
    console.log(chalk.yellow('No files found.'));
    return;
}


scriptFiles.map(script => {

    log(chalk.green('> compressing', chalk.cyan(script)));

    let content     = fs.read(script).toString();
    let filepath    = script.substr(scripts.srcDir.length + 1);

    const destPath  = path.join(scripts.destDir, filepath);

    if (prod) {
        content = uglify.minify(content, {
            fromString: true,
            compress: {
                dead_code: true,
                global_defs: {
                    DEBUG: false
                }
            }
        }).code;
    }

    fs.write(destPath, content);

});
