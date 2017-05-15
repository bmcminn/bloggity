var _       = require('lodash')
,   chalk   = require('chalk')
;


var keywordAnalysis = function keywordAnalysis(content, options) {


    // configure options
    options = options || {};

    var BASE_OPTIONS = {
            topWordCount: 0         // returns top N words from parsed list, 0 for all words
        ,   ignore: []              // array list of words to ignore (appended to end of default ignore list)
        ,   ignoreDefaults: false   // forces module to only use custom ignore word list
        }
    ;


    // compose new options object with overrides
    options = Object.assign({}, BASE_OPTIONS, options);


    // configure ignored words list
    var BASE_IGNORE_WORDS = [
            'a'
        ,   'an'
        ,   'and'
        ,   'are'
        ,   'as'
        ,   'at'
        ,   'be'
        ,   'buy'
        ,   'by'
        ,   'can'
        ,   'cant'
        ,   'didnt'
        ,   'do'
        ,   'does'
        ,   'dont'
        ,   'each'
        ,   'else'
        ,   'etc'
        ,   'for'
        ,   'did'
        ,   'from'
        ,   'gave'
        ,   'get'
        ,   'h1'
        ,   'h2'
        ,   'h3'
        ,   'h4'
        ,   'h5'
        ,   'h6'
        ,   'h7'
        ,   'has'
        ,   'have'
        ,   'he'
        ,   'how'
        ,   'if'
        ,   'in'
        ,   'is'
        ,   'isnt'
        ,   'it'
        ,   'its'
        ,   'me'
        ,   'most'
        ,   'much'
        ,   'my'
        ,   'not'
        ,   'of'
        ,   'on'
        ,   'or'
        ,   'other'
        ,   'our'
        ,   'ours'
        ,   'out'
        ,   'own'
        ,   'p'
        ,   'put'
        ,   'puts'
        ,   'set'
        ,   'she'
        ,   'should'
        ,   'so'
        ,   'some'
        ,   'span'
        ,   't'
        ,   'than'
        ,   'that'
        ,   'the'
        ,   'their'
        ,   'theirs'
        ,   'then'
        ,   'they'
        ,   'theyre'
        ,   'to'
        ,   'to'
        ,   'us'
        ,   'use'
        ,   'via'
        ,   'was'
        ,   'we'
        ,   'were'
        ,   'what'
        ,   'who'
        ,   'whose'
        ,   'wont'
        ,   'you'
        ,   'your'
        ,   'youre'
        ]
    ;


    // if we're overriding the ignore word list
    if (options.ignore.length > 0
    && options.ignoreDefaults) {
        BASE_IGNORE_WORDS = [];
    }

    // merge our ignore lists
    options.ignore = BASE_IGNORE_WORDS.concat(options.ignore);


    /**
     * removes duplicate ensuring unique values
     * @sauce   http://stackoverflow.com/a/1961068
     * @return  {Array}  { description_of_the_return_value }
     */
    Array.prototype.uniq = function() {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if(u.hasOwnProperty(this[i])) {
                continue;
            }

            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    }

    // strip duplicate words
    options.ignore = options.ignore.uniq();

    // we always need to ignore empty "words" upfront
    options.ignore.unshift('', '');
    options.ignore.push('');

    // convert our ignored word list to a string with each word wrapped by a pipe (|)
    //      the pipe (|) makes string partial checks much more accurate to avoid greedy matches
    //          (ex: |use|user| === |use| vs |user|)
    options.ignore = options.ignore.join('|');

    // parse content file
    var contentWords = content
        .replace(/[\s\t\\\/]{1,}/gi, ' ')   // normalize white space
        .replace(/(\S)-(\S)/gi, '$1 $2')    // break up hyphenated words
        .replace(/[(){}[\]+\—\-_!@#$%^&*.,?'":“”‘’><;`~]/gi, '')
        .replace(/https?:\/\/\S+\//gi, '')
        .replace(/\s{2,}/gi, ' ')
        .split(' ')
    ;


    var wordCounts = {};


    // for each word in our content
    for (var i = contentWords.length-1; i>=0; i--) {

        var word = contentWords[i].toLowerCase();

        // ignore it if it's in our ignore list
        if (options.ignore.indexOf('|' + word + '|') > -1) {
            continue;
        }

        // add the word to our index if it doesn't exist already
        if (!wordCounts[word]) {
            wordCounts[word] = {
                word: word
            ,   count: 0
            };
        }

        // increment word count
        wordCounts[word].count++;

    }


    // determine actual word density and relative word density per ignore list
    _.map(wordCounts, function(word) {

        var count = word.count;

        word.density           = Math.round((count / contentWords.length) * 100, 2) + '%';
        word.relativeDensity   = Math.round((count / _.size(wordCounts)) * 100, 2) + '%';

        return word;

    });


    // sort our data
    wordCounts = _.reverse(_.sortBy(wordCounts, ['count']));


    if (options.topWordCount > 0) {
        wordCounts = _.slice(wordCounts, 0, options.topWordCount);
    }


    return wordCounts;

};



module.exports = exports = keywordAnalysis;
