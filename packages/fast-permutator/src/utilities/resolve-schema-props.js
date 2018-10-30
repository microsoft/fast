const clone = require("lodash-es").cloneDeep;
const resolveReferences = require("./resolve-references");
const resolveAllOf = require("./resolve-all-of");
const resolveOneOfAnyOf = require("./resolve-one-of-any-of");

/**
 * Resolves the given props for a schema
 * @param {object} schema - The schema.
 * @param {array} refs - The schema references.
 * @param {array} props - An array of props to resolve
 * @return {object | array} - The schema(s) that have the resolved props.
 */
module.exports = function(schema, refs, props) {
    let schemaClone = clone(schema);

    if (Array.isArray(props) && props.length > 0) {
        // make sure $ref is first, allOf is second and oneOf/anyOf is last
        props.sort();

        for (let prop of props) {
            switch (prop) {
                case "$ref":
                    schemaClone = resolveReferences(schemaClone, refs);
                    break;
                case "allOf":
                    schemaClone = resolveAllOf(schemaClone);
                    break;
                case "oneOf":
                case "anyOf":
                    schemaClone = resolveOneOfAnyOf(schemaClone);
                    break;
            }
        }
    }

    return schemaClone;
};
