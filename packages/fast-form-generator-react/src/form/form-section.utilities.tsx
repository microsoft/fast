import * as React from "react";
import { cloneDeep, get, mergeWith, set, unset } from "lodash-es";
import { getExample } from "@microsoft/fast-permutator";
import tv4 from "tv4";
import {
    AttributeSettingsMappingToPropertyNames,
    FormComponentMappingToPropertyNamesProps,
    FormOrderByPropertyNamesCategories,
    FormOrderByPropertyNamesProps,
} from "./form.props";
import { isRootLocation } from "./form.utilities";
import {
    AssignedCategoryParams,
    AssignedParamsByCategoryConfig,
    FormCategoryProps,
    FormItemParameters,
    FormItemsWithConfigOptions,
    FormSectionProps,
    InitialOneOfAnyOfState,
    OneOfAnyOf,
    oneOfAnyOfType,
} from "./form-section.props";
import { mappingName } from "./form-item";
import { FormControlProps } from "./form-control.props";

export function getInitialOneOfAnyOfState(
    schema: any,
    data: any
): InitialOneOfAnyOfState {
    let oneOfAnyOf: oneOfAnyOfType;
    let oneOfAnyOfState: OneOfAnyOf;
    let activeIndex: number;
    let updatedSchema: any = schema;

    if (schema.oneOf || schema.anyOf) {
        oneOfAnyOf = schema.oneOf ? oneOfAnyOfType.oneOf : oneOfAnyOfType.anyOf;
        activeIndex = getOneOfAnyOfActiveIndex(oneOfAnyOf, schema, data);
        updatedSchema = schema[oneOfAnyOf][activeIndex];
        oneOfAnyOfState = {
            type: oneOfAnyOf,
            activeIndex,
        };
    }

    return {
        schema: updatedSchema,
        oneOfAnyOf: oneOfAnyOfState,
    };
}

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
 * Gets the options for a oneOf/anyOf select
 */
export function getOneOfAnyOfSelectOptions(schema: any, state: any): JSX.Element[] {
    return schema[state.oneOfAnyOf.type].map(
        (option: any, index: number): JSX.Element => {
            return (
                <option key={index} value={index}>
                    {get(option, "title") || get(option, "description") || "No title"}
                </option>
            );
        }
    );
}

function removeUndefinedKeys(data: any): any {
    const clonedData: any = cloneDeep(data);

    if (clonedData !== undefined) {
        Object.keys(clonedData).forEach((key: string) => {
            if (typeof clonedData[key] === "undefined") {
                // if this is a child we may be getting undefined default props, remove these
                delete clonedData[key];
            }
        });
    }

    return clonedData;
}

function checkSchemaTypeIsArray(schema: any, type: string): boolean {
    return schema && Array.isArray(schema[type]);
}

/**
 * Find out what the active index should be based on the data
 */
export function getOneOfAnyOfActiveIndex(type: string, schema: any, data: any): number {
    let activeIndex: number = 0;

    if (checkSchemaTypeIsArray(schema, type)) {
        const newData: any = removeUndefinedKeys(data);

        schema[type].forEach((oneOfAnyOfItem: any, index: number) => {
            if (validateSchema(oneOfAnyOfItem, newData)) {
                activeIndex = index;
                return;
            }
        });
    }

    return activeIndex;
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

        if (!validateSchema(this, newObj)) {
            return objValue;
        }

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
    normalizedProperty = property.split(".").join(".properties.");
    normalizedLocation =
        typeof property !== "undefined"
            ? `${normalizedLocation}${normalizedProperty}`
            : normalizedLocation;

    return normalizedLocation;
}

function getArrayExample(schemaSection: any): any[] {
    const example: any = getExample(schemaSection.items);

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

/**
 * Generates example data for a newly added optional schema item
 */
export function generateExampleData(schema: any, propertyLocation: string): any {
    let schemaSection: any =
        propertyLocation === "" ? schema : get(schema, propertyLocation);

    if (schemaSection.oneOf) {
        schemaSection = schemaSection.oneOf[0];
    }

    if (schemaSection.anyOf) {
        schemaSection = schemaSection.anyOf[0];
    }

    schemaSection.type = checkIsObjectAndSetType(schemaSection);

    if (schemaSection.items) {
        return getArrayExample(schemaSection);
    }

    return getExample(schemaSection);
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
        arraySchemaLocation += `${
            arraySchemaLocation === "" ? "" : "."
        }properties.${propertyName}`;
    }

    return arraySchemaLocation;
}

/**
 * Assigns a schema form item mapping based on property name
 */
