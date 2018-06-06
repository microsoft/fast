const set = require('lodash-es').set;
const get = require('lodash-es').get;
const merge = require('lodash-es').merge;
const clone = require('lodash-es').cloneDeep;

const resolveSchemaProps = require('./resolve-schema-props');
const getDeepPropLocations = require('./get-deep-prop-locations');

const typeBoolean = require('./type-boolean');
const typeString = require('./type-string');
const typeNumber = require('./type-number');
const typeObject = require('./type-object');
const typeNull = require('./type-null');
const typelessEnum = require('./typeless-enum');

/**
 * Gets a single example from the schema
 */
module.exports = function (schema, refs) {
    return getExample(schema, refs);
};

let getExample = function(schema, refs) {
    let schemaClone = resolveSchemaProps(schema, refs, ['$ref', 'allOf']);
    let exampleData = {};

    if (
        (schemaClone.type === 'object' || schemaClone.properties)
        && Array.isArray(schemaClone.required)
        && schemaClone.required.length > 0
    ) {
        for (let requiredItem of schemaClone.required) {
            let subSchema = get(schemaClone, `properties.${requiredItem}`);

            exampleData[requiredItem] = getExample(subSchema, refs);
        }
    } else {
        exampleData = getExampleDataByType(schemaClone, refs);
    }

    return exampleData || {};
};

let getExampleDataByType = function(schema, references) {
    switch (schema.type) {
        case 'array':
            let data = [];
            let minItems = schema.minItems ? schema.minItems : 2;

            for (let i = 0; i < minItems; i++) {
                data.push(getExample(schema.items, references));
            }

            return data;
        case 'boolean':
            return typeBoolean(schema, 'data', true, true).data;
        case 'null':
            return typeNull(schema, 'data', true, true).data;
        case 'string':
            return typeString(schema, 'data', true, undefined, true).data;
        case 'number':
            return typeNumber(schema, 'data', true, undefined, true).data;
        default:
            if (schema.enum) {
                return typelessEnum(schema, 'data', true, undefined, true).data;
            }

            if (schema.properties) {
                return typeObject(schema, 'data', true, true).data;
            }

            if (schema.oneOf || schema.anyOf) {
                let oneOfAnyOf = schema.oneOf ? 'oneOf' : 'anyOf';

                return getExample(schema[oneOfAnyOf][0]);
            }

            console.log('Schema does not contain a type or has a type that is not allowed on the root level.');
            break;
    }
};