require('dotenv-safe').load();

const fs            = require('grunt').file;
const path          = require('path');
const http          = require('http');
const methods       = require('methods');
const express       = require('express');
const bodyParser    = require('body-parser');
// const session       = require('express-session');
const cors          = require('cors');
// const passport      = require('passport');
// const errorhandler  = require('errorhandler');
// const mongoose      = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';


const configYAMLpath = path.join(process.cwd(), 'config.yml');
const configYAML = fs.read(configYAMLpath);


// Create global app object
var app = express();

app.use(cors());


app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));


// asset compilation middleware
app.use(require('./middleware/compile-css'));
app.use(require('./middleware/compile-js'));









process.env.PORT = process.env.PORT || 3505;
process.env.HOST = process.env.HOST || 'http://localhost';

app.listen(process.env.PORT, () => {
    console.log(`\tServing ${process.env.HOST}:${process.env.PORT}`);
});
