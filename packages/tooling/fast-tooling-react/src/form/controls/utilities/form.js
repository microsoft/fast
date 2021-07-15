import React from "react";
import { cloneDeep, get, mergeWith, omit, set, unset } from "lodash-es";
import {
    CombiningKeyword,
    getDataFromSchema,
    normalizeDataLocationToDotNotation,
} from "@microsoft/fast-tooling";
import stringify from "fast-json-stable-stringify";
const containsInvalidDataMessage = "Contains invalid data";
/**
 * Gets the array link data
 */
export function getArrayLinks(data) {
    if (Array.isArray(data)) {
        return data.map((item, index) => {
            const defaultValue = `Item ${index + 1}`;
            switch (typeof item) {
                case "object":
                    return item.text || defaultValue;
                case "string":
                    return item;
                default:
                    return defaultValue;
            }
        });
    } else {
        return [];
    }
}
/**
 * Get the string value of a number
 */
function getStringFromData(data) {
    if (typeof data === "number") {
        return data.toString();
    }
    return data || "";
}
export function getStringValue(data, defaultData) {
    return typeof data === "string" || typeof data === "number"
        ? getStringFromData(data)
        : getStringFromData(defaultData);
}
/**
 * Determine if an item is required
 */
export function getIsRequired(item, required) {
    let isRequired = false;
    if (Array.isArray(required)) {
        required.forEach(requiredItem => {
            if (requiredItem === item) {
                isRequired = true;
            }
        });
    }
    return isRequired;
}
/**
 * Determine if an item is not required
 */
export function getIsNotRequired(item, not) {
    let notRequired = false;
    if (Array.isArray(not)) {
        not.forEach(notRequiredItem => {
            if (notRequiredItem === item) {
                notRequired = true;
            }
        });
    }
    return notRequired;
}
/**
 * Resolves generated example data with any matching data in the cache
 */
export function resolveExampleDataWithCachedData(schema, cachedData) {
    const exampleData = generateExampleData(schema, "");
    const curatedCachedData = cloneDeep(cachedData);
    // removes any cached items which do not match and item in
    // the example data and are not included in the schema properties
    Object.keys(curatedCachedData).forEach(item => {
        if (
            typeof exampleData[item] === "undefined" &&
            schema.properties &&
            !schema.properties[item]
        ) {
            unset(curatedCachedData, item);
        }
    });
    // look through the data cache, find any matching properties and merge them together
    return mergeWith(exampleData, curatedCachedData, cachedDataResolver.bind(schema));
}
/**
 * Resolves cached data into example data if the schema still validates with the new data
 */
function cachedDataResolver(objValue, srcValue, key, object) {
    if (
        typeof srcValue !== "undefined" &&
        typeof objValue !== "undefined" &&
        typeof srcValue === typeof objValue
    ) {
        const newObj = cloneDeep(object);
        set(newObj, key, srcValue);
        return srcValue;
    } else {
        return void 0;
    }
}
/**
 * Normalizes a location for getting and setting values
 */
export function getNormalizedLocation(location, property, schema) {
    let normalizedProperty = "";
    let normalizedLocation =
        location === "" || property === "" ? location : `${location}.`;
    normalizedProperty = property.split(".").join(`.${PropertyKeyword.properties}.`);
    normalizedLocation =
        typeof property !== "undefined"
            ? `${normalizedLocation}${normalizedProperty}`
            : normalizedLocation;
    return normalizedLocation;
}
function getArrayExample(schemaSection) {
    const example = getDataFromSchema(schemaSection.items);
    if (schemaSection.minItems) {
        return new Array(schemaSection.length - 1).fill(example);
    }
    return [example];
}
function checkIsObjectAndSetType(schemaSection) {
    if (schemaSection.properties && schemaSection.type !== "object") {
        return "object";
    }
    return schemaSection.type;
}
function getOneOfAnyOfType(schemaSection) {
    return schemaSection.oneOf
        ? CombiningKeyword.oneOf
        : schemaSection.anyOf
        ? CombiningKeyword.anyOf
        : null;
}
/**
 * Generates example data for a newly added optional schema item
 */
