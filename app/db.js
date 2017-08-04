const low   = require('lowdb');

const db = low(__dirname + '/db/db.json');

db
    .defaults({
        posts: []
    ,   series: []
    ,   posttypes: []
    ,   taxonomies: []
    ,   routes: []
    })
    .write()
;

module.exports = db;
