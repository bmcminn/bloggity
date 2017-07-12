const low   = require('lowdb');

const db    = low(process.cwd() + '/db.json');

db
    .defaults({
        posts: []
    ,   posttypes: []
    ,   taxonomies: []
    ,   routes: []
    })
    .write()
;

module.exports = db;
