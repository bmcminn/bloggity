'use strict';


const fs    = require('fs');
const gfs   = require('grunt').file;
const YAML  = require('yaml-js');


/**
 * Same as the Grunt file.expand method
 * @sauce: https://gruntjs.com/api/grunt.file#grunt.file.expand
 * @type {[type]}
 */
fs.glob = gfs.expand;



/**
 * Writes a given data object/array to a JSON document
 * @param  {string}     filepath Path of the file to be written to
 * @param  {obj|array}  data     Data to be written to the JSON file
 * @param  {obj}        options  (OPTIONAL) Options to configure how the operation should be performed
 * @param  {Function}   cb       (OPTIONAL) Callback to be used if the function is intended as an async operation
 * @return {null}                IF cb is not provided, function performs synchronously and returns null per the native FS docs
 * @return {promise}             IF cb is provided, returns a promise for when the provided callback is resolved
 */
fs.writeJSON = function writeJSON(filepath, data, opts, cb) {

    opts = Object.assign({
        encoding: 'utf-8'
    ,   replacer: null
    ,   spaces: 0
    }, opts);

    data = JSON.stringify(data, opts.replacer, opts.spaces);

    if (cb) {
        return this.writeFile(filepath, data, opts, cb);

    } else {
        this.writeFileSync(filepath, data, opts);
        return;
    }

}



/**
 * reads a given JSON file and returns the parsed data object
 * @param  {strign}     filepath    Location of the JSON document to be read
 * @param  {obj}        opts        (OPTIONAL) Options object used to configure how the operation is performed
 * @param  {Function}   cb          (OPTIONAL) Callback to be called when the operation completes
 * @return {promise}                IF cb is provided, returns a promise for when the callback resolves
 * @return {obj}                    IF cb is not provided, synchronously returns a JSON object
 */
fs.readJSON = function readJSON(filepath, opts, cb) {

    opts = Object.assign({
        replacer: null
    ,   spaces: 0
    }, opts);

    if (cb) {
        return this.readFile(filepath, opts, (data) => {
            data = JSON.parse(data);
            cb(data);
        });

    } else {
        let data = this.readFileSync(filepath, opts);
        return JSON.parse(data);

    }

}



/**
 * Writes a given data object/array to a YAML document
 * @param  {string}     filepath Path of the file to be written to
 * @param  {obj|array}  data     Data to be written to the YAML file
 * @param  {obj}        options  (OPTIONAL) Options to configure how the operation should be performed
 * @param  {Function}   cb       (OPTIONAL) Callback to be used if the function is intended as an async operation
 * @return {null}                IF cb is not provided, function performs synchronously and returns null per the native FS docs
 * @return {promise}             IF cb is provided, returns a promise for when the provided callback is resolved
 */
fs.writeYAML = function writeYAML(filepath, data, opts, cb) {

    data = YAML.serialize(data);

    if (cb) {
        return this.writeFile(filepath, data, opts, cb);

    } else {
        this.writeFileSync(filepath, data, opts);
        return;
    }

}



/**
 * reads a given YAML file and returns the parsed data object
 * @param  {strign}     filepath    Location of the YAML document to be read
 * @param  {obj}        opts        (OPTIONAL) Options object used to configure how the operation is performed
 * @param  {Function}   cb          (OPTIONAL) Callback to be called when the operation completes
 * @return {promise}                IF cb is provided, returns a promise for when the callback resolves
 * @return {obj}                    IF cb is not provided, synchronously returns a YAML object
 */
fs.readYAML = function readYAML(filepath, opts, cb) {

    opts = Object.assign({
        replacer: null
    ,   spaces: 0
    }, opts);

    if (cb) {
        return this.readFile(filepath, opts, (data) => {
            data = YAML.load(data);
            cb(data);
        });

    } else {
        let data = this.readFileSync(filepath, opts);
        return YAML.load(data);

    }

}


module.exports = fs;





