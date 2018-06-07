const clone = require('lodash-es').cloneDeep;
const set = require('lodash-es').set;
const get = require('lodash-es').get;
const unset = require('lodash-es').unset;

const getDeepPropLocations = require('./get-deep-prop-locations');
const convertRefsToIds = require('./convert-refs-to-ids');

/**
 * Replaces references with their reference data
 * @export
 * @param {object} schema - The schema.
 * @param {array} references - The references.
 * @return {object} - A function which returns a schema object.
 */
module.exports = function (schema, references) {
    let resolvedReferences = resolveReference(schema, references || []);

    if (resolvedReferences.definitions) {
        unset(resolvedReferences, 'definitions');
    }

    return resolvedReferences;
};

/**
 * Resolve all refs
 * @param {object} schema 
 * @param {array} references 
 */
let resolveReference = function(schema, references) {
    let schemaClone = clone(schema);
    let referencesClones = clone(references);
    let referenceDefinitionLocations = [];
    let definitionsRegex = /#\/definitions\/(.*)/g;
    let refLocations = getDeepPropLocations(schema, '$ref');
    let refValues = [];
    let refIds = [];

    for (let refLocation of refLocations) {
        refValues.push(get(schema, `${refLocation}['$ref']`));
    }

    refIds = convertRefsToIds(refValues);
    refLocations = refLocations.concat(getDeepPropLocations(schemaClone, '$ref'));

    for (let refLocation of refLocations) {
        let refValue = get(schema, `${refLocation}['$ref']`);

        if (refValue.slice(0, 13) === '#/definitions') {
            let definitionLocation = refValue.replace('#/', '').replace('/', '.');

            set(schemaClone, refLocation, get(schemaClone, definitionLocation));
        } else if (refValue.match(definitionsRegex) !== null) {
            let refId = refValue.replace(definitionsRegex, '');
            let definitionLocation = refValue.replace(refId, '').replace('#/', '').replace('/', '.');

            for (let referenceClone of referencesClones) {
                if (referenceClone.id === refId) {
                    const definitionValue = resolveReference(referenceClone, referencesClones);
                    set(schemaClone, refLocation, get(definitionValue, definitionLocation));                    
                }
            }
        } else {
            for (let referenceClone of referencesClones) {
                
                if (referenceClone.id === refValue) {
                    let referenceCloneValue = resolveReference(referenceClone, referencesClones);

                    set(schemaClone, refLocation, referenceCloneValue);
                }
            }
        }
    }

    return schemaClone;
};