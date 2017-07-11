"strict";

require('dotenv-safe').load();


if (process.env.NODE_ENV === 'production') {
    process.env.HOST = process.env.PROD_HOST;

} else {
    process.env.HOST = process.env.PROD_HOST + ':' + process.env.PORT;

}


const fs    = require('grunt').file;
fs.stats    = require('fs').statSync;
fs.defaultEncoding = 'utf8';

const path  = require('path');
const exec  = require('child_process').exec;
const db    = require('../app/db.js');
const pkg   = require('../package.json');
const ymf   = require('yaml-front-matter').loadFront;

const _         = require('lodash');
const chalk     = require('chalk');
const chokidar  = require('chokidar');

const SVGO      = require('svgo');
const svgo      = new SVGO({

});


const isProduction = process.env.NODE_ENV === 'production' ? true : false;


global.APP_DIR      = path.join(process.cwd(), 'app');
global.VIEWS_DIR    = path.join(process.cwd(), 'app/views');
global.PUBLIC_DIR   = path.join(process.cwd(), 'public');
global.CONTENT_DIR  = path.join(process.cwd(), 'content');

// Ensure public directory structures exist
global.ASSET_DIRS = {
    CSS:    'css'
,   IMG:    'images'
,   JS:     'js'
,   FONTS:  'fonts'
};


_.each(ASSET_DIRS, function(pubDir, id) {
    let dir = path.join(PUBLIC_DIR, pubDir);

    if (!fs.exists(dir)) {
        fs.mkdir(dir);
    }
});


// INDEX DB AS NEEDED
let files = fs.expand([
    path.resolve(CONTENT_DIR, '**/*.md')
]);


_.each(files, function(filepath) {
    addContent(filepath, fs.stats(filepath));
});


// RUN INITIAL BUILD ON START UP
styles();
scripts();
images();
fonts();


chokidar
    .watch([
            APP_DIR + '/**/*'
        ,   CONTENT_DIR + '/**/*'
        ], {
            ignored: /(^|[\/\\])\../
        ,   persistent: true
        })

    .on('add', function(filepath, stats) {

        filepath = filepath.replace(/\\+/g, '/');

        let ext = path.extname(filepath);

        if (ext.match(/\.(md|markdown|mdown)$/)) { addContent(filepath, stats); }

    })

    .on('unlink', function(filepath, stats) {

        filepath = filepath.replace(/\\+/g, '/');

        let ext = path.extname(filepath);

        if (ext.match(/\.(md|markdown|mdown)$/)) { deleteContent(filepath); }
    })

    .on('change', function(filepath, stats) {

        filepath = filepath.replace(/\\+/g, '/');

        let ext = path.extname(filepath);

        if (ext.match(/\.(md)$/)) { updateContent(filepath, stats); }
        if (ext.match(/\.(eot|woff|woff2|ttf|otf)$/)) { fonts(); }
        if (ext.match(/\.(jpeg|jpg|png|gif|tiff)$/)) { images(); }
        if (ext.match(/\.(js)$/)) { scripts(); }
        if (ext.match(/\.(styl)$/)) { styles(); }
        if (ext.match(/\.(svg)$/)) { svg(); }

    })
;


// START UP APP
require('../app.js');


//
// ADD/UPDATE CONTENT IN DATABASE
//

function deleteContent(filepath) {

    db.get('posts')
        .find({ filepath: filepath })
        .remove()
        // .assign({ isDeleted: true })
        .write()
        ;
}


function addContent(filepath, stats) {

    let post = db.get('posts')
        .find({ filepath: filepath })
        .value()
        ;

    if (post) { return; }


    let file = ymf(filepath, 'content');

    file.published
        ? file.published = new Date(file.published).getTime()
        : file.published = new Date().getTime()
        ;

    file.content    = file.content.trim();
    file.filepath   = filepath;
    file.template   = file.template || 'pages/default';

    let route = filepath.substr(CONTENT_DIR.length);

    file.route = route.replace(/\.[a-z]{2,4}$/, '');

    let posttype = route.substr(1).split('/');

    console.log('posttype', posttype);

    if (posttype.length > 1) {
        file.posttype = posttype[0];

        let dbPosttypes = db.get('posttypes')
            .value()
            ;

        dbPosttypes.push(file.posttype);
        dbPosttypes = _.uniq(dbPosttypes);

        db.set('posttypes', dbPosttypes)
            .write()
            ;

        console.log(filepath, ':', file.posttype);
    }


    // insert post to POSTS db collection
    db.get('posts')
        .push(file)
        .write()
        ;


    if (file.taxonomies) {
        _.each(file.taxonomies, (value, key) => {

            let tax = db.get('taxonomies').find({ name: key }).value();

            if (tax) {
                tax.props = _.merge(tax.props, value);

                db.get('taxonomies')
                    .find({ name: key })
                    .assign(tax)
                    .write();

            } else {

                db.get('taxonomies')
                    .push({
                        name: key
                    ,   props: value
                    })
                    .write()
                    ;

            }

        });
    }

}



