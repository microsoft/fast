import * as React from "react";
import { cloneDeep, get, isEqual, mergeWith, set, uniqueId, unset } from "lodash-es";
import { getExample } from "@microsoft/fast-permutator";
import tv4 from "tv4";
import {
    AttributeSettingsMappingToPropertyNames,
    IFormComponentMappingToPropertyNamesProps
} from "./form.props";
import { mappingName } from "./form-item";

/**
 * Validate a schema against a set of data
 */
export function validateSchema(schema: any, data: any): boolean {
    return tv4 ? tv4.validate(data, schema) : false;
}

/**
 * Determine if an item is required
 */
export function getIsRequired(item: any, required: string[]): boolean {
    let isRequired: boolean = false;

    if (Array.isArray(required)) {
        required.forEach((requiredItem: string): void => {
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
export function getIsNotRequired(item: any, not?: string[]): boolean {
    let notRequired: boolean = false;

    if (Array.isArray(not)) {
        not.forEach((notRequiredItem: any) => {
            if (notRequiredItem === item) {
                notRequired = true;
            }
        });
    }

    return notRequired;
}

/**
 * Gets the options for a oneOf/anyOf select
 */
export function getOneOfAnyOfSelectOptions(schema: any, state: any): JSX.Element[] {
    return schema[state.oneOfAnyOf.type].map((option: any, index: number): JSX.Element => {
        return (
            <option key={index} value={index}>
                {get(option, "description") || get(option, "title") || "No description"}
            </option>
        );
    });
}

/**
 * Find out what the active index should be based on the data
 */
export function getOneOfAnyOfActiveIndex(type: string, schema: any, data: any): number {
    if (schema && Array.isArray(schema[type])) {
        const newData: any = cloneDeep(data);

        Object.keys(newData).forEach((key: string) => {
            if (typeof newData[key] === "undefined") { // if this is a child we may be getting undefined default props, remove these
                delete newData[key];
            }
        });

        for (let i: number = 0, oneOfAnyOfItems: number = schema[type].length; i < oneOfAnyOfItems; i++) {
            if (validateSchema(schema[type][i], newData)) {
                return i;
            }
        }
    }

    return 0;
}

/**
 * Resolves generated example data with any matching data in the cache
 */
export function resolveExampleDataWithCachedData(schema: any, cachedData: any, currentData: any): any {
    const exampleData: any = generateExampleData(schema, "");
    const curatedCachedData: any = cloneDeep(cachedData);

    // removes any cached items which do not match and item in
    // the example data and are not included in the schema properties
    Object.keys(curatedCachedData).forEach((item: string) => {
        if (typeof exampleData[item] === "undefined"
            && (schema.properties && !schema.properties[item])
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
function cachedDataResolver(objValue: any, srcValue: any, key: number, object: any, source: any): any {
    if (
        typeof srcValue !== "undefined"
        && typeof objValue !== "undefined"
        && typeof srcValue === typeof objValue
    ) {
        const newObj: any = cloneDeep(object);
        set(newObj, key, srcValue);

        if (!validateSchema(this, newObj)) {
            return objValue;
        }

        return srcValue;
    } else {
        return void(0);
    }
}

/**
 * Normalizes a location for getting and setting values
 */
export function getNormalizedLocation(location: string, property: string, schema: any): string {
    let normalizedProperty: string = "";
    let normalizedLocation: string = location === "" || property === "" ? location : `${location}.`;
    normalizedProperty = property.split(".").join(".properties.");
    normalizedLocation = typeof property !== "undefined" ? `${normalizedLocation}${normalizedProperty}` : normalizedLocation;

    return normalizedLocation;
}

/**
 * Generates example data for a newly added optional schema item
 */
export function generateExampleData(schema: any, propertyLocation: string): any {
    let schemaSection: any = propertyLocation === "" ? schema : get(schema, propertyLocation);

    if (schemaSection.oneOf) {
        schemaSection = schemaSection.oneOf[0];
    }

    if (schemaSection.anyOf) {
        schemaSection = schemaSection.anyOf[0];
    }

    if (schemaSection.properties && schemaSection.type !== "object") {
        schemaSection.type = "object";
    }

    if (schemaSection.items) {
        const example: any = getExample(schemaSection.items);

        if (schemaSection.minItems) {
            return new Array(schemaSection.length - 1).fill(example);
        }

        return [example];
    }

    return getExample(schemaSection);
}

export interface IOptionalToggle {
    id: number | string;
    label: string;
    selected: boolean;
    selectedString: string;
    unselectedString: string;
    name: string;
    updateRequested: (value: any, id: string) => void;
}

/**
 * Get the optional objects in the schema.
 */
export function getOptionalToggles(
    schema: any,
    onChange: (propertyLocation: string, value: any) => void,
    location: string,
    data: any,
    dataCache: any
): IOptionalToggle[] {
    const optionalObjects: IOptionalToggle[] = [];
    const required: string[] = schema.required || [];
    const propertyKeys: string[] = schema.properties ? Object.keys(schema.properties) : [];
    const notRequiredList: string[] = schema.not && schema.not.required ? schema.not.required : void(0);

    for (const key of propertyKeys) {
        let isOptional: boolean = true;
        const isNotRequired: boolean = getIsNotRequired(key, notRequiredList);
        const propertyLocation: string = location === "" ? key : `${location}.${key}`;

        if (!isNotRequired) {
            for (const requiredItem of required) {
                if (requiredItem === key) {
                    isOptional = false;
                }
            }

            if (isOptional &&
                (schema.properties[key].type === "object" ||
                schema.properties[key].properties ||
                schema.properties[key].anyOf ||
                schema.properties[key].oneOf)
            ) {
                optionalObjects.push({
                    id: uniqueId(),
                    label: schema.properties[key].title || "Untitled",
                    selected: isSelected(key, data),
                    selectedString: "On",
                    unselectedString: "Off",
                    name: "defaultSelected",
                    updateRequested: (value: any, id: string): void => {
                        onChange(
                            propertyLocation,
                            value ? void(0) : get(dataCache, propertyLocation) || generateExampleData(schema, `properties.${key}`)
                        );
                    }
                });
            }
        }
    }

    return optionalObjects;
}

/**
 * Determines if this property has been selected
 */
function isSelected(propertyKey: string, data: any): boolean {
    let selected: boolean = false;

    if (data && data[propertyKey]) {
        selected = true;
    }

    return selected;
}

/**
 * Gets the schemas subsections
 */
export function getSchemaSubsections(state: any, props: any): any[] {
    const subSections: any[] = [];

    if (typeof state.schema.properties === "undefined") {
        return subSections;
    }

    const objectProperties: string[] = Object.keys(state.schema.properties);
    let schemaLocationClone: string = props.schemaLocation;
    let dataLocationClone: string = props.dataLocation;

    schemaLocationClone = state.oneOfAnyOf
        ? `${state.oneOfAnyOf.type}[${state.oneOfAnyOf.activeIndex}]${schemaLocationClone}`
        : schemaLocationClone;
    schemaLocationClone = schemaLocationClone === "" ? "" : `${schemaLocationClone}.`;
    dataLocationClone = dataLocationClone === "" ? "" : `${dataLocationClone}${props.location ? "" : "."}`;

    for (let i: number = 0, objectPropertiesLength: number = objectProperties.length; i < objectPropertiesLength; i++) {
        if (state.schema.properties[objectProperties[i]].properties ||
            state.schema.properties[objectProperties[i]].anyOf ||
            state.schema.properties[objectProperties[i]].oneOf
        ) {
            const oneOfAnyOf: string = typeof state.oneOfAnyOf !== "undefined"
                ? `${state.oneOfAnyOf.type}[${state.oneOfAnyOf.activeIndex}]`
                : "" ;

            subSections.push({
                text: state.schema.properties[objectProperties[i]].title || "Untitled",
                schemaLocation: `${props.location ? schemaLocationClone : ""}${oneOfAnyOf}properties.${objectProperties[i]}`,
                dataLocation: props.location ? dataLocationClone : `${dataLocationClone}${objectProperties[i]}`,
                active: get(props.data, objectProperties[i]),
                required: getIsRequired(objectProperties[i], state.schema.required)
            });
        }
    }

    return subSections;
}

/**
 * Get the array location
 */
export function getArraySchemaLocation(schemaLocation: string, propertyName: string, schema: any, oneOfAnyOf: any): string {
    let arraySchemaLocation: string = "";

    if (oneOfAnyOf) {
        arraySchemaLocation += `${oneOfAnyOf.type}[${oneOfAnyOf.activeIndex}]`;
    }

    if (propertyName !== "") {
        arraySchemaLocation += `${arraySchemaLocation === "" ? "" : "." }properties.${propertyName}`;
    }

    return arraySchemaLocation;
}

/**
 * Assigns a schema form item mapping based on property name
 */
export function formItemMapping(config: IFormComponentMappingToPropertyNamesProps, propertyName: string): null | mappingName {
    let itemLayout: any = null;

    Object.keys(config).forEach((layout: string): void => {
        for (const property of config[layout]) {
            if (property === propertyName) {
                itemLayout = layout;
            }
        }
    });

    return itemLayout;
}

/**
 * Assigns an attribute value based on property names
 */
export function formItemAttributeMapping(
    config: AttributeSettingsMappingToPropertyNames,
    propertyName: string
): number | null {
    let itemAttributeValue: any = null;

    Object.keys(config).forEach((attributeName: string): void => {
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
