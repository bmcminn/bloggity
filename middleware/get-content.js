
const fs = require('grunt').file;


function getContent(req, res, next) {

    // we're on the homepage
    if (!req.params.length && req.url === '/') {
        res.template = 'wfsfjeklsfe';
        next();
    }

    console.log(req.params.length);
    console.log(req.url);

    res.template = '555555';

    next();

}


module.exports = getContent;