function updateContent(filepath, stats) {

    console.log(chalk.green('updating'), chalk.yellow(filepath));

    let file = ymf(filepath, 'content');

    file.updated = new Date();
    file.content = file.content.trim();

    db.get('posts')
        .find({ filepath: filepath })
        .assign(file)
        .write()
        ;

}




//
// MIGRATE IMAGE ASSETS TO PUBLIC DIRECTORY
//

function images() {

    // TODO: leverage kraken.io API to optimize image assets for production
    //   -- https://www.npmjs.com/package/kraken

    let images = fs.expand({ filter: 'isFile' }, [
            path.join(APP_DIR, ASSET_DIRS.IMG, '**/*')
        ]);

    _.each(images, function(filepath) {
        // console.log(filepath);
        let filename = filepath
                .replace(/\s+/gi, '-')
                .toLowerCase()
                .substr(path.join(APP_DIR, ASSET_DIRS.IMG).length)
            ;

        let newImage = path.join(PUBLIC_DIR, ASSET_DIRS.IMG, filename);

        fs.copy(filepath, newImage);
    });

    console.log(chalk.green('migrated images'));

}



//
// MIGRATE IMAGE ASSETS TO PUBLIC DIRECTORY
//

function svg() {

    let svgs = fs.expand({ filter: 'isFile' }, [
            path.join(APP_DIR, ASSET_DIRS.IMG, '**/*')
        ]);


    _.each(svgs, function(filepath) {

        let filename = filepath
                .replace(/\s+/gi, '-')
                .toLowerCase()
                .substr(path.join(APP_DIR, ASSET_DIRS.IMG).length)
            ;

        let newFilepath = path.join(PUBLIC_DIR, ASSET_DIRS.IMG, filename);

        let content = fs.read(filepath, { encoding: 'utf-8' });

        if (isProduction) {

            svgo
                .optimize(content, function(res) {
                    fs.write(newFilepath, res.data);
                })
            ;

        } else {
            fs.copy(filepath, newFilepath);

        }

    });

    console.log(chalk.green('migrated SVGs'));

}



//
// MIGRATE FONT ASSETS
//

function fonts() {

    let fonts = fs.expand({ filter: 'isFile' }, [
            path.join(APP_DIR, ASSET_DIRS.FONTS, '**/*')
        ]);

    _.each(fonts, function(filepath) {
        // console.log(image);
        let filename = filepath
                .replace(/\s+/gi, '-')
                .toLowerCase()
                .substr(path.join(APP_DIR, ASSET_DIRS.FONTS).length)
            ;

        let newFont = path.join(PUBLIC_DIR, ASSET_DIRS.FONTS, filename);

        if (!fs.exists(newFont)) {
            fs.copy(filepath, newFont);
        }
    });

    console.log(chalk.green('migrated fonts'));

}



//
// COMPILE JS FILES
//

function scripts() {

    let Uglify = require('uglify-js');

    let scripts = fs.expand({ filter: 'isFile' }, [
            path.join(APP_DIR, ASSET_DIRS.JS, '**/*')
        ]);

    _.each(scripts, function(script) {
        let filename = script
                .replace(/\s+/gi, '-')
                .toLowerCase()
                .substr(path.join(APP_DIR, ASSET_DIRS.JS).length)
            ;

        let newImage = path.join(PUBLIC_DIR, ASSET_DIRS.JS, filename);

        if (process.env.production) {
            let content = Uglify.minify(fs.read(script), {fromString: true});

            fs.write(newImage, content.code, { encoding: 'utf8' });

        } else {
            fs.copy(script, newImage);
        }

    });

    console.log(chalk.green('compiled JS'));

}



//
// COMPILE STYLES
//

function styles() {

    let Stylus = require('stylus');

    let styles = fs.expand({ filter: 'isFile' }, [
            path.join(APP_DIR, ASSET_DIRS.CSS, '**/*')
        ,   "!"+path.join(APP_DIR, ASSET_DIRS.CSS, '**/_*')
        ]);


    _.each(styles, function(style) {
        let filename = path.basename(style)
                .replace(/\s+/, '-')
                .toLowerCase()
            ;

        let newStyle = path.join(PUBLIC_DIR, ASSET_DIRS.CSS, filename.replace(/\.[\w\d]+/, '.css'));

        let content = fs.read(style);

        Stylus(content)
            .set('filename',    style)
            .set('paths',       [ path.join(APP_DIR, ASSET_DIRS.CSS, '/') ])
            .set('linenos',     process.env.NODE_ENV ? false : true)
            .set('compress',    process.env.NODE_ENV ? true : false)
            .render(function(err, css) {

                if (err) {
                    console.error(err);
                }

                // console.log(css);
                fs.write(newStyle, css);
            })
        ;

    });

    console.log(chalk.green('compiled styles'));

}
