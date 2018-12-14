import React from "react";
import { cloneDeep, get, isPlainObject, set } from "lodash-es";
import * as tv4 from "tv4";

export interface ChildOptionItem {
    /**
     * The name of the component
     */
    name?: string;

    /**
     * The React component
     */
    component: React.ComponentType;

    /**
     * The JSON schema for the component
     */
    schema: any;
}

export enum PropertyKeyword {
    properties = "properties",
    reactProperties = "reactProperties",
}

const squareBracketsRegex: RegExp = /\[(\d+?)\]/g;
const propsKeyword: string = "props";

/**
 * Gets data from a data and location
 */
export function getPartialData(location: string, data: any): any {
    return location === "" ? data : get(data, location);
}

/**
 * Converts all property locations to dot notation and all array item references to bracket notation
 */
export function normalizeDataLocation(dataLocation: string, data: any): string {
    const normalizedDataLocation: string = dataLocation.replace(
        squareBracketsRegex,
        `.$1`
    ); // convert all [ ] to . notation
    return arrayItemsToBracketNotation(normalizedDataLocation, data); // convert back all array items to use [ ]
}

/**
 * Converts a data location strings array items into bracket notation
 */
function arrayItemsToBracketNotation(dataLocation: string, data: any): string {
    const normalizedDataLocation: string[] = [];
    const dataLocations: string[] = dataLocation.split(".");

    for (let i: number = 0; i < dataLocations.length; i++) {
        const currentDataLocation: string = dataLocations.slice(0, i + 1).join(".");
        const subData: any = get(data, currentDataLocation);

        // if the data is an array and not a react property
        if (Array.isArray(subData)) {
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
function getValidAnyOfOneOfIndex(oneOfAnyOf: string, data: any, schema: any): number {
    return schema[oneOfAnyOf].findIndex((item: any): number => tv4.validate(data, item));
}

/**
 * Gets an array of oneOf/anyOf with a valid index from a schema and data
 */
function getSchemaOneOfAnyOfLocationSegments(schema: any, data: any): string[] {
    const schemaLocationSegments: string[] = [];

    if (typeof schema === "undefined") {
        return schemaLocationSegments;
    }

    if (!!schema.anyOf) {
        schemaLocationSegments.push(
            `anyOf.${getValidAnyOfOneOfIndex("anyOf", data, schema)}`
        );
    }

    if (!!schema.oneOf) {
        schemaLocationSegments.push(
            `oneOf.${getValidAnyOfOneOfIndex("oneOf", data, schema)}`
        );
    }

    return schemaLocationSegments;
}

/**
 * Gets the correct property keyword
 */
function getObjectPropertyKeyword(schema: any): PropertyKeyword {
    if (!!schema) {
        return PropertyKeyword.reactProperties;
    } else {
        return PropertyKeyword.properties;
    }
}

/**
 * Removes any references to array index
 */
function normalizeSchemaLocation(schemaLocation: string): string {
    return schemaLocation.replace(squareBracketsRegex, "");
}

/**
 * Checks to see if the data location item is an array item
 */
function isDataLocationArrayItem(dataLocationItem: string): boolean {
    const squareBracketRegex: RegExp = squareBracketsRegex;
    const match: boolean = false;

    if (dataLocationItem.match(squareBracketRegex)) {
        const matches: string[] = dataLocationItem.match(squareBracketRegex);

        if (
            typeof parseInt(matches[0].replace(squareBracketRegex, "$1"), 10) === "number"
        ) {
            return true;
        }
    }

    return match;
}

/**
 * Get an array of schema location strings from a single data location item
 */
function getSchemaLocationSegmentsFromDataLocationSegment(
    dataLocation: string,
    schema: any,
    data: any
): string[] {
    const schemaLocationSegments: string[] = [];
    const normalizedDataLocationForArrayRemoval: string = dataLocation.replace(
        /\[\d+\]/g,
        ""
    );
    const subSchema: any = get(
        schema,
        `reactProperties.${normalizedDataLocationForArrayRemoval}`
    );
    const isChildren: boolean = subSchema && subSchema.type === "children";

    if (isPlainObject(data)) {
        schemaLocationSegments.push(getObjectPropertyKeyword(subSchema));
    }

    schemaLocationSegments.push(
        isChildren ? normalizedDataLocationForArrayRemoval : dataLocation
    );

    // In the case that this is an array and not an array of children,
    // add the JSON schema "items" keyword
    if (isDataLocationArrayItem(dataLocation) && !isChildren) {
        schemaLocationSegments.push("items");
    }

    return schemaLocationSegments;
}

/**
 * Get an array of schema location strings from an array of data location strings
 */
function getSchemaLocationSegmentsFromDataLocationSegments(
    dataLocationSegments: string[],
    schema: any,
    data: any
): string[] {
    let schemaLocationSegments: string[] = getSchemaOneOfAnyOfLocationSegments(
        schema,
        data
    );

    for (let i: number = 0; i < dataLocationSegments.length; i++) {
        const partialData: any = getPartialData(
            dataLocationSegments.slice(0, i).join("."),
            data
        );
        const partialSchema: any = getPartialData(
            normalizeSchemaLocation(schemaLocationSegments.join(".")),
            schema
        );

        schemaLocationSegments = schemaLocationSegments.concat(
            getSchemaOneOfAnyOfLocationSegments(partialSchema, partialData)
        );

        schemaLocationSegments = schemaLocationSegments.concat(
            getSchemaLocationSegmentsFromDataLocationSegment(
                dataLocationSegments[i],
                partialSchema,
                partialData
            )
        );
    }

    return schemaLocationSegments;
}

/**
 * Creates a schema location from a data location
 */
export function mapSchemaLocationFromDataLocation(
    dataLocation: string,
    data: any,
    schema: any
): string {
    if (dataLocation === "") {
        return "";
    }

    const normalizedDataLocation: string = normalizeDataLocation(dataLocation, data);
    const dataLocationSegments: string[] = normalizedDataLocation.split(".");
    const schemaLocationSegments: string[] = getSchemaLocationSegmentsFromDataLocationSegments(
        dataLocationSegments,
        schema,
        data
    );

    return normalizeSchemaLocation(schemaLocationSegments.join("."));
}

/**
 * Finds a subset of locations that are react children
 */
function getReactChildrenLocationsFromSchema(
    schema: any,
    schemaLocations: any
): string[] {
    return schemaLocations.filter(
        (schemaLocation: string): boolean => {
            return (
                !!schemaLocation.match(/reactProperties\..+?\b/) &&
                get(schema, schemaLocation).type === "children"
            );
        }
    );
}

/**
 * Finds the locations throughout an object
 */
function getLocationsFromObject(data: any, location: string = ""): string[] {
    let updatedLocations: string[] = [];

    if (typeof data === "string" || data === null || data === undefined) {
        return updatedLocations;
    }

    Object.keys(data).forEach((key: string) => {
        const newLocation: string = location === "" ? key : `${location}.${key}`;
        const dataSubset: any = get(data, key);
        updatedLocations.push(newLocation);

        if (typeof dataSubset === "object" && dataSubset !== null) {
            updatedLocations = updatedLocations.concat(
                getLocationsFromObject(dataSubset, newLocation)
            );
        }
    });

    return updatedLocations;
}

/**
 * Finds the data locations of children
 */
export function getDataLocationsOfChildren(
    schema: any,
    data: any,
    childOptions: ChildOptionItem[]
): string[] {
    const dataLocations: string[] = getLocationsFromObject(data);
    const schemaLocations: string[] = getLocationsFromObject(schema);
    // get all schema locations from schema
    const schemaReactChildrenLocations: string[] = getReactChildrenLocationsFromSchema(
        schema,
        schemaLocations
    );
    // get all schema locations from data locations
    const schemaLocationsFromDataLocations: string[] = dataLocations.map(
        (dataLocation: string): string => {
            return mapSchemaLocationFromDataLocation(dataLocation, data, schema);
        }
    );

    // get all child locations as schema locations
    const reactChildrenLocationsAsSchemaLocations: string[] = schemaReactChildrenLocations.filter(
        (schemaReactChildrenLocation: string) => {
            return !!schemaLocationsFromDataLocations.find(
                (schemaLocationsFromDataLocation: string): boolean => {
                    return (
                        schemaReactChildrenLocation === schemaLocationsFromDataLocation
                    );
                }
            );
        }
    );

    const dataLocationsOfChildren: string[] = [];

    // get all child locations as data locations
    dataLocations.forEach((dataLocation: string) => {
        if (
            !!reactChildrenLocationsAsSchemaLocations.find(
                (reactChildrenLocationsAsSchemaLocation: string) => {
                    return (
                        mapSchemaLocationFromDataLocation(dataLocation, data, schema) ===
                        reactChildrenLocationsAsSchemaLocation
                    );
                }
            ) &&
            !Array.isArray(get(data, dataLocation))
        ) {
            dataLocationsOfChildren.push(dataLocation);
        }
    });

    // for every child location get nested data locations of children
    dataLocationsOfChildren.forEach((dataLocationOfChildren: string) => {
        const dataLocation: string = `${dataLocationOfChildren}.${propsKeyword}`;
        const subData: any = get(data, dataLocation);
        const nestedDataLocationsOfChildren: string[] = getDataLocationsOfChildren(
            schema,
            subData,
            childOptions
        );

        nestedDataLocationsOfChildren.forEach((nestedDataLocationOfChildren: string) => {
            dataLocationsOfChildren.push(
                `${dataLocation}.${nestedDataLocationOfChildren}`
            );
        });
    });

    return dataLocationsOfChildren.map((dataLocationOfChildren: string) => {
        return arrayItemsToBracketNotation(dataLocationOfChildren, data);
    });
}

/**
 * Maps data returned from the form generator to the React components
 */
export function mapDataToComponent(
    schema: any,
    data: any,
    childOptions: ChildOptionItem[]
): any {
    const mappedData: any = cloneDeep(data);
    // find locations of all items of data that are react children
    const reactChildrenDataLocations: string[] = getDataLocationsOfChildren(
        schema,
        mappedData,
        childOptions
    );

    // organize by length using split "."
    reactChildrenDataLocations.sort(orderChildrenByDataLocation);

    // going from the longest length to shortest, resolve the data with the new child options as createElement
    reactChildrenDataLocations.forEach(
        (reactChildrenDataLocation: string, index: number) => {
            const subSchemaId: string = get(
                mappedData,
                `${reactChildrenDataLocation}.id`
            );
            const subData: any = get(mappedData, reactChildrenDataLocation);
            const isChildString: boolean = typeof subData === "string";
            const subDataNormalized: any = isChildString
                ? subData
                : get(subData, propsKeyword);
            const childOption: ChildOptionItem = getChildOptionBySchemaId(
                subSchemaId,
                childOptions
            );

            if (!isChildString) {
                let value: any;

                if (!childOption) {
                    value = Object.assign(
                        { id: subSchemaId },
                        React.createElement(
                            React.Fragment,
                            { key: `${subSchemaId}-${index}` },
                            subDataNormalized
                        )
                    );
                } else {
                    value = Object.assign(
                        { id: subSchemaId },
                        React.createElement(childOption.component, {
                            key: `${subSchemaId}-${index}`,
                            ...subDataNormalized,
                        })
                    );
                }

                set(mappedData, reactChildrenDataLocation, value);
            }
        }
    );

    return mappedData;
}

/**
 * Finds the child option using the schema id
 */
export function getChildOptionBySchemaId(
    id: string,
    childOptions: ChildOptionItem[]
): ChildOptionItem | undefined {
    return childOptions.find((childOption: ChildOptionItem) => {
        return childOption.schema.id === id;
    });
}

/**
 * Used as a sort compare function
 * see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
function orderChildrenByDataLocation(
    firstLocation: string,
    secondLocation: string
): number {
    const firstLocationLength: number = firstLocation.split(".").length;
    const secondLocationLength: number = secondLocation.split(".").length;

    if (firstLocationLength > secondLocationLength) {
        return -1;
    } else if (firstLocationLength < secondLocationLength) {
        return 1;
    }

    return 0;
}
