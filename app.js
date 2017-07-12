require('dotenv-safe').load();

const express   = require('express');
const chalk     = require('chalk');
const path      = require('path');
const fs        = require('grunt').file;
const _         = require('lodash');


const app = express();

global.radix = 10;


// SETUP DB INSTANCE
// -----------------------------------------------------------------

const db = require('./app/db.js');

app.set('db', db);


// CONFIGURE BASE APP MODEL
// -----------------------------------------------------------------

const configPath    = path.join(process.cwd(), 'config.yml');
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
const nunjucks          = require('./app/nunjucks.js');

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




// REGISTER HOMEPAGE HANDLER
// -----------------------------------------------------------------

app.get('/', function(req, res) {

    let db = req.app.get('db');

    let model = req.app.get('model');

    post = db.get('posts')
        .find({ isHomepage: true })
        .value()
        ;

    if (!post) {
        model.post = db.get('posts')
            .find({ doc: 'missing-homepage' })
            .value()
            ;

        res.status(404).render(model.post.template, model);
        return;
    }

    model.post = post;

    res.render(post.template, model);

});




// REGISTER POSTTYPE PAGES
// -----------------------------------------------------------------

let posttypes = db.get('posttypes').value();


_.each(posttypes, function(posttype) {

    console.log(posttype);

    // setup named route for post type
    let typeRoute = db.get('routes')
        .find({ name: posttype.name })
        .value()
        ;

    if (!typeRoute) {
        db.get('routes')
            .push({
                name: posttype.name
            ,   route: '/' + posttype.name
            })
            .write()
            ;
    }

    // setup route handler for posttype
    app.get(`/${posttype.name}`, function(req, res) {

        let db      = req.app.get('db');
        let model   = req.app.get('model');

        model.posts = db.get('posts')
            .filter({ posttype: posttype })
            .sortBy('published')
            .value()
            ;

        res.render(`pages/${posttype}`, model);
    });

    // setup route handler for
    app.get(`/${posttype}/:id`, getSubroute, function(req, res) {

        let db      = req.app.get('db');
        let model   = req.app.get('model');


        res.send('testing: ' + req.subroute);

        // model.post = db.get('posts')
        //     .find({ route: req.url })
        //     .value()
        //     ;

        // res.render(`pages/${posttype}-post`, model);

    })
});



function getSubroute(req, res, next) {

    let id = req.params.id;

    // check if ID is a page ID
    if (!id.match(/[a-z]{2,}/gi)) {
        req.subroute = 'paging';
        next();
        return;
    }


    // check if ID matches a taxonomy

    let tax = req.url.substr(1).split('/')[0];

    let taxies = db.get('taxonomies').find({ name: tax }).value();

    if (taxies) {
        req.subroute = 'taxonomies';
        next();
        return
    }



    req.subroute = 'pageId';

    next();
}


console.log(chalk.green('app started at', chalk.yellow(`http://localhost:${process.env.PORT}`)));

app.listen(process.env.PORT);
