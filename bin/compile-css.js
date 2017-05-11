
const fs        = require('grunt').file;
const path      = require('path');
const chalk     = require('chalk');
const stylus    = require('stylus');

const pkgSrc    = path.join(process.cwd(), 'package.json');
const pkg       = fs.readJSON(pkgSrc);

const configSrc = path.join(process.cwd(), 'config.yml');
const Config    = fs.readYAML(configSrc);

const prod      = !!process.env.production;  // coerce env.production to bool
const log       = console.log.bind(console);



const styles = {
    omitFilePrefix: '_'
,   fileExt:        '.styl'
,   renderFileExt:  '.css'

,   srcDir:     path.join(process.cwd(), Config.site.clientDir + '/css')
,   destDir:    path.join(process.cwd(), Config.site.publicDir + '/css')
};


styles.renderStylesheets = function() {
    let self = this;

    self.filepaths = [
        path.join(self.srcDir, `**/*${self.fileExt}`)
    ,   '!' + path.join(self.srcDir, `**/${self.omitFilePrefix}*${self.fileExt}`)
    ];

    self.globConfig = {
        filter: 'isFile'
    };

    self.stylesheets = fs.expand(self.globConfig, self.filepaths);

    if (self.stylesheets.length <= 0) {
        console.log(chalk.yellow('No files found.'));
        return;
    }

    self.stylesheets.map(self.renderStylesheet)

};


styles.renderStylesheet = function renderStylesheet(style) {

    let self = this;

    log(chalk.green('> compiling', chalk.cyan(style)));

    let content     = fs.read(style).toString();
    let filepath    = style.substr(self.srcDir.length + 1);
    let filename    = path.basename(filepath, self.fileExt) + self.renderFileExt;

    const destPath  = path.join(self.destDir, filename);

    stylus(content)
        .set('filename',    style)
        .set('paths',       [ self.srcDir ])
        .set('linenos',     !prod)  // render linenos when not prod
        .set('compress',    prod)   // compress when prod
        .render((err, css) => {
            if (err) { console.log(chalk.red(err)); return; }
            fs.write(destPath, css);

        })
        ;

};



module.exports = styles;
