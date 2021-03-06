require('dotenv-safe').load();


require(__dirname + '/app/db-init.js');
require(__dirname + '/app/watch.js');


const express   = require('express');
const chalk     = require('chalk');
const path      = require('path');
const fs        = require('grunt').file;
const _         = require('lodash');


const app = express();

global.radix = 10;



// SETUP DB INSTANCE
// -----------------------------------------------------------------

const db = require(__dirname + '/app/db.js');

app.set('db', db);



// CONFIGURE BASE APP MODEL
// -----------------------------------------------------------------

const configPath    = path.join(process.cwd(), 'app/config.yaml');
const config        = fs.readYAML(configPath);

const pkg           = require('./package.json');

delete(pkg.scripts);
delete(pkg.main);


let d = new Date();

config.date = {
    day:    d.getDate()
,   month:  d.getMonth()
,   year:   d.getFullYear()
};

app.set('model', Object.assign({}, pkg, config));



// SETUP STATIC ASSETS DIRECTORY
// -----------------------------------------------------------------

app.use(express.static(__dirname + '/public'));



// REGISTER STYLES AND SCRIPTS
// -----------------------------------------------------------------

// app.use(require('./middleware/register-assets'))



// SETUP VIEW ENGINE
// -----------------------------------------------------------------

const expressNunjucks   = require('express-nunjucks');
const nunjucks          = require(__dirname + '/app/nunjucks.js')(app);

app.set('view engine', 'twig')
app.set('views', __dirname + '/app/views');

expressNunjucks(app, {
    watch:      true
,   noCache:    !process.env.NODE_ENV === 'production'
// ,   tags:
,   loader:     nunjucks.reloader
,   filters:    nunjucks.filters
,   extension:  '.twig'
});





// HELPERS
// -----------------------------------------------------------------

String.prototype.toTitleCase = function toTitleCase() {
    return this.replace(/\w\S*/g, function(txt) {
        let str = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();

        // crazy specific rule for Irish/Scottish names
        // @sauce: https://stackoverflow.com/a/7153523
        str = str.replace(/Mc(.)/ig, function(m, m1) {
            return 'Mc' + m1.toUpperCase();
        });


        return str;
    });
}




// SETUP MIDDLEWARE TO GENERATE COLLECTION PAGES
// -----------------------------------------------------------------

// require(__dirname + '/app/middleware/register-collections.js')(app);

app.use(function(req, res, next) {

    let model = req.app.get('model');

    let parts = req.url.split('/');

    console.log(req.url);

    model.breadcrumbs = [];

    let route = '';

    _.each(parts, (p) => {
        model.breadcrumbs.push({
            label: p === '' ? 'Home' : p.replace(/[-_]+/g, ' ').toTitleCase()
        ,   route: (route += '/' + p).replace(/\/+/g, '/')
        })
    });

    req.app.set('model', model);

    next();

});



// REGISTER STATIC CONTENT ROUTES
// -----------------------------------------------------------------

let posts = db.get('posts')
    // // filter scheduled posts
    // .filter((p) => {
    //     return p.published < Date.now();
    // })
    .sortBy('route')
    .sortBy('priority')
    .value()
    ;



_.each(posts, function(post) {

    console.log('register route:', post.route);

    // setup route handler for post
    app.get(post.route, function(req, res) {

        let db      = req.app.get('db');
        let model   = req.app.get('model');

        if (post.canonical) {
            post.series = _.filter(_.clone(posts), function(p) {
                return (p.canonical === post.canonical);
            });
        }


        if (post.posts) {

            // define a page description for post listing pages
            post.description = post.posts[0].posttype + ' listing page'

            // TODO: manipulate the paging controls

            if (!post.title) {
                // define a page description for post listing pages
                if (post.posttype !== 'page') {
                    post.title = post.posts[0].posttype + ' listing page'
                }

            }

        }


        // if (!post.description) {

        //     // we can derive the page description from the post.content
        //     if (post.content) {
        //         post.description = post.content.substring(0, 60).replace(/[\r\n]+/, ' ') + '...';
        //     }
        // }



        model.post = post;

        model.model = model;

        res.render(post.template, model);
    });

});





// REGISTER AUTHOR LISTINGS
// -----------------------------------------------------------------

let model = app.get('model');


app.get('/authors', (req, res) => {

    let model   = req.app.get('model');
    let db      = req.app.get('db');

    let authors = model.authors;

    model.authors = [];

    _.each(authors, (a) => {

        let posts = db.get('posts')
            .filter((p) => {
                if (p.author) {
                    return p.author.name === a.name;
                }
                return false;
            })
            .value()
            ;

        a.postCount = posts.length;

        if (posts.length > 0) {
            model.authors.push(a);
        }

    });

    res.render('pages/authors-list', model);

});


_.each(model.authors, (author, name) => {

    app.get('/authors/:name', (req, res) => {

        let model   = req.app.get('model');
        let db      = req.app.get('db');

        // TODO: figure out means of having multiple authors

        model.posts = db.get('posts')
            .filter((p) => { return p.author; })
            .filter((p) => { return p.author.slug === req.params.name; })
            .value()
            ;

        model.author = model.posts[0].author;

        res.render('pages/author-list', model);

    });


});





// TODO: multi-index sitemap generation: https://www.sitemaps.org/protocol.html#index
app.get('/sitemap.xml', function(req, res) {

    let db      = req.app.get('db');
    let model   = req.app.get('model');


    model.posts = db.get('posts')
        .filter((p) => {
            return !p.private;
        })
        .value()
        ;

    model.model = model;

    res.render('sitemap', model);
});



console.log(chalk.green('app started at', chalk.yellow(`http://localhost:${process.env.PORT}`)));

app.listen(process.env.PORT);
