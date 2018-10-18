const clone = require("lodash-es").cloneDeep;
const get = require("lodash-es").get;
const set = require("lodash-es").set;
const unset = require("lodash-es").unset;
const merge = require("lodash-es").merge;
const isObject = require("lodash-es").isObject;

const getDeepPropLocations = require("./get-deep-prop-locations");

/**
 * Splits schemas into one for each oneOf schemas or anyOf schemas
 * @export
 * @param {object} schema - The schema.
 * @return {array} - A function which returns schema objects.
 */
module.exports = function(schema) {
    return resolveOneOfAnyOf([schema]);
};

const resolveOneOfAnyOf = function(schemaArray) {
    let newSchemaArray = [];
    let locationTotals = 0;

    for (let schema of schemaArray) {
        let oneOfSchemaLocations = getDeepPropLocations(schema, "oneOf");
        let anyOfSchemaLocations = getDeepPropLocations(schema, "anyOf");

        const oneOfAnyOfSchemaLocations = oneOfSchemaLocations.concat(
            anyOfSchemaLocations
        );
        locationTotals += oneOfAnyOfSchemaLocations.length;

        if (oneOfAnyOfSchemaLocations.length > 0) {
            let oneOfAnyOfItems;
            let oneOfAnyOf =
                get(schema, `${oneOfAnyOfSchemaLocations[0]}.oneOf`) ||
                get(schema, `${oneOfAnyOfSchemaLocations[0]}oneOf`)
                    ? "oneOf"
                    : "anyOf";

            oneOfAnyOfItems =
                oneOfAnyOfSchemaLocations[0] === ""
                    ? get(schema, oneOfAnyOf)
                    : get(schema, `${oneOfAnyOfSchemaLocations[0]}.${oneOfAnyOf}`);

            for (let oneOfAnyOfItem of oneOfAnyOfItems) {
                let schemaClone = clone(schema);

                if (oneOfAnyOfSchemaLocations[0] === "") {
                    merge(schemaClone, oneOfAnyOfItem);
                } else {
                    set(schemaClone, oneOfAnyOfSchemaLocations[0], oneOfAnyOfItem);
                }

                newSchemaArray.push(schemaClone);
            }

            for (let newSchema of newSchemaArray) {
                unset(newSchema, `${oneOfAnyOfSchemaLocations[0]}.${oneOfAnyOf}`);
                unset(newSchema, oneOfAnyOf);
            }
        }
    }

    if (locationTotals > 0) {
        return resolveOneOfAnyOf(newSchemaArray);
    } else {
        return schemaArray;
    }
};
