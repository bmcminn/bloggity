require('dotenv-safe').load();

const express   = require('express');
const chalk     = require('chalk');
const path      = require('path');
const fs        = require('grunt').file;
const _         = require('lodash');


const app = express();


// setup DB instance
const db = require('./app/db.js');

app.set('db', db);


// configure base app model
const configYAMLpath    = path.join(process.cwd(), 'config.yml');
const config            = fs.readYAML(configYAMLpath);

let d = new Date();

config.date = {
    day:    d.getDate()
,   month:  d.getMonth()
,   year:   d.getFullYear()
};

app.set('model', config);


// setup static assets directory
app.use(express.static(__dirname + '/public'));


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



//
//
//

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



let posttypes = db.get('posttypes').value();


_.each(posttypes, function(posttype) {
    app.get(`/${posttype}`, function(req, res) {

        let db      = req.app.get('db');
        let model   = req.app.get('model');

        model.posts = db.get('posts')
            .filter({ posttype: posttype })
            .sortBy('published')
            .value()
            ;

        res.render(`pages/${posttype}`, model);
    });


    app.get(`/${posttype}/:id`, function(req, res) {

        let db      = req.app.get('db');
        let model   = req.app.get('model');

        let id = req.params.id;

        console.log(id, req.url);

        if (typeof id === 'number') {
            res.write('number' + id);
        }

        if (typeof id === 'string') {

            model.post = db.get('posts')
                .find({ route: req.url })
                .value()
                ;

            res.render(`pages/${posttype}-post`, model);
        }

    })
});






// TODO: figure out how to query collections within collections
// let taxonomies = db.get('taxonomies')
//     .value()
//     ;

// console.log('tax:', taxonomies);

// _.each(taxonomies, function(tax) {

//     app.get(`/${tax}/:page?`, function(req, res) {

//         let model = req.app.get('model');

//         console.log(req.params.page);

//         let db = req.app.get('db');

//         model.posts = db.get('posts')
//             .filter({ taxonomies: tax })
//             .value()
//             ;

//         console.log(model.posts);

//         res.render('pages/taxonomies', model);

//     });



//     app.get(`/${tax.name}/:taxonomy`, function(req, res) {

//     });

// });






console.log(chalk.green('app started at', chalk.yellow(`http://localhost:${process.env.PORT}`)));
app.listen(process.env.PORT);

// const fs            = require('grunt').file;
// const path          = require('path');
// const http          = require('http');
// const methods       = require('methods');
// const chalk         = require('chalk');
// const express       = require('express');
// const chokidar      = require('chokidar');
// const bodyParser    = require('body-parser');
// const cors          = require('cors');

// const pkg = fs.readJSON(path.join(__dirname, 'package.json'));

// const app = express();


// app.set('isProduction', process.env.NODE_ENV === 'production');


// app.set('CONTENT_DIR', 'content')


// app.set('config', fs.readYAML(configYAMLpath));


// console.log(['', chalk.yellow('// [BUILD ASSETS]'), ''].join('\n'));
// (require('./bin/compile-css')).renderStylesheets();
// (require('./bin/compile-js')).uglifyScripts();


// chokidar.watch('./content/', {
//     persistent: true
// })
//     .on('add',      require('./middleware/file-add-handler'))
//     .on('change',   require('./middleware/file-change-handler'))
//     .on('delete',   require('./middleware/file-delete-handler'))
//     ;


// app.use(cors());



// // SETUP LOGGING MIDDLEWARE
// // -----------------------------------------------------------------

// app.use(require('morgan')('dev'));



// // SETUP MAIN DIRECTORIES
// // -----------------------------------------------------------------

// app.set('paths', {
//     public:     path.join(process.cwd(), 'public')
// ,   content:    path.join(process.cwd(), 'content')
// // ,   css:        path.join(process.cwd(), '')
// ,   db:         path.join(process.cwd(), '__db')
// ,   bin:        path.join(process.cwd(), 'bin')
// ,   middleware: path.join(process.cwd(), 'middleware')
// ,   views:      path.join(process.cwd(), 'views')
// });



// // SETUP BODY PARSER MIDDLEWARE
// // -----------------------------------------------------------------

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());






// // REGISTER STYLES AND SCRIPTS
// // -----------------------------------------------------------------

// app.use(require('./middleware/register-assets'))




// app.use(require('method-override')());


// // SETUP STATIC DIRECTORY MIDDLEWARE
// // -----------------------------------------------------------------

// app.use(express.static(__dirname + '/public'));