export function generateExampleData(schema, propertyLocation) {
    let schemaSection = propertyLocation === "" ? schema : get(schema, propertyLocation);
    const oneOfAnyOf = getOneOfAnyOfType(schemaSection);
    if (oneOfAnyOf !== null) {
        schemaSection = Object.assign(
            {},
            omit(schemaSection, [oneOfAnyOf]),
            schemaSection[oneOfAnyOf][0]
        );
    }
    schemaSection.type = checkIsObjectAndSetType(schemaSection);
    if (schemaSection.items) {
        return getArrayExample(schemaSection);
    }
    return getDataFromSchema(schemaSection);
}
/**
 * Get the array location
 */
export function getArraySchemaLocation(schemaLocation, propertyName, schema, oneOfAnyOf) {
    let arraySchemaLocation = "";
    if (oneOfAnyOf) {
        arraySchemaLocation += `${oneOfAnyOf.type}[${oneOfAnyOf.activeIndex}]`;
    }
    if (propertyName !== "") {
        arraySchemaLocation += `${arraySchemaLocation === "" ? "" : "."}${
            PropertyKeyword.properties
        }.${propertyName}`;
    }
    return arraySchemaLocation;
}
/**
 * Assigns an attribute value based on property names
 */
export function formControlAttributeMapping(config, propertyName) {
    let itemAttributeValue = null;
    Object.keys(config).forEach(attributeName => {
        for (const attributeConfig of config[attributeName]) {
            for (const property of attributeConfig.propertyNames) {
                if (property === propertyName) {
                    itemAttributeValue = attributeConfig.value;
                }
            }
        }
    });
    return itemAttributeValue;
}
export function checkHasOneOfAnyOf(oneOf, anyOf) {
    return oneOf || anyOf;
}
export function checkIsDifferentSchema(currentSchema, nextSchema) {
    return nextSchema !== currentSchema;
}
export function checkIsDifferentData(currentData, nextData) {
    return currentData !== nextData;
}
export function getDataLocationRelativeToRoot(location, dataLocation) {
    return isRootLocation(dataLocation) || isRootLocation(location)
        ? `${dataLocation}${location}`
        : `${dataLocation}.${location}`;
}
export function getData(location, data) {
    return isRootLocation(location) ? data : get(data, location);
}
export function isSelect(property) {
    return typeof property.enum !== "undefined" && property.enum.length > 0;
}
export function isConst(property) {
    return typeof property.const !== "undefined";
}
export function checkIsObject(property, schema) {
    return (property.properties || property.type === "object") && property === schema;
}
export function handleToggleClick(value, id, updateRequested) {
    return e => {
        e.preventDefault();
        updateRequested(value, id);
    };
}
export function getLabel(label, title) {
    return label === "" && title !== void 0 ? title : label;
}
export const propsKeyword = "props";
export var PropertyKeyword;
(function (PropertyKeyword) {
    PropertyKeyword["properties"] = "properties";
})(PropertyKeyword || (PropertyKeyword = {}));
/**
 * Determines the navigation from
 * - section links
 * - child components
 * - array items
 * - breadcrumb links
 */
export function getActiveComponentAndSection(dataLocation) {
    const state = {};
    state.activeNavigationConfigId = dataLocation;
    return state;
}
/**
 * Gets locations from individual location segments
 * Example:
 * getLocationsFromSegments(["children[0].props.object"])
 * output: ["children[0]", "children[0].props", "children[0].props.object"]
 */
export function getLocationsFromSegments(segments) {
    return segments.map((location, index) => {
        return segments.slice(0, index + 1).join(".");
    });
}
/**
 * Gets the data location from the current component
 */
export function getCurrentComponentDataLocation(dataLocation, lastComponentDataLocation) {
    return dataLocation.replace(lastComponentDataLocation, "").replace(/^\./, "");
}
/**
 * Check to see if we are on the root location
 */
