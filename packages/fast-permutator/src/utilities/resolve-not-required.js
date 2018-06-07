const clone = require('lodash-es').cloneDeep;
const get = require('lodash-es').get;
const unset = require('lodash-es').unset;

const getDeepPropLocations = require('./get-deep-prop-locations');

/**
 * Removes any options that are not required
 * @export
 * @param {object} schema - The schema.
 * @return {array} - A function which returns schema objects.
 */
module.exports = function (schema) {
    let schemaClone = clone(schema);
    const notLocations = getDeepPropLocations(schemaClone, 'not');

    schemaClone = resolveNotRequired(schemaClone, notLocations);

    // console.log('schema', JSON.stringify(schemaClone, null, 2)); // for debugging

    return schemaClone;
};

/**
 * Resolves any not required items that have been found
 * @param {object} schema - The schema.
 * @param {array} locations - An array of locations.
 */
let resolveNotRequired = function(schema, locations) {
    let schemaClone = clone(schema);

    if (locations.length > 0) {
        for (let location of locations) {
            let notRequired = get(schemaClone, `${location}.not.required`, false);

            if (notRequired && notRequired.length > 0) {
                for (let notRequiredItem of notRequired) {
                    unset(schemaClone, `${location}.properties.${notRequiredItem}`);
                }
            }

            unset(schemaClone, `${location}.not`);
        }
    }

    return schemaClone;
};