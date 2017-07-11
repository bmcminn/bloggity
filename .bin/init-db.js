const fs    = require('grunt').file;
const path  = require('path');
const chalk = require('chalk');

fs.stats    = require('fs').statSync;


// utility libraries
//

// db instance
const db    = require('../app/db.js');