export function isRootLocation(location) {
    return location === "";
}
/**
 * Check to see if this schema is the same as another schema
 */
export function isDifferentSchema(oldSchema, newSchema) {
    return stringify(oldSchema) !== stringify(newSchema);
}
/**
 * Check to see if this schema has been modified
 */
export function isModifiedSchema(oldSchema, newSchema) {
    return stringify(oldSchema) !== stringify(newSchema);
}
/**
 * Finds the schema using the data location
 */
export function getSchemaByDataLocation(currentSchema, data, dataLocation, childOptions) {
    if (dataLocation === "") {
        return currentSchema;
    }
    const subData = get(data, dataLocation);
    const id = subData ? subData.id : void 0;
    const childOptionWithMatchingSchemaId = childOptions.find(childOption => {
        return childOption.schema.id === id;
    });
    return childOptionWithMatchingSchemaId
        ? childOptionWithMatchingSchemaId.schema
        : currentSchema;
}
/**
 * Gets the validation error message using a data location
 */
export function getErrorFromDataLocation(dataLocation, validationErrors) {
    let error = "";
    if (Array.isArray(validationErrors)) {
        const normalizedDataLocation = normalizeDataLocationToDotNotation(dataLocation);
        for (const validationError of validationErrors) {
            if (normalizedDataLocation === validationError.dataLocation) {
                error = validationError.invalidMessage;
            } else {
                let containsInvalidData;
                if (normalizedDataLocation === "") {
                    containsInvalidData = true;
                } else {
                    const dataLocations = validationError.dataLocation.split(".");
                    containsInvalidData = dataLocations.some((value, index) => {
                        return (
                            normalizedDataLocation ===
                            dataLocations.slice(0, index + 1).join(".")
                        );
                    });
                }
                if (error === "" && containsInvalidData) {
                    error = containsInvalidDataMessage;
                }
            }
        }
    }
    return error;
}
export function isDefault(value, defaultValue) {
    return typeof value === "undefined" && typeof defaultValue !== "undefined";
}
function getCategoryStateFromCategoryDictionary(
    categoryDictionary,
    dataDictionary,
    dictionaryId,
    dataLocation
) {
    return categoryDictionary &&
        categoryDictionary[dataDictionary[0][dictionaryId].schemaId] &&
        categoryDictionary[dataDictionary[0][dictionaryId].schemaId][dataLocation]
        ? categoryDictionary[dataDictionary[0][dictionaryId].schemaId][dataLocation].map(
              category => {
                  return {
                      expanded: !!(category.expandByDefault !== false),
                  };
              }
          )
        : [];
}
export function getUpdatedCategories(categories = [], index) {
    const updatedCategories = [].concat(categories);
    if (index !== undefined) {
        updatedCategories[index].expanded = !updatedCategories[index].expanded;
    }
    return updatedCategories;
}
export function updateControlSectionState(props, state) {
    return {
        schema: props.schema,
        oneOfAnyOf: props.navigation[props.navigationConfigId].schema[
            CombiningKeyword.anyOf
        ]
            ? {
                  type: CombiningKeyword.anyOf,
                  activeIndex: -1,
              }
            : props.navigation[props.navigationConfigId].schema[CombiningKeyword.oneOf]
            ? {
                  type: CombiningKeyword.oneOf,
                  activeIndex: -1,
              }
            : null,
        categories:
            state !== undefined && props.schema.id === state.schema.id
                ? getUpdatedCategories(state.categories)
                : getCategoryStateFromCategoryDictionary(
                      props.categories,
                      props.dataDictionary,
                      props.dictionaryId,
                      props.dataLocation
                  ),
    };
}
/**
 * Gets the options for a oneOf/anyOf select
 */
export function getOneOfAnyOfSelectOptions(schema, state) {
    return schema[state.oneOfAnyOf.type].map((oneOfAnyOfOption, index) => {
        return (
            <option key={index} value={index}>
                {get(oneOfAnyOfOption, "title") ||
                    get(oneOfAnyOfOption, "description") ||
                    "No title"}
            </option>
        );
    });
}
