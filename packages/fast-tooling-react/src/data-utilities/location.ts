import { get, isPlainObject } from "lodash-es";
import {
    CombiningKeyword,
    DataResolverType,
    DataType,
    idKeyword,
    itemsKeyword,
    pluginIdKeyword,
    PluginLocation,
    PropertyKeyword,
    propsKeyword,
    typeKeyword,
} from "./types";
import { ChildOptionItem } from "./";
import { oneOfAnyOfType } from "./schema";
import { isPrimitiveReactNode } from "./node-types";
import { validateData } from "../utilities/ajv-validation";

/**
 * This file contains all functionality for the manipulation of lodash paths
 */

export const squareBracketsRegex: RegExp = /\[(\d+)\]/g;
export const firstCharacterDotRegex: RegExp = /^(\.)/;

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
    const schemaLocationInstance: SchemaLocation = new SchemaLocation(schema);

    // get all data locations from the data
    const dataLocations: string[] = getLocationsFromObject(data);

    // get all react children locations from schema
    const schemaReactChildrenLocations: string[] = schemaLocationInstance.getChildrenLocations();

    // get all schema locations from data locations
    let schemaLocationsFromDataLocations: string[] = [];

    if (schemaReactChildrenLocations.length > 0) {
        schemaLocationsFromDataLocations = dataLocations.map((dataLocation: string) => {
            return mapSchemaLocationFromDataLocation(dataLocation, schema, data);
        });
    }

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
    const addedDataLocations: string[] = [];

    // get all child locations as data locations
    dataLocations.forEach((dataLocation: string) => {
        const dataFromDataLocation: string = get(data, dataLocation);

        if (
            !!reactChildrenLocationsAsSchemaLocations.find(
                (reactChildrenLocationsAsSchemaLocation: string): boolean => {
                    return (
                        mapSchemaLocationFromDataLocation(dataLocation, schema, data) ===
                        reactChildrenLocationsAsSchemaLocation
                    );
                }
            ) &&
            typeof addedDataLocations.find((addedDataLocation: string) => {
                return addedDataLocation === dataLocation;
            }) === "undefined" &&
            !Array.isArray(dataFromDataLocation)
        ) {
            addedDataLocations.push(dataLocation);

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
        return normalizeDataLocation(dataLocationOfChildren, data, schema);
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
                schema,
                data
            );
            const subSchema: any =
                schemaLocation === "" ? schema : get(schema, schemaLocation);
            const normalizedDataLocation: string = normalizeDataLocation(
                dataLocation,
                data,
                schema
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
            const childrenProps: any = get(
                data,
                `${normalizedDataLocation}.${propsKeyword}`
            );
            const isNotAnArrayOfChildren: boolean =
                (isChildComponent &&
                    (typeof childrenProps !== "undefined" ||
                        isPrimitiveReactNode(get(data, normalizedDataLocation)))) ||
                !isChildComponent;

            // check to see if the data location matches with the current schema and includes a plugin identifier
            if (
                typeof get(subSchema, pluginIdKeyword) === "string" &&
                dataLocationsOfPlugins.findIndex(
                    pluginFindIndexCallback(dataLocationOfPlugin)
                ) === -1
            ) {
                if (isNotAnArrayOfChildren) {
                    dataLocationsOfPlugins.push({
                        schema,
                        type: get(subSchema, typeKeyword),
                        mappingType: DataResolverType.plugin,
                        dataLocation: dataLocationOfPlugin,
                        relativeDataLocation: normalizedDataLocation,
                    });
                } else {
                    const subData: any = get(data, normalizedDataLocation);

                    if (Array.isArray(subData)) {
                        const childrenLength: number = subData.length;

                        for (let i: number = 0; i < childrenLength; i++) {
                            dataLocationsOfPlugins.push({
                                schema,
                                type: get(subSchema, typeKeyword),
                                mappingType: DataResolverType.plugin,
                                dataLocation: `${dataLocationOfPlugin}[${i}]`,
                                relativeDataLocation: `${normalizedDataLocation}[${i}]`,
                            });
                        }
                    }
                }
            }

            // check to see if this is a child
            if (isChildComponent) {
                // resolve the child id with a child option
                const childOption: ChildOptionItem = getChildOptionBySchemaId(
                    get(data, normalizedDataLocation).id,
                    childOptions
                );
                const updatedDataLocationPrefix: string =
                    dataLocationPrefix === ""
                        ? normalizedDataLocation
                        : `${dataLocationPrefix}.${propsKeyword}.${normalizedDataLocation}`;

                if (childOption !== undefined) {
                    dataLocationsOfPlugins = dataLocationsOfPlugins.concat(
                        getDataLocationsOfPlugins(
                            childOption.schema,
                            childrenProps,
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
    schema: any,
    data?: any
): string {
    if (dataLocation === "") {
        return "";
    }

    const schemaLocations: string[] = [];
    const dataLocationAsDotNotation: string = dataLocation.replace(
        squareBracketsRegex,
        ".$1"
    );
    const dataLocationSegments: string[] = dataLocationAsDotNotation.split(".");
    const dataLocationSegmentsLength: number = dataLocationSegments.length;

    for (let i: number = 0; i < dataLocationSegmentsLength; i++) {
        const currentSchemaLocation: string = schemaLocations.join(".");
        const currentDataLocation: string = dataLocationSegments.slice(0, i).join(".");
        const currentSchema: any = i === 0 ? schema : get(schema, currentSchemaLocation);
        const currentData: any = i === 0 ? data : get(data, currentDataLocation);

        if (
            typeof currentSchema === "undefined" ||
            (typeof get(
                schema,
                schemaLocations.slice(0, schemaLocations.length - 1).join(".")
            ) !== "undefined" &&
                !Number.isNaN(parseInt(schemaLocations[schemaLocations.length], 10)))
        ) {
            break;
        }

        const schemaLocation:
            | string
            | void = mapSchemaLocationSegmentFromDataLocationSegment(
            currentSchema,
            dataLocationSegments[i],
            "",
            currentData
        );

        if (typeof schemaLocation === "string") {
            schemaLocations.push(schemaLocation);
        }
    }

    return schemaLocations.join(".");
}

/**
 * Determines from a single dataLocation segment
 * what the resulting schemaLocation should be
 */
function mapSchemaLocationSegmentFromDataLocationSegment(
    schema: any,
    dataLocationSegment: string,
    schemaLocation: string,
    data: any
): string | void {
    const modifier: string = schemaLocation === "" ? "" : ".";
    const propertyLocationModifier: string = dataLocationSegment === "" ? "" : ".";
    const additionalProperty: boolean = isAdditionalProperty(dataLocationSegment, schema);

    if (schema.oneOf) {
        const index: number = getValidAnyOfOneOfIndex(oneOfAnyOfType.oneOf, data, schema);

        return mapSchemaLocationSegmentFromDataLocationSegment(
            schema.oneOf[index],
            dataLocationSegment,
            `${schemaLocation}${modifier}${oneOfAnyOfType.oneOf}[${index}]`,
            data
        );
    } else if (schema.anyOf) {
        const index: number = getValidAnyOfOneOfIndex(oneOfAnyOfType.anyOf, data, schema);

        return mapSchemaLocationSegmentFromDataLocationSegment(
            schema.anyOf[index],
            dataLocationSegment,
            `${schemaLocation}${modifier}${oneOfAnyOfType.anyOf}[${index}]`,
            data
        );
    } else if (additionalProperty && get(schema, PropertyKeyword.additionalProperties)) {
        return `${schemaLocation}${modifier}${PropertyKeyword.additionalProperties}`;
    } else if (get(schema, `${PropertyKeyword.properties}.${dataLocationSegment}`)) {
        return `${schemaLocation}${modifier}${
            PropertyKeyword.properties
        }${propertyLocationModifier}${dataLocationSegment}`;
    } else if (get(schema, `${PropertyKeyword.reactProperties}.${dataLocationSegment}`)) {
        return `${schemaLocation}${modifier}${
            PropertyKeyword.reactProperties
        }${propertyLocationModifier}${dataLocationSegment}`;
    } else if (schema.items) {
        return `${schemaLocation}${modifier}items`;
    } else if (
        get(schema, `${schemaLocation}${modifier}${typeKeyword}`) === DataType.children &&
        !isNaN(parseInt(dataLocationSegment, 10))
    ) {
        return void 0;
    }

    return `${schemaLocation}${modifier}${dataLocationSegment}`;
}

function isAdditionalProperty(dataLocationSegment: string, schema: any): boolean {
    const enumeratedKeys: string[] = Object.keys(
        get(schema, PropertyKeyword.properties, {})
    ).concat(Object.keys(get(schema, PropertyKeyword.reactProperties, {})));

    return !enumeratedKeys.includes(dataLocationSegment);
}

class SchemaLocation {
    private childrenLocations: string[];
    private schemaLocations: string[];

    constructor(schema: any) {
        this.childrenLocations = [];
        this.schemaLocations = this.getSchemaLocationsFromSchema(schema);
    }

    public getChildrenLocations(): string[] {
        return this.childrenLocations;
    }

    public getSchemaLocations(): string[] {
        return this.schemaLocations;
    }

    /**
     * Gets the schema locations from an object
     */
    private getObjectSchemaLocations(
        schema: any,
        locations: string[],
        locationSegments: string[]
    ): string[] {
        let objectSchemaLocations: string[] = [];

        Object.keys(schema).forEach((propertyKey: string) => {
            objectSchemaLocations = objectSchemaLocations.concat(
                this.getSchemaLocationsFromSchemaItem(
                    get(schema, propertyKey),
                    locations.concat(locationSegments.concat(propertyKey).join(".")),
                    locationSegments.concat(propertyKey)
                )
            );
        });

        return objectSchemaLocations;
    }

    private getSchemaLocationsFromSchema(schema: any): string[] {
        return [...new Set([""].concat(this.getSchemaLocationsFromSchemaItem(schema)))];
    }

    /**
     * Finds the schema locations throughout a schema
     */
    private getSchemaLocationsFromSchemaItem(
        schema: any,
        locations: string[] = [],
        locationSegments: string[] = []
    ): string[] {
        const type: DataType = get(schema, typeKeyword, DataType.object);
        const combiningKeyword: CombiningKeyword | void = get(
            schema,
            CombiningKeyword.oneOf
        )
            ? CombiningKeyword.oneOf
            : get(schema, CombiningKeyword.anyOf)
                ? CombiningKeyword.anyOf
                : void 0;

        if (typeof combiningKeyword !== "undefined") {
            return this.getSchemaLocationsFromSchemaItem(
                get(schema, combiningKeyword),
                locations.concat(locationSegments.concat(combiningKeyword).join(".")),
                locationSegments.concat(combiningKeyword)
            );
        }

        switch (type) {
            case DataType.string:
            case DataType.null:
            case DataType.number:
            case DataType.boolean:
                return locations;
            case DataType.children:
                this.childrenLocations.push(locationSegments.join("."));
                return locations;
            case DataType.array:
                return this.getSchemaLocationsFromSchemaItem(
                    get(schema, itemsKeyword),
                    locations.concat(locationSegments.concat(itemsKeyword).join(".")),
                    locationSegments.concat(itemsKeyword)
                );
            default:
                let objectSchemaLocations: string[] = [];

                if (get(schema, PropertyKeyword.properties)) {
                    objectSchemaLocations = objectSchemaLocations.concat(
                        this.getObjectSchemaLocations(
                            get(schema, PropertyKeyword.properties),
                            locations.concat(
                                locationSegments
                                    .concat(PropertyKeyword.properties)
                                    .join(".")
                            ),
                            locationSegments.concat(PropertyKeyword.properties)
                        )
                    );
                }

                if (get(schema, PropertyKeyword.reactProperties)) {
                    objectSchemaLocations = objectSchemaLocations.concat(
                        this.getObjectSchemaLocations(
                            get(schema, PropertyKeyword.reactProperties),
                            locations.concat(
                                locationSegments
                                    .concat(PropertyKeyword.reactProperties)
                                    .join(".")
                            ),
                            locationSegments.concat(PropertyKeyword.reactProperties)
                        )
                    );
                }

                return objectSchemaLocations;
        }
    }
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

    for (
        let i: number = 0,
            dataLocationSegmentsLength: number = dataLocationSegments.length;
        i < dataLocationSegmentsLength;
        i++
    ) {
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
            `${CombiningKeyword.anyOf}[${getValidAnyOfOneOfIndex(
                CombiningKeyword.anyOf,
                data,
                schema
            )}]`
        );
    }

    if (!!schema[CombiningKeyword.oneOf]) {
        schemaLocationSegments.push(
            `${CombiningKeyword.oneOf}[${getValidAnyOfOneOfIndex(
                CombiningKeyword.oneOf,
                data,
                schema
            )}]`
        );
    }

    return schemaLocationSegments;
}

/**
 * Gets the index from a JSON schemas oneOf/anyOf array that validates against the data
 */
function getValidAnyOfOneOfIndex(oneOfAnyOf: string, data: any, schema: any): number {
    const index: number = schema[oneOfAnyOf].findIndex(
        (item: any): boolean | PromiseLike<any> => validateData(item, data)
    );

    return index === -1 ? 0 : index;
}

/**
 * Gets data from a data and location
 */
export function getPartialData(location: string, data: any): any {
    return location === "" ? data : get(data, location);
}

/**
 * Converts all property locations to dot notation
 */
export function normalizeDataLocationToDotNotation(dataLocation: string): string {
    return dataLocation
        .replace(squareBracketsRegex, `.$1`)
        .replace(firstCharacterDotRegex, "");
}

/**
 * Converts all property locations to dot notation and all array item references to bracket notation
 */
export function normalizeDataLocation(
    dataLocation: string,
    data: any,
    schema: any
): string {
    return arrayItemsToBracketNotation(
        normalizeDataLocationToDotNotation(dataLocation),
        data,
        schema
    );
}

function containsBrackets(dataLocation: string): boolean {
    return dataLocation.match(squareBracketsRegex) !== null;
}

/**
 * Converts a data location strings array items into bracket notation
 */
function arrayItemsToBracketNotation(
    dataLocation: string,
    data: any,
    schema: any
): string {
    const normalizedDataLocation: string[] = [];
    const dataLocations: string[] = [""].concat(dataLocation.split("."));
    const isSchemaDefined: boolean = !!schema;

    for (
        let i: number = 0, dataLocationsLength: number = dataLocations.length;
        i < dataLocationsLength;
        i++
    ) {
        const isRoot: boolean = i === 0;
        const currentDataLocation: string = dataLocations
            .slice(0, i + 1)
            .join(".")
            .replace(firstCharacterDotRegex, "");
        const subData: any = isRoot ? data : get(data, currentDataLocation);
        let subSchemaType: any = "object";

        if (isSchemaDefined) {
            subSchemaType = isRoot
                ? get(schema, typeKeyword)
                : get(
                      schema,
                      `${mapSchemaLocationFromDataLocation(
                          currentDataLocation,
                          schema,
                          data
                      )}.${typeKeyword}`
                  );
        }

        // if the data is an array
        if (
            dataLocations[i + 1] !== void 0 &&
            ((isSchemaDefined &&
                (subSchemaType === "array" ||
                    (subSchemaType === "children" &&
                        !isNaN(parseInt(dataLocations[i + 1], 10))))) ||
                Array.isArray(subData))
        ) {
            normalizedDataLocation.push(`${dataLocations[i]}[${dataLocations[i + 1]}]`);
            i++; // skip over the next item since we are adding it now
        } else {
            normalizedDataLocation.push(dataLocations[i]);
        }
    }

    return normalizedDataLocation.join(".").replace(firstCharacterDotRegex, "");
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
