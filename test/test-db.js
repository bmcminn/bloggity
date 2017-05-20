const DB = require('../middleware/db.js');



DB.init();


DB.backup();

console.log(DB);

