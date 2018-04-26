const clone = require('lodash').cloneDeep;
const set = require('lodash').set;
const get = require('lodash').get;
const unset = require('lodash').unset;
const isRecursive = require('./is-location-recursive');

/**
 * Exports a schema with resolved circular references
 * @export
 * @param {object} schema - The schema.
 * @return {object} - A function which returns a schema object.
 */
module.exports = function (schema) {
    let schemaClone = resolveRecursiveReference(schema);

    return schemaClone;
};

/**
 * Resolves recursive references
 * @param {object} schema 
 */
const resolveRecursiveReference = function(schema, location) {
    let subSchema = typeof location === 'undefined' ? clone(schema) : get(schema, location);
    let schemaClone = clone(schema);
    
    Object.keys(subSchema).map((value, index) => {
        let newLocation = typeof location === 'undefined' ? value : `${location}${formatLocation(value)}`;

        if (isRecursive(newLocation, /(.*)\.\1\.\1\.\1/)) {
            schemaClone = removeSubschemaCircularReferences(schemaClone, newLocation);
        } else {
            if (typeof get(schemaClone, newLocation) === 'object') {
                schemaClone = resolveRecursiveReference(schemaClone, newLocation);
            }
        }
    });

    return schemaClone;
};

/**
 * Sets the first three circular references
 * @param {object} schema 
 * @param {string} location 
 */
let removeSubschemaCircularReferences = function(schema, location) {
    let repeatingPattern = /(.*)(.*)\.\2\.\2\.\2/;
    let matchLastArrayItem = /\[\d+\](?=[^.]*$)/;
    let schemaClone = clone(schema);
    let matches = location.match(repeatingPattern);

    set(
        schemaClone,
        `${matches[1]}${matches[2]}`,
        clone(get(schemaClone, `${matches[1]}${matches[2]}`))
    );
    set(
        schemaClone,
        `${matches[1]}${matches[2]}${matches[2]}`,
        clone(get(schemaClone, `${matches[1]}${matches[2]}`))
    );
    set(
        schemaClone,
        `${matches[1]}${matches[2]}${matches[2]}${matches[2]}`,
        clone(get(schemaClone, `${matches[1]}${matches[2]}`))
    );

    unset(schemaClone, location);

    if (location.charAt(location.length - 1) === ']') {
        let lastArrayItemLength = location.match(matchLastArrayItem)[0].length;
        let arrayLocation = location.slice(0, location.length - lastArrayItemLength);
        let newArray = get(schemaClone, arrayLocation).filter((item, itemIndex) => {
            return item !== null;
        });

        set(schemaClone, arrayLocation, newArray);
    }

    return schemaClone;
};

/**
 * Determines the path formatting based on location given
 * @param {string} location 
 */
let formatLocation = function(location) {
    if (isNaN(parseInt(location, 10))) {
        return `.${location}`;
    }

    return `[${location}]`;
};