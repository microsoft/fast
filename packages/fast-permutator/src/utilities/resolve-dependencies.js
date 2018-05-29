const clone = require('lodash/cloneDeep');

/**
 * Exports schemas with dependencies accounted for in required
 * @export
 * @param {object} schemas - The schemas.
 * @return {object} - A function which returns a schema object.
 */
module.exports = function (schemas) {
    let schemasPermutated = [];

    for (let schema of schemas) {
        let schemaBaseClone = clone(schema);
        let dependencyKeys = Object.keys(schema.dependencies);
        let optionalKeys = Object.keys(schema.properties);

        // cross reference required items with dependencies,
        // if a dependency is required add this as a schema permutation
        if (schema.required) {
            for (let dependencyKey of dependencyKeys) {
                for (let requiredItem of schema.required) {
                    if (dependencyKey === requiredItem) {
                        schemaBaseClone.required = schemaBaseClone.required.concat(schemaBaseClone.dependencies[dependencyKey]);
                    }
                }
            }
        }

        // split schemas up based on optional dependencies
        for (let dependencyKey of dependencyKeys) {
            let isRequired = Array.isArray(schema.required) && schema.required.indexOf(dependencyKey) !== -1;

            if (!isRequired) {
                let optionalSchemaClone = clone(schemaBaseClone);
                optionalSchemaClone.required.push(dependencyKey);
                optionalSchemaClone.required = optionalSchemaClone.required.concat(optionalSchemaClone.dependencies[dependencyKey]);
                schemasPermutated.push(optionalSchemaClone);
                delete schemaBaseClone.properties[dependencyKey];
            }
        }
        
        // the base schema with no options
        schemasPermutated.push(schemaBaseClone);
    }

    return schemasPermutated;
};