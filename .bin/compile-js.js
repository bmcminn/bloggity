
const fs        = require('grunt').file;
const path      = require('path');
const chalk     = require('chalk');
const uglify    = require('uglify-js');

const pkgSrc    = path.join(process.cwd(), 'package.json');
const pkg       = fs.readJSON(pkgSrc);

const configSrc = path.join(process.cwd(), 'config.yml');
const Config    = fs.readYAML(configSrc);

const PROD      = !!process.env.production;  // coerce env.production to bool
const log       = console.log.bind(console);


const scripts = {
    omitFilePrefix: '_'
,   fileExt:        '.js'

,   srcDir:     path.join(process.cwd(), Config.site.clientDir + '/js')
,   destDir:    path.join(process.cwd(), Config.site.publicDir + '/js')

,   globConfig: {
        filter: 'isFile'
    }
};


scripts.uglifyScript = function(script) {

    let self = this;

    let content     = fs.read(script).toString();
    let filepath    = script.substr(self.srcDir.length + 1);

    const destPath  = path.join(self.destDir, filepath);

    log(chalk.green('> compiling', chalk.cyan(script), chalk.yellow('->'), chalk.cyan(destPath)));

    // TODO: abstract this as asset handler callback and unify the compile-css/compile-js utilities
    if (PROD) {
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

};


scripts.uglifyScripts = function() {

    let self = this;

    self.filepaths = [
        path.join(self.srcDir, `**/*${self.fileExt}`)
    ,   '!' + path.join(self.srcDir, `**/${self.omitFilePrefix}*${self.fileExt}`)
    ];

    self.scripts = fs.expand(self.globConfig, self.filepaths);

    if (!self.scripts.length > 0) {
        log(chalk.yellow('No files found.'));
        return;
    }

    self.scripts.map(self.uglifyScript, self);

};


module.exports = scripts;
