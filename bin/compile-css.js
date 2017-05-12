
const fs        = require('grunt').file;
const path      = require('path');
const chalk     = require('chalk');
const stylus    = require('stylus');

const pkgSrc    = path.join(process.cwd(), 'package.json');
const pkg       = fs.readJSON(pkgSrc);

const configSrc = path.join(process.cwd(), 'config.yml');
const Config    = fs.readYAML(configSrc);

const PROD      = !!process.env.production;  // coerce env.production to bool
const log       = console.log.bind(console);


const styles = {
    omitFilePrefix: '_'
,   fileExt:        '.styl'
,   renderFileExt:  '.css'

,   srcDir:     path.join(process.cwd(), Config.site.clientDir + '/css')
,   destDir:    path.join(process.cwd(), Config.site.publicDir + '/css')

,   globConfig: {
        filter: 'isFile'
    }
};


styles.renderStylesheet = function(style) {

    let self = this;

    let content     = fs.read(style).toString();
    let filepath    = style.substr(self.srcDir.length + 1);
    let filename    = path.basename(filepath, self.fileExt) + self.renderFileExt;

    const destPath  = path.join(self.destDir, filename);

    log(chalk.green('> compiling', chalk.cyan(style), chalk.yellow('->'), chalk.cyan(destPath)));

    stylus(content)
        .set('filename',    style)
        .set('paths',       [ self.srcDir ])
        .set('linenos',     !PROD)  // render linenos when not prod
        .set('compress',    PROD)   // compress when prod
        .render((err, css) => {
            if (err) { log(chalk.red(err)); return; }
            fs.write(destPath, css);

        })
        ;

};


styles.renderStylesheets = function() {

    let self = this;

    self.filepaths = [
        path.join(self.srcDir, `**/*${self.fileExt}`)
    ,   '!' + path.join(self.srcDir, `**/${self.omitFilePrefix}*${self.fileExt}`)
    ];

    self.stylesheets = fs.expand(self.globConfig, self.filepaths);

    if (self.stylesheets.length <= 0) {
        log(chalk.yellow('No files found.'));
        return;
    }

    self.stylesheets.map(self.renderStylesheet, self);

};


module.exports = styles;
