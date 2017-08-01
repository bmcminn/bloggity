const low   = require('lowdb');

// const YAML = require('yaml-js');


// const dbconf = {
//     storage: {
//         read:
//     ,   write:
//     }
// ,   format: {
//         serialize: YAML.serialize
//     ,   deseriealize: YAML.parse
//     }
// };


const db = low(process.cwd() + '/db/db.json');

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
