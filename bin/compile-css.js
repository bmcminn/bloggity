
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


const stylesPatterns = [
    path.join(styles.srcDir, `**/*${styles.fileExt}`)
,   '!' + path.join(styles.srcDir, `**/${styles.omitFilePrefix}*${styles.fileExt}`)
];


const globFiles = {
    filter: 'isFile'
};


const styleFiles = fs.expand(globFiles, stylesPatterns);


if (!styleFiles.length > 0) {
    console.log(chalk.yellow('No files found.'));
    return;
}


styleFiles.map(style => {

    log(chalk.green('> compiling', chalk.cyan(style)));

    let content     = fs.read(style).toString();
    let filepath    = style.substr(styles.srcDir.length + 1);
    let filename    = path.basename(filepath, styles.fileExt) + styles.renderFileExt;

    const destPath  = path.join(styles.destDir, filename);

    stylus(content)
        .set('filename',    style)
        .set('paths',       [ styles.srcDir ])
        .set('linenos',     !prod)  // render linenos when not prod
        .set('compress',    prod)   // compress when prod
        .render((err, css) => {
            if (err) { console.log(chalk.red(err)); return; }

            fs.write(destPath, css);

        })
        ;

});
