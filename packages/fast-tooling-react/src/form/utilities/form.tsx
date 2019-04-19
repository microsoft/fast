import React from "react";
import { cloneDeep, get, mergeWith, set, unset } from "lodash-es";
import { getDataFromSchema } from "../../data-utilities";
import {
    getChildOptionBySchemaId,
    getDataLocationsOfChildren,
    getPartialData,
    mapSchemaLocationFromDataLocation,
    normalizeDataLocation,
} from "../../data-utilities/location";
import ajv, { ErrorObject, ValidationError } from "ajv";
import {
    AttributeSettingsMappingToPropertyNames,
    FormOrderByPropertyNamesCategories,
    FormOrderByPropertyNamesProps,
} from "../form/form.props";
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
} from "../form/form-section.props";
import { FormControlProps } from "../form/form-control.props";
import {
    BreadcrumbItemEventHandler,
    FormChildOptionItem,
    FormState,
} from "../form/form.props";
import { reactChildrenStringSchema } from "../form/form-item.children.text";

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
export function validateSchema(schema: any, data: any): boolean | PromiseLike<any> {
    const validation: ajv.Ajv = new ajv({ schemaId: "auto", allErrors: true });
    return validation.validate(schema, data) || false;
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
        arraySchemaLocation += `${
            arraySchemaLocation === "" ? "" : "."
        }properties.${propertyName}`;
    }

    return arraySchemaLocation;
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

export function getLabel(label: string, title: string): string {
    return label === "" && title !== void 0 ? title : label;
}

const squareBracketsRegex: RegExp = /\[(\d+?)\]/g;
const propsKeyword: string = "props";

export enum PropertyKeyword {
    properties = "properties",
    reactProperties = "reactProperties",
}

export interface NavigationItem {
    dataLocation: string;
    schemaLocation: string;
    title: string;
    data: any;
    schema: any;
    invalidMessage?: ValidationError;
}

export interface NavigationItem {
    dataLocation: string;
    data: any;
    schema: any;
}

export interface BreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type HandleBreadcrumbClick = (
    schemaLocation: string,
    dataLocation: string,
    schema: any
) => BreadcrumbItemEventHandler;

/**
 * Gets the data cache based on a new data object and
 * previous data object
 */
export function getDataCache(dataCache: any, newData: any): any {
    let newDataCache: any =
        typeof dataCache !== "undefined" ? cloneDeep(dataCache) : newData;

    if (newDataCache !== newData) {
        newDataCache = mergeWith(dataCache, newData, cachedArrayResolver);
    }

    return newDataCache;
}

/**
 * Resolves arrays when the object is an array and the data passed is an array
 */
function cachedArrayResolver(objValue: any, srcValue: any): any {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue;
    }
}

/**
 * Determines the navigation from
 * - section links
 * - child components
 * - array items
 * - breadcrumb links
 */
