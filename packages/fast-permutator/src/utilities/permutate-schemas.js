const clone = require('lodash-es').cloneDeep;

const resolveOneOfAnyOf = require('./resolve-one-of-any-of');
const resolveAllOf = require('./resolve-all-of');
const resolveNotRequired = require('./resolve-not-required');
const resolveReferences = require('./resolve-references');
const resolveDependencies = require('./resolve-dependencies');

/**
 * Return an array of schemas with strict required rules generated
 * from allOf, anyOf and oneOf options
 * @param {object} schema - The schema.
 * @param {array} refs - An array of reference schemas.
 * @return {array} - An array of schemas.
 */
module.exports = function (schema, refs) {
    let allSchemas = [];

    // resolve references
    let schemaWithResolvedRefs = resolveReferences(schema, refs);

    // resolve allOf
    let baseSchema = resolveAllOf(schemaWithResolvedRefs);

    // resolve not required
    baseSchema = resolveNotRequired(baseSchema);

    // resolve oneOf & anyOf
    allSchemas = resolveOneOfAnyOf(baseSchema);

    // resolve dependencies
    if (schema.dependencies) {
        allSchemas = resolveDependencies(allSchemas);
    }

    // console.log('all schemas', JSON.stringify(allSchemas, null, 2)); // for debugging

    return allSchemas;
};