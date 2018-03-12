const set = require('lodash').set;
const get = require('lodash').get;
const merge = require('lodash').merge;
const clone = require('lodash').cloneDeep;

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
        switch (schemaClone.type) {
            case 'array':
                exampleData = [];
                let minItems = schemaClone.minItems ? schemaClone.minItems : 2;

                for (let i = 0; i < minItems; i++) {
                    exampleData.push(getExample(schemaClone.items, refs));
                }
                break;
            case 'boolean':
                exampleData = typeBoolean(schemaClone, 'data', true, true).data;
                break;
            case 'null':
                exampleData = typeNull(schemaClone, 'data', true, true).data;
                break;
            case 'string':
                exampleData = typeString(schemaClone, 'data', true, undefined, true).data;
                break;
            case 'number':
                exampleData = typeNumber(schemaClone, 'data', true, undefined, true).data;
                break;
            default:
                if (schemaClone.enum) {
                    exampleData = typelessEnum(schemaClone, 'data', true, undefined, true).data;
                    break;
                }

                if (schemaClone.properties) {
                    exampleData = typeObject(schemaClone, 'data', true, true).data;
                    break;
                }

                if (schemaClone.oneOf || schemaClone.anyOf) {
                    let oneOfAnyOf = schemaClone.oneOf ? 'oneOf' : 'anyOf';

                    exampleData = getExample(schemaClone[oneOfAnyOf][0]);
                    break;
                }

                console.log('Schema does not contain a type or has a type that is not allowed on the root level.');
                break;
        }
    }

    return exampleData || {};
};