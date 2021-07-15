import React from "react";
import { FormState } from "../../form.props";
import {
    AttributeSettingsMappingToPropertyNames,
    FormChildOptionItem,
} from "../../types";
import {
    CategoryState,
    SectionControlProps,
    SectionControlState,
} from "../control.section.props";
import { ValidationError } from "@microsoft/fast-tooling";
/**
 * Gets the array link data
 */
export declare function getArrayLinks(data: any): string[];
export declare function getStringValue(
    data: string | number,
    defaultData: string | number
): string;
/**
 * Determine if an item is required
 */
export declare function getIsRequired(item: any, required: string[]): boolean;
/**
 * Determine if an item is not required
 */
export declare function getIsNotRequired(item: any, not?: string[]): boolean;
/**
 * Resolves generated example data with any matching data in the cache
 */
export declare function resolveExampleDataWithCachedData(
    schema: any,
    cachedData: any
): any;
/**
 * Normalizes a location for getting and setting values
 */
export declare function getNormalizedLocation(
    location: string,
    property: string,
    schema: any
): string;
/**
 * Generates example data for a newly added optional schema item
 */
export declare function generateExampleData(schema: any, propertyLocation: string): any;
/**
 * Get the array location
 */
export declare function getArraySchemaLocation(
    schemaLocation: string,
    propertyName: string,
    schema: any,
    oneOfAnyOf: any
): string;
/**
 * Assigns an attribute value based on property names
 */
export declare function formControlAttributeMapping(
    config: AttributeSettingsMappingToPropertyNames,
    propertyName: string
): number | null;
export declare function checkHasOneOfAnyOf(oneOf: any, anyOf: any): boolean;
export declare function checkIsDifferentSchema(
    currentSchema: any,
    nextSchema: any
): boolean;
export declare function checkIsDifferentData(currentData: any, nextData: any): boolean;
export declare function getDataLocationRelativeToRoot(
    location: string,
    dataLocation: string
): string;
export declare function getData(location: string, data: any): any;
export declare function isSelect(property: any): boolean;
export declare function isConst(property: any): boolean;
export declare function checkIsObject(property: any, schema: any): boolean;
export declare function handleToggleClick(
    value: any,
    id: string,
    updateRequested: any
): any;
export declare function getLabel(label: string, title: string): string;
export declare const propsKeyword: string;
export declare enum PropertyKeyword {
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
export declare function getActiveComponentAndSection(
    dataLocation: string
): Partial<FormState>;
/**
 * Gets locations from individual location segments
 * Example:
 * getLocationsFromSegments(["children[0].props.object"])
 * output: ["children[0]", "children[0].props", "children[0].props.object"]
 */
export declare function getLocationsFromSegments(segments: string[]): string[];
/**
 * Gets the data location from the current component
 */
export declare function getCurrentComponentDataLocation(
    dataLocation: string,
    lastComponentDataLocation: string
): string;
/**
 * Check to see if we are on the root location
 */
export declare function isRootLocation(location: string): boolean;
/**
 * Check to see if this schema is the same as another schema
 */
export declare function isDifferentSchema(oldSchema: any, newSchema: any): boolean;
/**
 * Check to see if this schema has been modified
 */
export declare function isModifiedSchema(oldSchema: any, newSchema: any): boolean;
/**
 * Finds the schema using the data location
 */
export declare function getSchemaByDataLocation(
    currentSchema: any,
    data: any,
    dataLocation: string,
    childOptions: FormChildOptionItem[]
): any;
/**
 * Gets the validation error message using a data location
 */
export declare function getErrorFromDataLocation(
    dataLocation: string,
    validationErrors: ValidationError[]
): string;
export declare function isDefault<T>(value: T | void, defaultValue: T | void): boolean;
export declare function getUpdatedCategories(
    categories?: CategoryState[],
    index?: number
): CategoryState[];
export declare function updateControlSectionState(
    props: SectionControlProps,
    state?: SectionControlState
): SectionControlState;
/**
 * Gets the options for a oneOf/anyOf select
 */
export declare function getOneOfAnyOfSelectOptions(
    schema: any,
    state: any
): React.ReactNode;
