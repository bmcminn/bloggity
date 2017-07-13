/**
 * Allows for Nunjucks markup within markdown contents to be rendered with the current model context
 * @sauce: https://perishablepress.com/best-method-for-email-obfuscation/
 */



var renderFilter = function renderFilter(nunjucks) {

    'use strict';

    return function(content) {

        let ctx = {};

        content = md.render(content);

        // console.log(content);

        return nunjucks.renderString(content.trim(), ctx);
    };
};


module.exports = renderFilter;
