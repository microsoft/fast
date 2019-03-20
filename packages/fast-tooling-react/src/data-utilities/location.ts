import { get, isPlainObject } from "lodash-es";
import ajv from "ajv";
import {
    CombiningKeyword,
    DataResolverType,
    DataType,
    idKeyword,
    pluginIdKeyword,
    PluginLocation,
    PropertyKeyword,
    propsKeyword,
    typeKeyword,
} from "./types";
import { ChildOptionItem } from "./";

/**
 * This file contains all functionality for the manipulation of lodash paths
 */

const squareBracketsRegex: RegExp = /\[(\d+?)\]/g;

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
 * Finds the data locations of children
 */
export function getDataLocationsOfChildren(
    schema: any,
    data: any,
    childOptions: ChildOptionItem[]
): string[] {
    // get all schema locations from the schema
    const schemaLocations: string[] = getLocationsFromObject(schema);

    // get all data locations from the data
    const dataLocations: string[] = getLocationsFromObject(data);

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
        const childOption: ChildOptionItem = getChildOptionBySchemaId(
            get(data, `${dataLocationOfChildren}.${idKeyword}`),
            childOptions
        );
        const nestedDataLocationsOfChildren: string[] = getDataLocationsOfChildren(
            get(childOption, "schema", schema),
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
 * Finds the data locations of types mapped to plugins
 */
export function getDataLocationsOfPlugins(
    schema: any,
    data: any,
    childOptions: ChildOptionItem[],
    dataLocationPrefix: string = ""
): PluginLocation[] {
    let dataLocationsOfPlugins: PluginLocation[] = [];

    // get all data locations
    const dataLocations: string[] = getLocationsFromObject(data).concat([""]);

    // determine if the data location is mapped to a plugin
    dataLocations.forEach(
        (dataLocation: string): void => {
            const schemaLocation: string = mapSchemaLocationFromDataLocation(
                dataLocation,
                data,
                schema
            );
            const subSchema: any =
                schemaLocation === "" ? schema : get(schema, schemaLocation);
            const normalizedDataLocation: string = normalizeDataLocation(
                dataLocation,
                data
            );
            const dataLocationOfPlugin: string =
                dataLocationPrefix === ""
                    ? normalizedDataLocation
                    : `${dataLocationPrefix}.${propsKeyword}.${normalizedDataLocation}`;
            const isChildComponent: boolean =
                get(
                    schema,
                    `${
                        schemaLocation === ""
                            ? typeKeyword
                            : `${schemaLocation}.${typeKeyword}`
                    }`
                ) === DataType.children;
            const subData: any = get(data, `${dataLocation}.${propsKeyword}`);
            const isNotAnArrayOfChildren: boolean =
                (isChildComponent && typeof subData !== "undefined") || !isChildComponent;

            // check to see if the data location matches with the current schema and includes a plugin identifier
            if (
                typeof get(subSchema, pluginIdKeyword) === "string" &&
                dataLocationsOfPlugins.findIndex(
                    pluginFindIndexCallback(dataLocationOfPlugin)
                ) === -1 &&
                isNotAnArrayOfChildren
            ) {
                dataLocationsOfPlugins.push({
                    schema,
                    type: get(subSchema, typeKeyword),
                    mappingType: DataResolverType.plugin,
                    dataLocation: dataLocationOfPlugin,
                    relativeDataLocation: normalizedDataLocation,
                });
            }

            // check to see if this is a child
            if (isChildComponent) {
                // resolve the child id with a child option
                const childOption: ChildOptionItem = getChildOptionBySchemaId(
                    get(data, dataLocation).id,
                    childOptions
                );
                const updatedDataLocationPrefix: string =
                    dataLocationPrefix === ""
                        ? dataLocation
                        : `${dataLocationPrefix}.${propsKeyword}.${dataLocation}`;

                if (childOption !== undefined) {
                    dataLocationsOfPlugins = dataLocationsOfPlugins.concat(
                        getDataLocationsOfPlugins(
                            childOption.schema,
                            subData,
                            childOptions,
                            updatedDataLocationPrefix
                        )
                    );
                }
            }
        }
    );

    return dataLocationsOfPlugins;
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
                get(schema, schemaLocation).type === DataType.children
            );
        }
    );
}

/**
 * Finds the locations throughout an object
 */
