import React from "react";
import { FormState } from "../../form.props";
import {
    AttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "../../types";
import { SectionControlProps, SectionControlState } from "../control.section.props";
import { cloneDeep, get, isEmpty, mergeWith, omit, set, unset } from "lodash-es";
import {
    CombiningKeyword,
    getDataFromSchema,
    MessageSystem,
    MessageSystemType,
    normalizeDataLocationToDotNotation,
    ValidationError,
} from "@microsoft/fast-tooling";
import stringify from "fast-json-stable-stringify";

const containsInvalidDataMessage: string = "Contains invalid data";

/**
 * Gets the array link data
 */
export function getArrayLinks(data: any): string[] {
    if (Array.isArray(data)) {
        return data.map((item: any, index: number) => {
            const defaultValue: string = `Item ${index + 1}`;

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
function getStringFromData(data: string | number): string {
    if (typeof data === "number") {
        return data.toString();
    }

    return data || "";
}

export function getStringValue(
    data: string | number,
    defaultData: string | number
): string {
    return typeof data === "string" || typeof data === "number"
        ? getStringFromData(data)
        : getStringFromData(defaultData);
}

/**
 * Determine if an item is required
 */
export function getIsRequired(item: any, required: string[]): boolean {
    let isRequired: boolean = false;

    if (Array.isArray(required)) {
        required.forEach(
            (requiredItem: string): void => {
                if (requiredItem === item) {
                    isRequired = true;
                }
            }
        );
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
 * Resolves generated example data with any matching data in the cache
 */
export function resolveExampleDataWithCachedData(schema: any, cachedData: any): any {
    const exampleData: any = generateExampleData(schema, "");
    const curatedCachedData: any = cloneDeep(cachedData);

    // removes any cached items which do not match and item in
    // the example data and are not included in the schema properties
    Object.keys(curatedCachedData).forEach((item: string) => {
        if (
            typeof exampleData[item] === "undefined" &&
            (schema.properties && !schema.properties[item])
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
function cachedDataResolver(objValue: any, srcValue: any, key: number, object: any): any {
    if (
        typeof srcValue !== "undefined" &&
        typeof objValue !== "undefined" &&
        typeof srcValue === typeof objValue
    ) {
        const newObj: any = cloneDeep(object);
        set(newObj, key, srcValue);

        return srcValue;
    } else {
        return void 0;
    }
}

/**
 * Normalizes a location for getting and setting values
 */
export function getNormalizedLocation(
    location: string,
    property: string,
    schema: any
): string {
    let normalizedProperty: string = "";
    let normalizedLocation: string =
        location === "" || property === "" ? location : `${location}.`;
    normalizedProperty = property.split(".").join(`.${PropertyKeyword.properties}.`);
    normalizedLocation =
        typeof property !== "undefined"
            ? `${normalizedLocation}${normalizedProperty}`
            : normalizedLocation;

    return normalizedLocation;
}

function getArrayExample(schemaSection: any): any[] {
    const example: any = getDataFromSchema(schemaSection.items);

    if (schemaSection.minItems) {
        return new Array(schemaSection.length - 1).fill(example);
    }

    return [example];
}

function checkIsObjectAndSetType(schemaSection: any): any {
    if (schemaSection.properties && schemaSection.type !== "object") {
        return "object";
    }

    return schemaSection.type;
}

function getOneOfAnyOfType(schemaSection: any): CombiningKeyword | null {
    return schemaSection.oneOf
        ? CombiningKeyword.oneOf
        : schemaSection.anyOf
            ? CombiningKeyword.anyOf
            : null;
}

/**
 * Generates example data for a newly added optional schema item
 */
export function generateExampleData(schema: any, propertyLocation: string): any {
    let schemaSection: any =
        propertyLocation === "" ? schema : get(schema, propertyLocation);
    const oneOfAnyOf: CombiningKeyword | null = getOneOfAnyOfType(schemaSection);

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
export function getArraySchemaLocation(
    schemaLocation: string,
    propertyName: string,
    schema: any,
    oneOfAnyOf: any
): string {
    let arraySchemaLocation: string = "";

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
export function formControlAttributeMapping(
    config: AttributeSettingsMappingToPropertyNames,
    propertyName: string
): number | null {
    let itemAttributeValue: any = null;

    Object.keys(config).forEach(
        (attributeName: string): void => {
            for (const attributeConfig of config[attributeName]) {
                for (const property of attributeConfig.propertyNames) {
                    if (property === propertyName) {
                        itemAttributeValue = attributeConfig.value;
                    }
                }
            }
        }
    );

    return itemAttributeValue;
}

export function checkHasOneOfAnyOf(oneOf: any, anyOf: any): boolean {
    return oneOf || anyOf;
}

export function checkIsDifferentSchema(currentSchema: any, nextSchema: any): boolean {
    return nextSchema !== currentSchema;
}

export function checkIsDifferentData(currentData: any, nextData: any): boolean {
    return currentData !== nextData;
}

export function getDataLocationRelativeToRoot(
    location: string,
    dataLocation: string
): string {
    return isRootLocation(dataLocation) || isRootLocation(location)
        ? `${dataLocation}${location}`
        : `${dataLocation}.${location}`;
}

export function getData(location: string, data: any): any {
    return isRootLocation(location) ? data : get(data, location);
}

export function isSelect(property: any): boolean {
    return typeof property.enum !== "undefined" && property.enum.length > 0;
}

export function isConst(property: any): boolean {
    return typeof property.const !== "undefined";
}

export function checkIsObject(property: any, schema: any): boolean {
    return (property.properties || property.type === "object") && property === schema;
}

export function handleToggleClick(value: any, id: string, updateRequested: any): any {
    return (e: React.MouseEvent<MouseEvent>): void => {
        e.preventDefault();

        updateRequested(value, id);
    };
}

export function getLabel(label: string, title: string): string {
    return label === "" && title !== void 0 ? title : label;
}

export const propsKeyword: string = "props";

export enum PropertyKeyword {
    properties = "properties",
}

export interface NavigationItemConfig {
    dataLocation: string;
    schemaLocation: string;
    schema: any;
    data: any;
    default: any;
}

/**
 * Determines the navigation from
 * - section links
 * - child components
 * - array items
 * - breadcrumb links
 */
export function getActiveComponentAndSection(dataLocation: string): Partial<FormState> {
    const state: Partial<FormState> = {};

    state.activeNavigationConfigId = dataLocation;

    return state;
}

/**
 * Gets locations from individual location segments
 * Example:
 * getLocationsFromSegments(["children[0].props.object"])
 * output: ["children[0]", "children[0].props", "children[0].props.object"]
 */
export function getLocationsFromSegments(segments: string[]): string[] {
    return segments.map((location: string, index: number) => {
        return segments.slice(0, index + 1).join(".");
    });
}

/**
 * Gets the data location from the current component
 */
export function getCurrentComponentDataLocation(
    dataLocation: string,
    lastComponentDataLocation: string
): string {
    return dataLocation.replace(lastComponentDataLocation, "").replace(/^\./, "");
}

/**
 * Check to see if we are on the root location
 */
export function isRootLocation(location: string): boolean {
    return location === "";
}

/**
 * Check to see if this schema is the same as another schema
 */
export function isDifferentSchema(oldSchema: any, newSchema: any): boolean {
    return stringify(oldSchema) !== stringify(newSchema);
}

/**
 * Check to see if this schema has been modified
 */
export function isModifiedSchema(oldSchema: any, newSchema: any): boolean {
    return stringify(oldSchema) !== stringify(newSchema);
}

/**
 * Finds the schema using the data location
 */
export function getSchemaByDataLocation(
    currentSchema: any,
    data: any,
    dataLocation: string,
    childOptions: FormChildOptionItem[]
): any {
    if (dataLocation === "") {
        return currentSchema;
    }

    const subData: any = get(data, dataLocation);
    const id: string | undefined = subData ? subData.id : void 0;
    const childOptionWithMatchingSchemaId: any = childOptions.find(
        (childOption: FormChildOptionItem) => {
            return childOption.schema.id === id;
        }
    );

    return childOptionWithMatchingSchemaId
        ? childOptionWithMatchingSchemaId.schema
        : currentSchema;
}

/**
 * Gets the validation error message using a data location
 */
export function getErrorFromDataLocation(
    dataLocation: string,
    validationErrors: ValidationError[]
): string {
    let error: string = "";

    if (Array.isArray(validationErrors)) {
        const normalizedDataLocation: string = normalizeDataLocationToDotNotation(
            dataLocation
        );

        for (const validationError of validationErrors) {
            if (normalizedDataLocation === validationError.dataLocation) {
                error = validationError.invalidMessage;
            } else {
                let containsInvalidData: boolean;

                if (normalizedDataLocation === "") {
                    containsInvalidData = true;
                } else {
                    const dataLocations: string[] = validationError.dataLocation.split(
                        "."
                    );

                    containsInvalidData = dataLocations.some(
                        (value: string, index: number) => {
                            return (
                                normalizedDataLocation ===
                                dataLocations.slice(0, index + 1).join(".")
                            );
                        }
                    );
                }

                if (error === "" && containsInvalidData) {
                    error = containsInvalidDataMessage;
                }
            }
        }
    }

    return error;
}

export function isDefault<T>(value: T | void, defaultValue: T | void): boolean {
    return typeof value === "undefined" && typeof defaultValue !== "undefined";
}

export function updateControlSectionState(
    props: SectionControlProps
): SectionControlState {
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
    };
}

/**
 * Gets the options for a oneOf/anyOf select
 */
export function getOneOfAnyOfSelectOptions(schema: any, state: any): React.ReactNode {
    return schema[state.oneOfAnyOf.type].map(
        (oneOfAnyOfOption: any, index: number): React.ReactNode => {
            return (
                <option key={index} value={index}>
                    {get(oneOfAnyOfOption, "title") ||
                        get(oneOfAnyOfOption, "description") ||
                        "No title"}
                </option>
            );
        }
    );
}
