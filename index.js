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


const isProduction = process.env.NODE_ENV === 'production';


const configYAMLpath = path.join(process.cwd(), 'config.yml');
const configYAML = fs.read(configYAMLpath);


global.NEDB     = require('nedb');
global.DB       = {};


// Create global app object
var app = express();


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


app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));


app.use(require('./middleware/get-content'));


app.get('/', function(req, res) {

    console.log('loading homepage');
    res.send(res.template);

});


app.set('PORT', process.env.PORT || 3505);
app.set('HOST', process.env.HOST || 'http://localhost');

app.listen(app.get('PORT'), () => {

    let msg = [ 'Site available at:', chalk.green(app.get('HOST') + ':' + app.get('PORT')) ].join(' ');
    let msgLength = chalk.stripColor(msg).length + 1;

    let spacer = new Array(msgLength + 6);

    let container = [
        ''
    ,   chalk.yellow(`.${spacer.join('-')}.`)
    ,   chalk.yellow(`|${spacer.join(' ')}|`)
    ,   chalk.yellow(`|   ${msg}   |`)
    ,   chalk.yellow(`|${spacer.join(' ')}|`)
    ,   chalk.yellow(` ${spacer.join('-')} `)
    ].join('\n')
    ;

    console.log(container);
});
