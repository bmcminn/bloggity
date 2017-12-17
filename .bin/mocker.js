const path          = require('path')
const fs            = require('./../.helper/fs');
const faker         = require('faker')
const _             = require('lodash')
const Promise       = require('bluebird')

String = require('./../.helper/string.js');

// const _db           = require('lowdb')
// const bodyParser    = require('body-parser')
// const Express       = require('express')
// const lowdbApi      = require('lowdb-api')
// const MDit          = require('markdown-it')
// const prism         = require('prismjs')

let tasks = [];

let contentDir = path.join(process.cwd(), '/content');


let count = new Array(30);


let authors = _.uniq([
    faker.name.findName()
,   faker.name.findName()
,   faker.name.findName()
,   faker.name.findName()
]);


for (var i = count.length - 1; i >= 0; i--) {

    console.log(i);

    let dates = [
        new Date()
    ,   faker.date.past(5)
    ,   faker.date.future(1)
    ];

    let title       = faker.company.catchPhrase();
    let author      = rando(...authors);
    let published   = rando(...dates);

    let draft       = !!randomInt(0,1);

    let content = ['---'];

    content.push(line('title:', title));
    content.push(line('author:', author));
    content.push(line('published:', published));

    if (draft) { content.push(line('draft: ', draft)) }


    content.push('---');


    // generate 2-5 paragrphics
    for (var i = randomInt(1,4); i >= 0; i--) {
        content.push(faker.lorem.paragraph(1));
        content.push('');
    }


    content.push('','','');

    console.log(content.join('\n'));

    // fs.write(`${contentDir}/${title.slugify()}.md`, content.join('\n'));

};



/**
 * Gets a random number between a given range, inclusive of min and max
 * @sauce: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range#1527820
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Takes an abritray number of arguments and randomly returns one of them
 * @return {any} Whatever index is selected is the argument that will be returned
 */
function rando() {
    let i = randomInt(0, arguments.length-1);
    return arguments[i];
}


function line() {
    return Array.prototype.reduce.call(arguments, (acc, val) => acc += ' ' + val);
}