export function formItemMapping(
    config: FormComponentMappingToPropertyNamesProps,
    propertyName: string
): null | mappingName {
    let itemLayout: any = null;

    Object.keys(config).forEach(
        (layout: string): void => {
            for (const property of config[layout]) {
                if (property === propertyName) {
                    itemLayout = layout;
                }
            }
        }
    );

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

export function getOneOfAnyOfState(
    oneOfAnyOf: OneOfAnyOf,
    nextProps: FormSectionProps | FormControlProps
): OneOfAnyOf {
    const oneOfAnyOfState: Partial<OneOfAnyOf> = {};

    oneOfAnyOfState.type = nextProps.schema.oneOf
        ? oneOfAnyOfType.oneOf
        : oneOfAnyOfType.anyOf;
    oneOfAnyOfState.activeIndex = getOneOfAnyOfActiveIndex(
        oneOfAnyOfState.type,
        nextProps.schema,
        nextProps.data
    );

    return oneOfAnyOfState as OneOfAnyOf;
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

/**
 * Organizes the categories and items by weight
 */
export function getWeightedCategoriesAndItems(
    categoryParams: FormCategoryProps[]
): FormCategoryProps[] {
    categoryParams.sort(function(a: any, b: any): number {
        return b.weight - a.weight;
    });

    for (const categoryParam of categoryParams) {
        categoryParam.items.sort(function(a: any, b: any): number {
            return b.weight - a.weight;
        });
    }

    return categoryParams;
}

export function checkIsObject(property: any, schema: any): boolean {
    return (property.properties || property.type === "object") && property === schema;
}

export function findAssignedParamsByCategoryProperties(
    config: AssignedParamsByCategoryConfig
): AssignedCategoryParams {
    for (const propertyName of config.categoryProperties) {
        if (propertyName === config.formItemParameter.propertyName) {
            return {
                category: config.category.title,
                expandable: config.category.expandable,
                categoryWeight: config.category.weight,
                itemWeight: config.categoryProperty.weight || config.assignedItemWeight,
            };
        }
    }
}

export function getCategoryIndex(
    assignedCategoryParams: AssignedCategoryParams,
    categoryParams: FormCategoryProps[]
): number {
    for (
        let i: number = 0, categoryParamsLength: number = categoryParams.length;
        i < categoryParamsLength;
        i++
    ) {
        if (assignedCategoryParams.category === categoryParams[i].title) {
            return i;
        }
    }
}

export function checkCategoryConfigPropertyCount(
    formItems: FormItemsWithConfigOptions,
    orderByPropertyNames: FormOrderByPropertyNamesProps
): boolean {
    return (
        typeof orderByPropertyNames.showCategoriesAtPropertyCount === "number" &&
        orderByPropertyNames.showCategoriesAtPropertyCount >= formItems.items.length
    );
}

export function findOrderedByPropertyNames(
    category: FormOrderByPropertyNamesCategories,
    formItemParameter: FormItemParameters,
    assignedItemWeight: number
): AssignedCategoryParams {
    for (const categoryProperty of category.properties) {
        const categoryProperties: string[] = Array.isArray(categoryProperty.propertyName)
            ? categoryProperty.propertyName
            : [categoryProperty.propertyName];

        const assignedParamsByCategoryProperties: AssignedCategoryParams = findAssignedParamsByCategoryProperties(
            {
                categoryProperties,
                formItemParameter,
                category,
                categoryProperty,
                assignedItemWeight,
            }
        );

        if (Boolean(assignedParamsByCategoryProperties)) {
            return assignedParamsByCategoryProperties;
        }
    }
}

function getAssignedCategoryParams(
    formItemParameter: FormItemParameters,
    assignedItemWeight: number,
    orderByPropertyNames: FormOrderByPropertyNamesProps
): AssignedCategoryParams {
    for (const category of orderByPropertyNames.categories) {
        const formItemOrderedByPropertyNames: AssignedCategoryParams = findOrderedByPropertyNames(
            category,
            formItemParameter,
            assignedItemWeight
        );

        if (Boolean(formItemOrderedByPropertyNames)) {
            return formItemOrderedByPropertyNames;
        }
    }

    return {
        category: "Default",
        categoryWeight: orderByPropertyNames.defaultCategoryWeight || 0,
        itemWeight: 0,
    };
}

export function getCategoryParams(
    formItemParameters: FormItemParameters[],
    orderByPropertyNames: FormOrderByPropertyNamesProps
): FormCategoryProps[] {
    const categoryParams: FormCategoryProps[] = [];

    for (const formItemParameter of formItemParameters) {
        const assignedCategoryParams: AssignedCategoryParams = getAssignedCategoryParams(
            formItemParameter,
            0,
            orderByPropertyNames
        );
        const categoryIndex: number = getCategoryIndex(
            assignedCategoryParams,
            categoryParams
        );

        if (typeof categoryIndex === "number") {
            categoryParams[categoryIndex].items.push({
                weight: assignedCategoryParams.itemWeight,
                params: formItemParameter,
            });
        } else {
            categoryParams.push({
                title: assignedCategoryParams.category,
                weight: assignedCategoryParams.categoryWeight,
                expandable: assignedCategoryParams.expandable,
                items: [
                    {
                        weight: assignedCategoryParams.itemWeight,
                        params: formItemParameter,
                    },
                ],
            });
        }
    }

    return getWeightedCategoriesAndItems(categoryParams);
}

export function handleToggleClick(value: any, id: string, updateRequested: any): any {
    return (e: React.MouseEvent<MouseEvent>): void => {
        e.preventDefault();

        updateRequested(value, id);
    };
}

export function isMapping(
    location: string,
    componentMappingToPropertyNames: FormComponentMappingToPropertyNamesProps
): boolean {
    return (
        componentMappingToPropertyNames &&
        typeof formItemMapping(componentMappingToPropertyNames, location) === "string"
    );
}

export function getLabel(label: string, title: string): string {
    return label === "" && title !== void 0 ? title : label;
}
