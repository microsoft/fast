// re-usable utilities
const setDeepObject = require("./utilities/set-deep-object");
const removeEmptyObjects = require("./utilities/remove-empty-objects");
const getDeepPropLocations = require("./utilities/get-deep-prop-locations");
const resolveReferences = require("./utilities/resolve-references");
const convertRefsToIds = require("./utilities/convert-refs-to-ids");
const resolveSchemaProps = require("./utilities/resolve-schema-props");
const resolveRecursiveReferences = require("./utilities/resolve-recursive-references");

// property type utilities
const typeBoolean = require("./utilities/type-boolean");
const typeString = require("./utilities/type-string");
const typeNumber = require("./utilities/type-number");
const typeObject = require("./utilities/type-object");
const typeNull = require("./utilities/type-null");
const typelessEnum = require("./utilities/typeless-enum");

// permutate utilities
const permutateSchemas = require("./utilities/permutate-schemas");
const permutateProperties = require("./utilities/permutate-properties");

// single use utilities
const getExample = require("./utilities/get-example");

let permutator = {};
let optionalData;
let requiredData;

let handleRequiredData = function(isRequired, array) {
    if (isRequired) {
        requiredData.push(array);
    } else {
        array.push({});
        optionalData.push(array);
    }
};

/**
 * Data permutator
 * Generates data permutations based on a given JSON Schema.
 * @param {object} schema - The schema.
 * @param {array} refs - The references for the given schema.
 * @return {object} - An array of permutated data objects.
 */
permutator.generator = function(schema, refs) {
    let schemaAll = permutateSchemas(schema, refs);
    let uniqueAll = new Set();
    let dataAll = []; // flat structure
    let deepSetDataAll = [];

    for (let schemaItem of schemaAll) {
        requiredData = [];
        optionalData = [];

        // traverse the structure of the schema and generate data
        switch (schemaItem.type) {
            case "object":
                permutator.typeObject(schemaItem);
                break;
            case "array":
                permutator.typeArray(schemaItem);
                break;
            case "boolean":
                permutator.typeBoolean(schemaItem);
                break;
            case "null":
                permutator.typeNull(schemaItem);
                break;
            case "string":
                permutator.typeString(schemaItem);
                break;
            case "number":
                permutator.typeNumber(schemaItem);
                break;
            default:
                if (schemaItem.enum) {
                    permutator.typelessEnum(schemaItem);
                } else if (schemaItem.properties) {
                    permutator.typeObject(schemaItem);
                } else {
                    console.log(
                        "Schema does not contain a type or has a type that is not allowed on the root level."
                    );
                }
                break;
        }

        let required = permutateProperties(0, requiredData, []);
        let optional = permutateProperties(0, optionalData, []);
        let all = permutateProperties(0, [required, optional], []);

        dataAll = dataAll.concat(all);
    }

    // remove any subproperties of an empty optional object
    dataAll = removeEmptyObjects(dataAll);

    // remove any duplications
    dataAll.forEach(e => uniqueAll.add(JSON.stringify(e)));
    uniqueAll = Array.from(uniqueAll).map(e => JSON.parse(e));

    for (let dataObj of uniqueAll) {
        deepSetDataAll.push(setDeepObject(dataObj));
    }

    return deepSetDataAll;
};

/**
 * Permutate based on type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.generateByType = function(schema, propertyName, required, arrayConfig) {
    /**
     * items marked as whitelisted are ignored
     * use to avoid too many permutations
     */
    if (schema.whitelisted) {
        return;
    }

    switch (schema.type) {
        case "object":
            permutator.typeObject(schema, propertyName, required, arrayConfig);
            break;
        case "array":
            permutator.typeArray(schema, propertyName, required, arrayConfig);
            break;
        case "boolean":
            permutator.typeBoolean(schema, propertyName, required, arrayConfig);
            break;
        case "null":
            permutator.typeNull(schema, propertyName, required, arrayConfig);
            break;
        case "string":
            permutator.typeString(schema, propertyName, required, arrayConfig);
            break;
        case "number":
            permutator.typeNumber(schema, propertyName, required, arrayConfig);
            break;
        default:
            if (schema.enum) {
                permutator.typelessEnum(schema, propertyName, required, arrayConfig);
            } else if (schema.properties) {
                permutator.typeObject(schema, propertyName, required, arrayConfig);
            } else if (!schema.oneOf && !schema.anyOf) {
                console.log(
                    "Schema does not contain a type or has a type that is not allowed on the root level."
                );
            }
            break;
    }
};

