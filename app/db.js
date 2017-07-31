const low   = require('lowdb');

const db    = low(process.cwd() + '/db/db.json');

// if (process.env.NODE_ENV !== 'production') {
//     console.log('resetting db');
//     db.setState({});
// }


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
