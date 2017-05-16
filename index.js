require('dotenv-safe').load();

const fs            = require('grunt').file;
const path          = require('path');
const http          = require('http');
const methods       = require('methods');
const chalk         = require('chalk');
const express       = require('express');
const chokidar      = require('chokidar');
const bodyParser    = require('body-parser');
const cors          = require('cors');


const configYAMLpath = path.join(process.cwd(), 'config.yml');
const configYAML = fs.read(configYAMLpath);



const app = express();


app.set('isProduction', process.env.NODE_ENV === 'production');


app.set('CONTENT_DIR', 'content')

app.set('config', fs.readYAML(configYAMLpath));

console.log(['', chalk.yellow('// [BUILD ASSETS]'), ''].join('\n'));
(require('./bin/compile-css')).renderStylesheets();
(require('./bin/compile-js')).uglifyScripts();


chokidar.watch('./content/', {
    persistent: true
})
    .on('add',      require('./middleware/file-add-handler'))
    .on('change',   require('./middleware/file-change-handler'))
    .on('delete',   require('./middleware/file-delete-handler'))
    ;


app.use(cors());



// SETUP LOGGING MIDDLEWARE
// -----------------------------------------------------------------

app.use(require('morgan')('dev'));



// SETUP MAIN DIRECTORIES
// -----------------------------------------------------------------

app.set('paths', {
    public:     path.join(process.cwd(), 'public')
,   content:    path.join(process.cwd(), 'content')
// ,   css:        path.join(process.cwd(), '')
,   db:         path.join(process.cwd(), '__db')
,   bin:        path.join(process.cwd(), 'bin')
,   middleware: path.join(process.cwd(), 'middleware')
,   views:      path.join(process.cwd(), 'views')
});



// SETUP BODY PARSER MIDDLEWARE
// -----------------------------------------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// SETUP VIEW ENGINE
// -----------------------------------------------------------------

const expressNunjucks   = require('express-nunjucks');
const nunjucks          = require('./bin/nunjucks');

app.set('view engine', 'twig')
app.set('views', __dirname + '/views');

expressNunjucks(app, {
    watch:      false
,   noCache:    !app.get('isProduction')
// ,   tags:
,   loader:     nunjucks.reloader
,   filters:    nunjucks.filters
});




// REGISTER STYLES AND SCRIPTS
// -----------------------------------------------------------------

app.use(require('./middleware/register-assets'))




app.use(require('method-override')());


// SETUP STATIC DIRECTORY MIDDLEWARE
// -----------------------------------------------------------------

app.use(express.static(__dirname + '/public'));


// SETUP LOGGING MIDDLEWARE
// -----------------------------------------------------------------

app.use(require('./middleware/get-content'));





// SETUP ROUTER MIDDLERWARE
// -----------------------------------------------------------------

app.get('/', function(req, res) {

    console.log('loading homepage');
    res.render('pages/default');

});



// app.get('/:taxonomy/:target/', (req, res) => {

//     let msg = {};

//     msg.url         = req.url;
//     msg.taxonomy    = req.params.taxonomy;
//     msg.target    = req.params.target;


//     let filepath = path.join(process.cwd(), req.app.get('paths').content, req.url);


//     // check if .md file exists
//     let isFileMd = path.join(filepath + '.md');

//     if (fs.exists(isFileMd)) {
//         msg.filepath    = isFileMd;
//         msg.isPost      = true;
//     }


//     // if the file doesn't exist
//     if (!msg.filepath) {
//         msg.status = 404;
//         res.status(404).json(msg);
//     }

//     res.json(msg);
// });




app.set('PORT', process.env.PORT || 3505);
app.set('HOST', process.env.HOST || 'http://localhost');

app.listen(app.get('PORT'), () => {

    let siteInfo = [ chalk.yellow('Site available at:'), chalk.green(app.get('HOST') + ':' + app.get('PORT')) ].join(' ');
    let msgLength = chalk.stripColor(siteInfo).length + 1;

    let maxLength = 80;
    let sideSpace = (maxLength - msgLength);

    let spacer = new Array(msgLength + sideSpace);

    let tmpSpace = new Array(Math.ceil(sideSpace / 2));
    let msg = tmpSpace.join(' ') + siteInfo + tmpSpace.join(' ');

    if (chalk.stripColor(msg).length < maxLength) {
        let tmpSpace2 = new Array(Math.ceil(sideSpace / 2) + (maxLength - chalk.stripColor(msg).length - 1));
        msg = tmpSpace.join(' ') + siteInfo + tmpSpace2.join(' ');
    }

    let container = [
        ''
    ,   chalk.blue(`+${spacer.join('-')}+`)
    ,   ''
    ,   chalk.yellow("                   ,                                         ,               ")
    ,   chalk.yellow("     `7MM\"\"\"Yp, `7MM                                  db    mm                ")
    ,   chalk.yellow("       MM    Yb   MM                                        MM                ")
    ,   chalk.yellow("       MM    dP   MM   ,pW\"Wq.    .P\"Ybm`   .P\"Ybm` `7MM  mmMMmm `7M'   `MF'  ")
    ,   chalk.yellow("       MM\"\"\"bg.   MM  6W'   `Wb  :MI  I8   :MI  I8    MM    MM     VA   ,V    ")
    ,   chalk.yellow("       MM    `Yb  MM  8M     M8   WmmmP\"    WmmmP\"    MM    MM      VA ,V     ")
    ,   chalk.yellow("       MM    ,9P  MM  YA.   ,A9  8M        8M         MM    MM       VVV      ")
    ,   chalk.yellow("     .JMMmmmd9` .JMML. `Ybmd9'    YMMMMMb   YMMMMMb .JMML.  `Mbmo    ,V       ")
    ,   chalk.yellow("                                 6'     dP 6'     dP                ,V        ")
    ,   chalk.yellow("                                  Ybmmmd'   Ybmmmd'               OOb\"         ")
    ,   ''
    ,   chalk.blue(`+${spacer.join('-')}+`)
    ,   chalk.blue(`|${spacer.join(' ')}|`)
    ,   chalk.blue(`|${msg}|`)
    ,   chalk.blue(`|${spacer.join(' ')}|`)
    ,   chalk.blue(`+${spacer.join('-')}+`)
    ,   ''
    ].join('\n')
    ;

    console.log(container);
});