/**
 * Permutator for the object type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typeObject = function(schema, propertyName, required, arrayConfig) {
    let objectProperties;
    let compositePropertyName;

    if (typeof propertyName !== "undefined") {
        let objectArray = typeObject(schema, propertyName, required, arrayConfig);

        if (!required) {
            objectArray.push({});
            optionalData.push(objectArray);
        }
    }

    // get keys
    try {
        objectProperties = Object.keys(schema.properties);
    } catch (e) {
        console.log(e);
    }

    for (let property of objectProperties) {
        let required = false;

        // find out if this is required
        if (schema.required) {
            for (let requiredProperty of schema.required) {
                if (property === requiredProperty) required = true;
            }
        }

        if (arrayConfig && arrayConfig.itemNumber) {
            for (let i = 0; i < arrayConfig.itemNumber; i++) {
                if (
                    typeof propertyName !== "undefined" &&
                    typeof property !== "undefined"
                ) {
                    compositePropertyName =
                        typeof propertyName !== "undefined"
                            ? `${propertyName}[${i}].${property}`
                            : property;

                    permutator.generateByType(
                        schema.properties[property],
                        compositePropertyName,
                        required
                    );
                }
            }
        } else if (
            typeof schema.properties[property].type !== "undefined" ||
            typeof schema.properties[property].enum !== "undefined"
        ) {
            compositePropertyName =
                typeof propertyName !== "undefined"
                    ? `${propertyName}.${property}`
                    : property;
            permutator.generateByType(
                schema.properties[property],
                compositePropertyName,
                required
            );
        }
    }
};

/**
 * Permutator for the array type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typeArray = function(schema, propertyName, required, arrayConfig) {
    let arrayArray = [];
    let arrayArrayLength;
    let config = {};

    if (schema.minItems && schema.maxItems) {
        config.itemNumber =
            Math.floor(Math.random() * (schema.maxItems - schema.minItems + 1)) +
            schema.minItems;
    } else if (schema.minItems) {
        config.itemNumber = schema.minItems;
    } else if (schema.maxItems) {
        config.itemNumber = schema.maxItems;
    } else {
        config.itemNumber = 2;
    }

    let arrayObj = {};
    arrayObj[propertyName] = [];

    for (let i = 0; i < config.itemNumber; i++) {
        permutator.generateByType(schema.items, propertyName, required, config);
    }
};

/**
 * Permutator for the boolean type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typeBoolean = function(schema, propertyName, required, arrayConfig) {
    const boolArray = typeBoolean(schema, propertyName, required, arrayConfig);

    handleRequiredData(required, boolArray);
};

/**
 * Permutator for the string type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typeString = function(schema, propertyName, required, arrayConfig) {
    const stringArray = typeString(schema, propertyName, required, arrayConfig);

    handleRequiredData(required, stringArray);
};

/**
 * Permutator for the number type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typeNumber = function(schema, propertyName, required, arrayConfig) {
    const numberArray = typeNumber(schema, propertyName, required, arrayConfig);

    handleRequiredData(required, numberArray);
};

/**
 * Permutator for the null type
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typeNull = function(schema, propertyName, required, arrayConfig) {
    const nullArray = typeNull(schema, propertyName, required, arrayConfig);

    handleRequiredData(required, nullArray);
};

/**
 * Permutator for the typeless enum
 * @param {object} schema - The schema.
 * @param {string} propertyName - The name of the property currently being evaluated.
 * @param {boolean} required - Whether this property is required.
 */
permutator.typelessEnum = function(schema, propertyName, required, arrayConfig) {
    const enumArray = typelessEnum(schema, propertyName, required, arrayConfig);

    handleRequiredData(required, enumArray);
};

/**
 * A generator to produce permutations
 * @export - An object containing the generator.
 */
module.exports = permutator.generator;
module.exports.simplifySchemas = permutateSchemas;
module.exports.getDeepPropLocations = getDeepPropLocations;
module.exports.getExample = getExample;
module.exports.convertRefsToIds = convertRefsToIds;
module.exports.resolveReferences = resolveReferences;
module.exports.resolveSchemaProps = resolveSchemaProps;
module.exports.resolveRecursiveReferences = resolveRecursiveReferences;