export function getLocationsFromObject(data: any, location: string = ""): string[] {
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
 * Removes any references to array index
 */
function normalizeSchemaLocation(schemaLocation: string): string {
    return schemaLocation.replace(squareBracketsRegex, "");
}

/**
 * Get an array of schema location strings from a single data location item
 */
function getSchemaLocationSegmentsFromDataLocationSegment(
    dataLocation: string,
    schema: any,
    data: any
): string[] {
    let schemaLocationSegments: string[] = [];
    const normalizedDataLocationForArrayRemoval: string = dataLocation.replace(
        squareBracketsRegex,
        ""
    );
    const childrensSubSchema: any = get(
        schema,
        `${PropertyKeyword.reactProperties}.${normalizedDataLocationForArrayRemoval}`
    );
    const isChildren: boolean =
        childrensSubSchema && childrensSubSchema.type === DataType.children;
    const objectSubSchema: any = get(
        schema,
        `${PropertyKeyword.properties}.${normalizedDataLocationForArrayRemoval}`
    );

    if (isPlainObject(data)) {
        schemaLocationSegments.push(getObjectPropertyKeyword(childrensSubSchema));
    }

    schemaLocationSegments.push(
        isChildren ? normalizedDataLocationForArrayRemoval : dataLocation
    );

    // In the case that this is an array and not an array of children,
    // add the JSON schema "items" keyword
    if (isDataLocationArrayItem(dataLocation) && !isChildren) {
        if (hasOneOfOrAnyOf(objectSubSchema)) {
            schemaLocationSegments = schemaLocationSegments.concat(
                getSchemaOneOfAnyOfLocationSegments(
                    getPartialData(
                        normalizeSchemaLocation(schemaLocationSegments.join(".")),
                        schema
                    ),
                    getPartialData(dataLocation.replace(squareBracketsRegex, ""), data)
                )
            );
        }

        schemaLocationSegments.push("items");
    }

    if (hasOneOfOrAnyOf(objectSubSchema)) {
        schemaLocationSegments = schemaLocationSegments.concat(
            getSchemaOneOfAnyOfLocationSegments(
                getPartialData(
                    normalizeSchemaLocation(schemaLocationSegments.join(".")),
                    schema
                ),
                getPartialData(dataLocation, data)
            )
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
 * Determines if a schema has a oneOf or anyOf at root level
 */
function hasOneOfOrAnyOf(schema: any): boolean {
    return schema && (schema.oneOf || schema.anyOf);
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
 * Gets an array of oneOf/anyOf with a valid index from a schema and data
 */
function getSchemaOneOfAnyOfLocationSegments(schema: any, data: any): string[] {
    const schemaLocationSegments: string[] = [];

    if (typeof schema === "undefined") {
        return schemaLocationSegments;
    }

    if (!!schema[CombiningKeyword.anyOf]) {
        schemaLocationSegments.push(
            `${CombiningKeyword.anyOf}.${getValidAnyOfOneOfIndex(
                CombiningKeyword.anyOf,
                data,
                schema
            )}`
        );
    }

    if (!!schema[CombiningKeyword.oneOf]) {
        schemaLocationSegments.push(
            `${CombiningKeyword.oneOf}.${getValidAnyOfOneOfIndex(
                CombiningKeyword.oneOf,
                data,
                schema
            )}`
        );
    }

    return schemaLocationSegments;
}

/**
 * Gets the index from a JSON schemas oneOf/anyOf array that validates against the data
 */
function getValidAnyOfOneOfIndex(oneOfAnyOf: string, data: any, schema: any): number {
    const validation: ajv.Ajv = new ajv({ schemaId: "auto" });
    return schema[oneOfAnyOf].findIndex(
        (item: any): boolean | PromiseLike<any> => validation.validate(item, data)
    );
}

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
        if (Array.isArray(subData) && dataLocations[i + 1] !== undefined) {
            normalizedDataLocation.push(`${dataLocations[i]}[${dataLocations[i + 1]}]`);
            i++;
        } else {
            normalizedDataLocation.push(dataLocations[i]);
        }
    }

    return normalizedDataLocation.join(".");
}

/**
 * Callback to determine if a string is found within an array of plugin locations
 */
export function pluginFindIndexCallback(
    dataLocation: string
): (pluginLocation: PluginLocation) => boolean {
    return (pluginLocation: PluginLocation): boolean => {
        return dataLocation === pluginLocation.dataLocation;
    };
}