// // SETUP LOGGING MIDDLEWARE
// // -----------------------------------------------------------------

// app.use(require('./middleware/get-content'));

// // app.use(require('./middleware/get-content'));




// // SETUP ROUTER MIDDLERWARE
// // -----------------------------------------------------------------

// app.get('/', function(req, res) {

//     res.render(req.app.locals.template);

// });




// // app.get('/:taxonomy/:target/', (req, res) => {


// //     let msg = {};

// //     msg.url         = req.url;
// //     msg.taxonomy    = req.params.taxonomy;
// //     msg.target    = req.params.target;


// //     let filepath = path.join(process.cwd(), req.app.get('CONTENT_DIR'), req.url);
// //     let filepath = path.join(process.cwd(), req.app.get('paths').content, req.url);

// //     // check if .md file exists
// //     let isFileMd = path.join(filepath + '.md');

// //     // check if .md file exists
// //     let isFileMd = path.join(filepath + '.md');

// //     if (fs.exists(isFileMd)) {
// //         msg.filepath    = isFileMd;
// //         msg.isPost      = true;
// //     }


// //     // if the file doesn't exist
// //     if (!msg.filepath) {
// //         msg.status = 404;
// //         res.status(404).json(msg);
// //     }

// //     if (fs.exists(isFileMd)) {
// //         msg.filepath    = isFileMd;
// //         msg.isPost      = true;
// //     }


// //     // if the file doesn't exist
// //     if (!msg.filepath) {
// //         msg.status = 404;
// //         res.status(404).json(msg);
// //     }

// //     res.json(msg);
// // });




// app.set('PORT', process.env.PORT || 3505);
// app.set('HOST', process.env.HOST || 'http://localhost');

// app.listen(app.get('PORT'), () => {

//     let siteInfo = [ chalk.yellow('Site available at:'), chalk.green(app.get('HOST') + ':' + app.get('PORT')) ].join(' ');
//     let msgLength = chalk.stripColor(siteInfo).length + 1;

//     let maxLength = 80;
//     let sideSpace = (maxLength - msgLength);

//     let spacer = new Array(msgLength + sideSpace);

//     let tmpSpace = new Array(Math.ceil(sideSpace / 2));
//     let msg = tmpSpace.join(' ') + siteInfo + tmpSpace.join(' ');

//     if (chalk.stripColor(msg).length < maxLength) {
//         let tmpSpace2 = new Array(Math.ceil(sideSpace / 2) + (maxLength - chalk.stripColor(msg).length - 1));
//         msg = tmpSpace.join(' ') + siteInfo + tmpSpace2.join(' ');
//     }

//     let container = [
//         ''
//     ,   chalk.blue(`+${spacer.join('-')}+`)
//     ,   ''
//     ,   chalk.yellow("                   ,                                         ,               ")
//     ,   chalk.yellow("     `7MM\"\"\"Yp, `7MM                                  db    mm                ")
//     ,   chalk.yellow("       MM    Yb   MM                                        MM                ")
//     ,   chalk.yellow("       MM    dP   MM   ,pW\"Wq.    .P\"Ybm`   .P\"Ybm` `7MM  mmMMmm `7M'   `MF'  ")
//     ,   chalk.yellow("       MM\"\"\"bg.   MM  6W'   `Wb  :MI  I8   :MI  I8    MM    MM     VA   ,V    ")
//     ,   chalk.yellow("       MM    `Yb  MM  8M     M8   WmmmP\"    WmmmP\"    MM    MM      VA ,V     ")
//     ,   chalk.yellow("       MM    ,9P  MM  YA.   ,A9  8M        8M         MM    MM       VVV      ")
//     ,   chalk.yellow("     .JMMmmmd9` .JMML. `Ybmd9'    YMMMMMb   YMMMMMb .JMML.  `Mbmo    ,V       ")
//     ,   chalk.yellow("                                 6'     dP 6'     dP                ,V        ")
//     ,   chalk.yellow("                                  Ybmmmd'   Ybmmmd'               OOb\"         ")
//     ,   ''
//     ,   chalk.blue(`+${spacer.join('-')}+`)
//     ,   chalk.blue(`|${spacer.join(' ')}|`)
//     ,   chalk.blue(`|${msg}|`)
//     ,   chalk.blue(`|${spacer.join(' ')}|`)
//     ,   chalk.blue(`+${spacer.join('-')}+`)
//     ,   ''
//     ].join('\n')
//     ;

//     console.log(container);
// });
