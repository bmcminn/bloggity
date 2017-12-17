
String.prototype.slugify = function() {
    return this
        .trim()
        .toLowerCase()
        .replace(/[^-\sa-z0-9]+/g, '') // remove all punctuation
        .replace(/\s+/, '-')            // replace all whitespace with hyphens
        ;
}



module.exports = String;
