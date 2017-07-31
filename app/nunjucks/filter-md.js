/**
 * { item_description }
 * @sauce: https://perishablepress.com/best-method-for-email-obfuscation/
 */

const md    = require('markdown-it')();
const prism = require('markdown-it-prism');

let opts = {

} ;

md.use(prism, opts);


var mdFilter = function mdFilter(nunjucks) {

    'use strict';

    return function(content) {

        content = md.render(content);

        // console.log(content);

        return new nunjucks.runtime.SafeString(content.trim());
    };
};


module.exports = mdFilter;
