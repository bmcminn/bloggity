const low   = require('lowdb');

const db    = low(process.cwd() + '/db.json');

db
    .defaults({
        posts: []
    ,   posttypes: []
    ,   taxonomies: []
    })
    .write()
;

module.exports = db;
