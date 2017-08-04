require('dotenv-safe').load()


const path      = require('path');
const fs        = require('./fs.js');
const db        = require('./db.js');
const _         = db._;


const moment    = require('moment');
const fm        = require('gray-matter');


const fmOpts = {
    excerpt: true   // use this to get post descriptions/social media meta data snippets
,   excerpt_separator: '<!-- sep -->'
};

const IS_DEV = process.env.NODE_ENV === 'dev';



// GET LIST OF CONTENT FILES TO GROK
// ------------------------------------------------------------

let configPath  = path.resolve(__dirname, 'config.yaml');
let config      = fs.readYAML(configPath);
let posts       = db.get('posts').value();



// GET LIST OF CONTENT FILES TO GROK
// ------------------------------------------------------------

const contentDir = path.resolve(__dirname, '../content');

const contentPath = [
    path.resolve(contentDir, '**/*.md')
];

let files = fs.glob({ filter: 'isFile' }, contentPath);


console.log(contentDir);


// RUN INITIAL FILE LOOP TO COMPOSE 'POSTS' COLLECTION
// ------------------------------------------------------------

_.each(files, (filepath) => {

    let file = fm(fs.readFileSync(filepath, { encoding: 'utf-8' }), fmOpts);


    file = Object.assign({}, file, file.data);

    file.filepath = filepath;


    // GET POST/PAGE META DESCRIPTION
    file.description = file.excerpt;

    if (!file.description && IS_DEV) {
        file.description = file.content
            .replace(/[\s]+/g, ' ')
            .substr(0,60) + '...'
            ;

        file.MISSING_DESCRIPTION = true;
    }


    // GET FILE STATS
    file.stats = fs.statSync(filepath);


    // UPDATE TIMESTAMPS TO THEIR EPOCH EQUIVALENT
    file.published
        ? file.published = new Date(file.published).getTime()
        : null
        ;

    file.updated
        ? file.updated = new Date(file.stats.mtime).getTime()
        : null
        ;


    // IF THE FILE IS SCHEDULED TO BE PUBLISHED LATER
    file.published > Date.now()
        ? file.private = true
        : null
        ;


    // GET THE POST ROUTE
    file.route = file.filepath
        .substr(contentDir.length)  // remove content base dir
        .replace(/\.\S{2,}/, '')    // remove file extension
        ;


    // GET POST TYPE FROM POST ROUTE
    let posttype = file.route.substr(1).split('/')

    posttype.length > 1
        ? file.posttype = posttype[0]
        : file.posttype = 'page'
        ;


    // DETERMINE WHAT THE POST TEMPLATE FILE SHOULD BE IF NOT DEFINED
    if (!file.template) {
        file.posttype !== 'page'
            ? file.template = `pages/${file.posttype}-single`
            : file.template = 'pages/default'
            ;
    }


    // APPEND CANONICAL ID'S TO DB
    if (file.canonical) {
        db.get('series').push(file.canonical).write();  // push the tag to the collection

        let series = db.getState('series');

        series.series = _.uniq(series.series);

        db.setState(series);
    }


    // TRUNCATE CONTENT VALUE WHILE DEBUGGING
    if (IS_DEV) {
        file.content    = '[TRUNCATED] ' + file.content.substr(0, 60) + '...';
        file.stats      = '[REDACTED]';
    }

    // CLEAN UP DATA MODEL
    delete(file.data);
    delete(file.excerpt);


    // FORCE UNIQUE POSTS
    db.get('posts').push(file).write();

    let state = db.getState('series');

    state.posts = _.uniqBy(state.posts, 'filepath');

    db.setState(state);

});




// POSTTYPE LISTINGS
// -----------------------------------------------------------------

let postGroups = db.get('posts')
    .filter((p) => { return p.posttype !== 'page' })
    .groupBy('posttype')
    .value()
    ;

// console.log(postGroups);

// TODO: iterate over postGroups and generate listing pages

_.each(postGroups, (postGroup) => {

    // TODO: allow for custom handlers to come in for parsing posttypes/groups like this

    let posts = _.chunk(postGroup, config.paging.postCount);


    console.log(posts);

});




// SEO ROUND
// -----------------------------------------------------------------

posts = db.get('posts').value();

_.each(posts, (post) => {


    // DETERMINE PAGE PRIORITY FOR SITEMAP.XML GENERATION
    if (!post.priority) {
        post.isHomepage
            ? post.priority = 1.0
            : post.priority = 0.5
            ;
    }

    // TODO: setup maths to determine change frequency
    //  -- https://www.v9seo.com/blog/2011/12/27/sitemap-xml-why-changefreq-priority-are-important/

    // SET OLD POSTS TO LOWER PRIORITY
    let d = moment(Date.now());
    let yearsOld = d.diff(post.published, 'years', true).toFixed(2);

    if (yearsOld > 1) {
        post.priority = (0.3 / yearsOld).toFixed(1);
    }


    db.get('posts').find({ 'filepath': post.filepath }).assign(post).write();

});