export function getActiveComponentAndSection(
    schemaLocation: string,
    dataLocation: string,
    schema?: any
): Partial<FormState> {
    const state: any = {};

    state.activeDataLocation = dataLocation;
    state.activeSchemaLocation = schemaLocation;

    // if the schema is undefined its most likely an array
    if (typeof schema !== "undefined") {
        state.schema = schema;
        state.titleProps = schema.title || "Untitled";
    }

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
 * Gets the navigational items
 */
export function getNavigation(
    dataLocation: string,
    data: any,
    schema: any,
    childOptions: FormChildOptionItem[],
    schemaLocation?: string
): NavigationItem[] {
    const allChildOptions: FormChildOptionItem[] = getReactDefaultChildren().concat(
        childOptions
    );
    const dataLocationsOfChildren: string[] = getDataLocationsOfChildren(
        schema,
        data,
        allChildOptions
    );
    const normalizedDataLocation: string = !dataLocationsOfChildren.includes(dataLocation)
        ? normalizeDataLocation(dataLocation, data)
        : typeof get(data, dataLocation) === "string"
            ? normalizeDataLocation(dataLocation, data)
            : `${normalizeDataLocation(dataLocation, data)}.${propsKeyword}`;
    const dataLocations: Set<string> = new Set(
        [""].concat(getLocationsFromSegments(normalizedDataLocation.split(".")))
    );
    const navigationItems: NavigationItem[] = [];
    let currentComponentSchema: any = schema;
    let lastComponentDataLocation: string = "";

    dataLocations.forEach((dataLocationItem: string) => {
        if (dataLocationsOfChildren.includes(dataLocationItem)) {
            const isChildString: boolean =
                typeof get(data, dataLocationItem) === "string";
            currentComponentSchema = getSchemaByDataLocation(
                schema,
                data,
                dataLocationItem,
                allChildOptions
            );
            lastComponentDataLocation = isChildString
                ? dataLocationItem
                : `${dataLocationItem}.${propsKeyword}`;

            if (isChildString) {
                navigationItems.push(
                    getNavigationItem(
                        dataLocationItem,
                        "",
                        reactChildrenStringSchema,
                        data
                    )
                );
            }
        } else {
            const isRoot: boolean = isRootLocation(lastComponentDataLocation);
            const rootLocationOfComponent: string = isRoot
                ? ""
                : lastComponentDataLocation.replace(dataLocationItem, "");
            const dataLocationFromLastComponent: string = getCurrentComponentDataLocation(
                dataLocationItem,
                lastComponentDataLocation
            );
            let currentSchemaLocation: string =
                schemaLocation ||
                mapSchemaLocationFromDataLocation(
                    isRoot ? dataLocationItem : dataLocationFromLastComponent,
                    isRoot ? data : get(data, rootLocationOfComponent),
                    currentComponentSchema
                );
            const currentSchemaLocationSegments: string[] = currentSchemaLocation.split(
                "."
            );
            const currentSchemaLocationSegmentsLength: number =
                currentSchemaLocationSegments.length;
            if (
                !isNaN(
                    parseInt(
                        currentSchemaLocationSegments[
                            currentSchemaLocationSegmentsLength - 1
                        ],
                        10
                    )
                ) &&
                (currentSchemaLocationSegments[
                    currentSchemaLocationSegmentsLength - 2
                ] === "oneOf" ||
                    currentSchemaLocationSegments[
                        currentSchemaLocationSegmentsLength - 2
                    ] === "anyOf")
            ) {
                currentSchemaLocation = currentSchemaLocationSegments
                    .slice(0, currentSchemaLocationSegmentsLength - 2)
                    .join(".");
            }

            const currentSchema: any =
                dataLocationFromLastComponent === ""
                    ? currentComponentSchema
                    : get(currentComponentSchema, currentSchemaLocation);

            navigationItems.push(
                getNavigationItem(
                    dataLocationItem,
                    currentSchemaLocation,
                    currentSchema,
                    data
                )
            );
        }
    });

    return navigationItems;
}

/**
 * Get a single navigation item
 */
export function getNavigationItem(
    dataLocation: string,
    schemaLocation: string,
    schema: any,
    data: any
): NavigationItem {
    return {
        dataLocation,
        schemaLocation,
        title: schema.title || "Untitled",
        data: getPartialData(dataLocation, data),
        schema,
    };
}

/**
 * Get React's default children
 */
export function getReactDefaultChildren(): FormChildOptionItem[] {
    return [
        {
            name: "Text",
            component: null,
            schema: reactChildrenStringSchema,
        },
    ];
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
 * Removes any references to array index
 */
export function normalizeSchemaLocation(schemaLocation: string): string {
    return schemaLocation.replace(squareBracketsRegex, "");
}

/**
 * Check to see if we are on the root location
 */
export function isRootLocation(location: string): boolean {
    return location === "";
}

/**
 * Gets breadcrumbs from navigation items
 */
export function getBreadcrumbs(
    navigation: NavigationItem[],
    handleClick: HandleBreadcrumbClick
): BreadcrumbItem[] {
    return navigation.map(
        (navigationItem: NavigationItem): BreadcrumbItem => {
            return {
                href: navigationItem.dataLocation,
                text: navigationItem.title,
                onClick: handleClick(
                    navigationItem.schemaLocation,
                    navigationItem.dataLocation,
                    navigationItem.schema
                ),
            };
        }
    );
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
 * Finds the component using the schema id
 */
export function getComponentByDataLocation(
    id: string,
    childOptions: FormChildOptionItem[]
): any {
    const childOption: FormChildOptionItem = getChildOptionBySchemaId(id, childOptions);

    return childOption ? childOption.component : null;
}

/**
 * Gets the validation error message using a data location
 */
export function getErrorFromDataLocation(
    dataLocation: string,
    validationErrors: ErrorObject[] | void
): string {
    let error: string = "";

    if (Array.isArray(validationErrors)) {
        validationErrors.forEach(
            (validationError: ErrorObject): void => {
                const matchingDataLocationToDataPath: string =
                    dataLocation === "" ? dataLocation : `.${dataLocation}`;

                if (matchingDataLocationToDataPath === validationError.dataPath) {
                    error = validationError.message;
                } else if (validationError.keyword === "required") {
                    const dataLocationItems: string[] = matchingDataLocationToDataPath.split(
                        "."
                    );

                    if (
                        dataLocationItems.slice(0, -1).join(".") ===
                            validationError.dataPath &&
                        get(validationError, "params.missingProperty") ===
                            dataLocationItems[dataLocationItems.length - 1]
                    ) {
                        error = validationError.message;
                    }
                } else if (
                    validationError.dataPath.slice(
                        0,
                        matchingDataLocationToDataPath.length
                    ) === matchingDataLocationToDataPath
                ) {
                    error = "Contains invalid data";
                }
            }
        );
    }

    return error;
}
