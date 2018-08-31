import { clone, cloneDeep, get, isEqual, mergeWith } from "lodash-es";
import * as tv4 from "tv4";
import {
    BreadcrumbItemEventHandler,
    IFormState
} from "./form.props";

const squareBracketsRegex: RegExp = /\[(\d+?)\]/g;
const oneOfAnyOfRegex: RegExp = /(oneOf|anyOf)\[\d+\]/g;
const arrayItemsRegex: RegExp = /(\.items)$/;

export interface INavigationItem {
    dataLocation: string;
    schemaLocation: string;
    title: string;
    data: any;
    schema: any;
}

export interface INavigationItem {
    dataLocation: string;
    data: any;
    schema: any;
}

/**
 * Gets the data cache based on a new data object and
 * previous data object
 */
export function getDataCache(dataCache: any, newData: any): any {
    let newDataCache: any = (typeof dataCache !== "undefined") ? cloneDeep(dataCache) : newData;

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

export interface IBreadcrumbItem {
    href: string;
    text: string;
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
): Partial<IFormState> {
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
 * Gets the navigational items
 */
export function getNavigation(dataLocation: string, data: any, schema: any): INavigationItem[] {
    const normalizedDataLocation: string = normalizeDataLocation(dataLocation, data);
    const dataLocations: string[] = normalizedDataLocation.split(".");

    const navigation: INavigationItem = {
        dataLocation: "",
        schemaLocation: "",
        title: schema.title,
        data,
        schema
    };

    if (dataLocation === "") {
        return [navigation];
    }

    return [navigation].concat(
        dataLocations.map((location: string, index: number) => {
            const currentDataLocation: string = dataLocations.slice(0, index + 1).join(".");
            const currentSchemaLocation: string = mapSchemaLocationFromDataLocation(currentDataLocation, data, schema);
            const currentSchema: any = get(schema, currentSchemaLocation);

            return {
                dataLocation: currentDataLocation,
                schemaLocation: currentSchemaLocation,
                title: currentSchema.title || "Untitled",
                data: get(data, currentDataLocation),
                schema: currentSchema
            };
        })
    );
}

/**
 * Converts all property locations to dot notation and all array item references to bracket notation
 */
export function normalizeDataLocation(dataLocation: string, data: any): string {
    const normalizedDataLocation: string = dataLocation.replace(squareBracketsRegex, `.$1`); // convert all [ ] to . notation
    return arrayItemsToBracketNotation(normalizedDataLocation, data); // convert back all array items to use [ ]
}

/**
 * Removes any references to array index
 */
export function normalizeSchemaLocation(schemaLocation: string, lastLocationItem?: boolean): string {
    const schemaLocationWithoutArrayLocation: string = schemaLocation.replace(squareBracketsRegex, "");
    return lastLocationItem ? schemaLocationWithoutArrayLocation.replace(arrayItemsRegex, "") : schemaLocationWithoutArrayLocation;
}

/**
 * Creates a schema location from a data location
 */
export function mapSchemaLocationFromDataLocation(dataLocation: string, data: any, schema: any): string {
    if (dataLocation === "") {
        return "";
    }

    const normalizedDataLocation: string = normalizeDataLocation(dataLocation, data);
    const dataLocationSegments: string[] = normalizedDataLocation.split(".");
    const schemaLocationSegments: string[] = getSchemaLocationSegmentsFromDataLocationSegments(dataLocationSegments, schema, data);

    return normalizeSchemaLocation(schemaLocationSegments.join(".")).replace(arrayItemsRegex, "");
}

/**
 * Get an array of schema location strings from an array of data location strings
 */
export function getSchemaLocationSegmentsFromDataLocationSegments(dataLocationSegments: string[], schema: any, data: any): string[] {
    let schemaLocationSegments: string[] = getSchemaOneOfAnyOfLocationSegments(schema, data);

    for (let i: number = 0; i < dataLocationSegments.length; i++) {
        const partialData: any = getPartialData(dataLocationSegments.slice(0, i).join("."), data);
        const partialSchema: any = getPartialData(normalizeSchemaLocation(schemaLocationSegments.join(".")), schema);

        schemaLocationSegments = schemaLocationSegments.concat(
            getSchemaOneOfAnyOfLocationSegments(
                partialSchema,
                partialData
            )
        );

        schemaLocationSegments = schemaLocationSegments.concat(
            getSchemaLocationSegmentsFromDataLocationSegment(
                dataLocationSegments[i],
                partialData
            )
        );
    }

    return schemaLocationSegments;
}

/**
 * Gets data from a data and location
 */
export function getPartialData(location: string, data: any): any {
    return location === "" ? data : get(data, location);
}

/**
 * Gets an array of oneOf/anyOf with a valid index from a schema and data
 */
export function getSchemaOneOfAnyOfLocationSegments(schema: any, data: any): string[] {
    const schemaLocationSegments: string[] = [];

    if (!!schema.anyOf) {
        schemaLocationSegments.push(`anyOf.${getValidAnyOfOneOfIndex("anyOf", data, schema)}`);
    }

    if (!!schema.oneOf) {
        schemaLocationSegments.push(`oneOf.${getValidAnyOfOneOfIndex("oneOf", data, schema)}`);
    }

    return schemaLocationSegments;
}

/**
 * Get an array of schema location strings from a single data location item
 */
export function getSchemaLocationSegmentsFromDataLocationSegment(
    dataLocation: string,
    data: any
): string[] {
    const schemaLocationSegments: string[] = [];

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
        schemaLocationSegments.push("properties");
    }

    schemaLocationSegments.push(dataLocation);

    // In the case that this is an array and this is not the the last item in the data location string,
    // add the JSON schema "items" keyword
    if ((Array.isArray(data) || isDataLocationArrayItem(dataLocation))) {
        schemaLocationSegments.push("items");
    }

    return schemaLocationSegments;
}

/**
 * Checks to see if the data location item is an array item
 */
export function isDataLocationArrayItem(dataLocationItem: string): boolean {
    const squareBracketRegex: RegExp = squareBracketsRegex;
    const match: boolean = false;

    if (dataLocationItem.match(squareBracketRegex)) {
        const matches: string[] = dataLocationItem.match(squareBracketRegex);

        if (typeof parseInt(matches[0].replace(squareBracketRegex, "$1"), 10) === "number") {
            return true;
        }
    }

    return match;
}

/**
 * Converts a data location strings array items into bracket notation
 */
export function arrayItemsToBracketNotation(dataLocation: string, data: any): string {
    const normalizedDataLocation: string[] = [];
    const dataLocations: string[] = dataLocation.split(".");

    for (let i: number = 0; i < dataLocations.length; i++) {
        const currentDataLocation: string = dataLocations.slice(0, i + 1).join(".");

        if (Array.isArray(get(data, currentDataLocation))) {
            normalizedDataLocation.push(`${dataLocations[i]}[${dataLocations[i + 1]}]`);
            i++;
        } else {
            normalizedDataLocation.push(dataLocations[i]);
        }
    }

    return normalizedDataLocation.join(".");
}

/**
 * Gets the index from a JSON schemas oneOf/anyOf array that validates against the data
 */
export function getValidAnyOfOneOfIndex(oneOfAnyOf: string, data: any, schema: any): number {
    return schema[oneOfAnyOf].findIndex((item: any): number => tv4.validate(data, item));
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
    navigation: INavigationItem[],
    handleClick: (schemaLocation: string, dataLocation: string, schema: any) => BreadcrumbItemEventHandler
): IBreadcrumbItem[] {
    const breadcrumbs: IBreadcrumbItem[] = [];

    navigation.forEach((navigationItem: INavigationItem) => {
        breadcrumbs.push({
            href: navigationItem.dataLocation,
            text: navigationItem.title,
            onClick: handleClick(navigationItem.schemaLocation, navigationItem.dataLocation, navigationItem.schema)
        });
    });

    return breadcrumbs;
}
