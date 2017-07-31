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

const configPath    = path.join(process.cwd(), 'config/config.yml');
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
const nunjucks          = require('./app/nunjucks.js')(app);

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




// REGISTER STATIC CONTENT ROUTES
// -----------------------------------------------------------------

let posts = db.get('posts')
    .filter((p) => {
        return !p.published < Date.now();
    })
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


        if (post.canonical)


        model.post = post;

        model.model = model;

        res.render(post.template, model);
    });

});



// TODO: multi-index sitemap generation: https://www.sitemaps.org/protocol.html#index
app.get('/sitemap.xml', function(req, res) {

    let db      = req.app.get('db');
    let model   = req.app.get('model');


    model.posts = posts;


    res.render('sitemap', model);
});




console.log(chalk.green('app started at', chalk.yellow(`http://localhost:${process.env.PORT}`)));

app.listen(process.env.PORT);
