'use strict';

require('dotenv-safe').load();


if (process.env.NODE_ENV === 'production') {
    process.env.HOST = process.env.PROD_HOST;

} else {
    process.env.HOST = process.env.PROD_HOST + ':' + process.env.PORT;

}


const fs        = require('grunt').file;
fs.stats        = require('fs').statSync;
fs.defaultEncoding = 'utf8';

const path      = require('path');
const exec      = require('child_process').exec;
const db        = require('../app/db.js');
const pkg       = require('../package.json');
const ymf       = require('yaml-front-matter').loadFront;
const YAML      = require('yamljs');
const moment    = require('moment');

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

    // if the post already exists, don't add it
    if (post) { return; }

    // insert post to POSTS db collection
    db.get('posts')
        .push({ filepath: filepath })
        .write()
        ;

    updateContent(filepath, stats);

}



function updateContent(filepath, stats) {

    let snapshot = ymf(filepath, 'content');

    let file = Object.assign({}, snapshot);

    file.stats      = stats;
    file.filepath   = filepath;
    file.content    = file.content.trim();


    getPublished(file);
    getRoute(file);
    getIsHomepage(file);
    getTemplate(file);
    getPosttype(file);
    getTaxonomies(file);



    let post = db.get('posts')
        .find({ filepath: filepath })
        .value()
        ;

    if (post) {
        getUpdated(file);
        updateFileTimestamp(snapshot, post);
    }


    db.get('posts')
        .find({ filepath: filepath })
        .assign(file)
        .write()
        ;

    console.log('-------------------------------------------------------');

}



//
// FILE MODEL COMPOSITION HELPERS
//



function updateFileTimestamp(snapshot, obj) {

    console.log(chalk.yellow('updating file timestamp:', obj.filepath));

    // update file `updated` timestamp
    snapshot.updated = obj.updated;

    // capture file content
    let content = snapshot.content

    delete(snapshot.content);


    // update timestamp formats
    snapshot.published  = moment(snapshot.published).format('YYYY-MM-DD');
    snapshot.updated    = moment().format('YYYY-MM-DD');

    let fm  = YAML.stringify(snapshot);

    let file = [
        '---'
    ,   fm.trim()
    ,   '---'
    ,   content.trim()
    ].join('\n');

    fs.write(obj.filepath, file);

}



/**
 * [getUpdated description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getUpdated(obj) {
    obj.updated = (new Date()).getTime();
    return obj;
}


/**
 * [getTaxonomies description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getTaxonomies(obj) {
    if (obj.taxonomies) {
        _.each(obj.taxonomies, (value, key) => {

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

    return obj;
}


/**
 * [getRoute description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getRoute(obj) {
    obj.route = obj.filepath
        .substr(CONTENT_DIR.length)
        .replace(/\.[a-z]{2,4}$/, '') // remove file extension
        ;

    let namedRoute = db.get('routes')
        .find({ name: obj.name })
        .value()
        ;

    if (!namedRoute) {
        db.get('routes')
            .push({
                name: obj.name
            ,   route: obj.route
            })
            .write()
            ;
    }

    return obj;
}


/**
 * [getPublished description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getPublished(obj) {
    obj.published
        ? obj.published = new Date(obj.published).getTime()
        : obj.published = new Date().getTime()
        ;

    return obj;
}


/**
 * [getPosttype description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getPosttype(obj) {
    let route = obj.filepath
        .substr(CONTENT_DIR.length)
        .replace(/\.[a-z]{2,4}$/, '') // remove file extension
        ;

    let posttype = route.substr(1).split('/');

    // determine posttype from filepath content directory
    if (posttype.length > 1) {
        obj.posttype = posttype[0];

    } else {
        obj.posttype = 'page'

    }

    let dbPostType = db.get('posttypes')
        .find({ name: obj.posttype })
        .value()
        ;

    if (!dbPostType) {
        db.get('posttypes')
            .push({
                name: obj.posttype
            ,   taxonomies: db._.keys(obj.taxonomies)
            })
            .write()
            ;
    }

    return obj;
}


/**
 * [getTemplate description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getTemplate(obj) {

    // user config templates take precedence!!!
    if (obj.template) {
        return obj;
    }

    // if template not provided, we check for a posttype template
    if (obj.posttype) {
        let template = `pages/${obj.posttype}-single`;
        let templateFilepath = path.join(VIEWS_DIR, template + process.env.VIEWS_EXT);

        if (fs.exists(templateFilepath)) {
            obj.template = template;
        }
    }

    // all else fails, we use the default template
    if (!obj.template) {
        obj.template = 'pages/default';
    }

    return obj;
}


/**
 * [getIsHomepage description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getIsHomepage(obj) {
    // setup named route for content page
    if (obj.isHomepage) {
        obj.name = 'homepage';
        obj.route = '/';

    } else {
        obj.name = path.basename(obj.filepath, path.extname(obj.filepath));
    }

    return obj;
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

    // console.log(chalk.green('migrated images'));
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

    // console.log(chalk.green('migrated SVGs'));
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
