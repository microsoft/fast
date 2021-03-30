import { camelCase, cloneDeep, get } from "lodash-es";
import { Data, DataDictionary, LinkedData, SchemaDictionary } from "../message-system";
import { linkedDataSchema } from "../schemas";
import {
    DataType,
    ElementDictionary,
    PropertyKeyword,
    ReservedElementMappingKeyword,
} from "./types";
import {
    WebComponentAttribute,
    WebComponentDefinition,
    WebComponentSlot,
} from "./web-component";

export const dataSetName: string = "data-fast-tooling-name";

export interface MapperConfig<T> {
    /**
     * Data that maps to the JSON schema
     */
    dataDictionary: DataDictionary<any>;

    /**
     * The ID of the current dictionary item
     */
    dictionaryId: string;

    /**
     * JSON schema
     */
    schema: any;

    /**
     * The plugins used to map data
     */
    mapperPlugins: MapDataPlugin[];
}

export interface MapDataPlugin {
    /**
     * The ids that map to the pluginIdKeyword in the JSON schema
     */
    ids: string[];

    /**
     * The mapping function that returns the mapped values
     */
    mapper: (data: any) => any;

    /**
     * The resolving function that overrides the resolver
     */
    resolver: (data: any) => any;
}

export interface MapDataConfig<T> {
    /**
     * Data that maps to the JSON schema
     */
    dataDictionary: DataDictionary<any>;

    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The mapper that will update the data in the dictionary
     */
    mapper: (config: MapperConfig<T>) => T;

    /**
     * The resolver that resolves the data dictionary into another structure
     */
    resolver: (config: ResolverConfig<T>) => T;

    /**
     * The plugins used to map data
     */
    plugins?: MapDataPlugin[];
}

interface AttachResolvedDataDictionaryConfig<T> {
    /**
     * The data resolved to a specified type
     */
    resolvedData: T;

    /**
     * Data that maps to the JSON schema
     */
    dataDictionary: DataDictionary<any>;

    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The data items in the reversed order from children to parent
     */
    items: string[];

    /**
     * The resolver that resolves the data dictionary into another structure
     */
    resolver: (config: ResolverConfig<T>) => T;

    /**
     * The plugins used to resolve data
     */
    resolverPlugins: MapDataPlugin[];
}

interface ResolveDataInDataDictionaryConfig<T> {
    /**
     * The dictionary of data
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * The dictionary of data key
     */
    dictionaryId: string;

    /**
     * The array of resolved IDs
     */
    resolvedDictionaryIds: string[];

    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The mapping function
     */
    mapper: (config: MapperConfig<T>) => T;

    /**
     * The plugins used to map data
     */
    mapperPlugins: MapDataPlugin[];
}

export interface ResolverConfig<T> {
    /**
     * The data resolved to a specified type
     */
    resolvedData: T;

    /**
     * The dictionary of data
     */
    dataDictionary: DataDictionary<any>;

    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The ID of the item in the dictionary
     */
    dictionaryId: string;

    /**
     * The parent of the dictionary item
     */
    parent: string | null;

    /**
     * The plugins used to resolve data
     */
    resolverPlugins: MapDataPlugin[];
}

const nameSpacedURIs = {
    svg: "http://www.w3.org/2000/svg",
};
const nameSpacedTags = {
    animate: nameSpacedURIs.svg,
    svg: nameSpacedURIs.svg,
    path: nameSpacedURIs.svg,
    defs: nameSpacedURIs.svg,
    ellipse: nameSpacedURIs.svg,
    circle: nameSpacedURIs.svg,
    line: nameSpacedURIs.svg,
    polygon: nameSpacedURIs.svg,
    polyline: nameSpacedURIs.svg,
    rect: nameSpacedURIs.svg,
    g: nameSpacedURIs.svg,
};

export function resolveDataInDataDictionary<T>(
    config: ResolveDataInDataDictionaryConfig<T>
): void {
    config.resolvedDictionaryIds.push(config.dictionaryId);

    // find all linked data for this piece of data
    let linkedDataIds: string[] = [];

    Object.entries(config.dataDictionary[0]).map(
        ([key]: [string, Data<unknown>]): void => {
            if (
                config.dataDictionary[0][key].parent &&
                config.dataDictionary[0][key].parent.id === config.dictionaryId &&
                !linkedDataIds.includes(key)
            ) {
                linkedDataIds = linkedDataIds.concat(
                    (config.dataDictionary[0][config.dataDictionary[0][key].parent.id]
                        .data as object)[
                        config.dataDictionary[0][key].parent.dataLocation
                    ].map((slotItem: LinkedData): string => {
                        return slotItem.id;
                    })
                );
            }
        }
    );

    config.mapper({
        dictionaryId: config.dictionaryId,
        dataDictionary: config.dataDictionary,
        schema:
            config.schemaDictionary[
                config.dataDictionary[0][config.dictionaryId].schemaId
            ],
        mapperPlugins: config.mapperPlugins,
    });

    // call the resolver on all children
    linkedDataIds.map((key: string): void => {
        resolveDataInDataDictionary({
            dataDictionary: config.dataDictionary,
            dictionaryId: key,
            resolvedDictionaryIds: config.resolvedDictionaryIds,
            schemaDictionary: config.schemaDictionary,
            mapper: config.mapper,
            mapperPlugins: config.mapperPlugins,
        });
    });
}

function attachResolvedDataDictionary<T>(
    config: AttachResolvedDataDictionaryConfig<T>
): T {
    for (let i = 0, itemsLength = config.items.length; i < itemsLength; i++) {
        config.resolvedData = config.resolver({
            resolvedData: config.resolvedData,
            dataDictionary: config.dataDictionary,
            schemaDictionary: config.schemaDictionary,
            dictionaryId: config.items[i],
            parent: config.dataDictionary[0][config.items[i]].parent
                ? config.dataDictionary[0][config.items[i]].parent.id
                : null,
            resolverPlugins: config.resolverPlugins,
        });
    }

    return config.resolvedData;
}

export function mapDataDictionary<T>(config: MapDataConfig<T>): T {
    // clone the data given, this will be mutated
    const clonedData = cloneDeep(config.dataDictionary);
    // The items as they are resolved
    const resolvedDictionaryIds: string[] = [];

    // map the dictionary items to the cloned data
    // store the dictionary items as a list in order
    resolveDataInDataDictionary({
        dataDictionary: clonedData,
        resolvedDictionaryIds,
        dictionaryId: clonedData[1],
        schemaDictionary: config.schemaDictionary,
        mapper: config.mapper,
        mapperPlugins: config.plugins || [],
    });

    // resolve the data dictionary items up the tree
    return attachResolvedDataDictionary({
        resolvedData: undefined,
        dataDictionary: clonedData,
        schemaDictionary: config.schemaDictionary,
        items: resolvedDictionaryIds.reverse(),
        resolver: config.resolver,
        resolverPlugins: config.plugins || [],
    });
}

/**
 * This is the HTML mapper to be used with mapDataDictionary
 * which will map items in the data dictionary to HTMLElement or Text
 */
export function htmlMapper(
    elementDictionary: ElementDictionary
): (config: MapperConfig<string>) => void {
    return (config: MapperConfig<string>): void => {
        const data = config.dataDictionary[0][config.dictionaryId].data;

        if (typeof data === "string") {
            config.dataDictionary[0][config.dictionaryId].data = document.createTextNode(
                data
            );
        } else if (
            config.schema.type === DataType.object &&
            config.schema[ReservedElementMappingKeyword.mapsToTagName] &&
            Array.isArray(elementDictionary.tags)
        ) {
            const elementDefinition = elementDictionary.tags.find(
                elementItemByTagName => {
                    return (
                        elementItemByTagName.name ===
                        config.schema[ReservedElementMappingKeyword.mapsToTagName]
                    );
                }
            );

            if (elementDefinition !== undefined) {
                // Due to SVGs being namespaced they must use the createElementNS method instead of createElement
                const isNameSpaced = Object.keys(nameSpacedTags).includes(
                    elementDefinition.name
                );
                const uri = nameSpacedTags[elementDefinition.name];
                const newElement = isNameSpaced
                    ? document.createElementNS(uri, elementDefinition.name)
                    : document.createElement(elementDefinition.name);
                // a list of available slots for this element
                const availableElementSlots = elementDefinition.slots.map(elementSlot => {
                    return elementSlot.name;
                });
                // a list of attributes for this element
                const elementAttributes = Object.keys(data).filter(potentialAttribute => {
                    // remove slots from the attributes list
                    return !availableElementSlots.includes(
                        get(
                            config.schema,
                            `${PropertyKeyword.properties}[${potentialAttribute}][${ReservedElementMappingKeyword.mapsToSlot}]`
                        )
                    );
                });
                elementAttributes.forEach(elementAttribute => {
                    if (typeof data[elementAttribute] === DataType.boolean) {
                        if (data[elementAttribute]) {
                            newElement.setAttribute(elementAttribute, "");
                        } else {
                            newElement.removeAttribute(elementAttribute);
                        }
                    } else {
                        newElement.setAttribute(elementAttribute, data[elementAttribute]);
                    }
                });

                config.dataDictionary[0][config.dictionaryId].data = newElement;
            }
        }
    };
}

/**
 * The resolver for an HTML data dictionary
 */
export function htmlResolver(config: ResolverConfig<any>): HTMLElement | Text {
    if (config.dataDictionary[1] !== config.dictionaryId) {
        config.dataDictionary[0][
            config.dataDictionary[0][config.dictionaryId].parent.id
        ].data.prepend(config.dataDictionary[0][config.dictionaryId].data);

        const slotName: boolean = get(
            config.schemaDictionary,
            `[${
                config.dataDictionary[0][
                    config.dataDictionary[0][config.dictionaryId].parent.id
                ].schemaId
            }][${PropertyKeyword.properties}][${
                config.dataDictionary[0][config.dictionaryId].parent.dataLocation
            }][${ReservedElementMappingKeyword.mapsToSlot}]`
        );

        if (
            typeof slotName === "string" &&
            slotName !== "" &&
            !(config.dataDictionary[0][config.dictionaryId].data instanceof Text)
        ) {
            config.dataDictionary[0][config.dictionaryId].data.setAttribute(
                "slot",
                slotName
            );
        }
    }
    return config.dataDictionary[0][config.dictionaryId].data;
}

function mapAttributesToJSONSchema(
    attributes: WebComponentAttribute[]
): { [key: string]: any } {
    return attributes.reduce(
        (accumulation: { [key: string]: any }, attribute: WebComponentAttribute) => {
            const optionalAttributeProperties: {
                enum?: Array<string | number>;
                default?: any;
            } = {};

            if (attribute.values) {
                optionalAttributeProperties.enum = attribute.values.map(
                    attributeValue => {
                        return attribute.type === DataType.number
                            ? parseInt(attributeValue.name as string, 10)
                            : attributeValue.name;
                    }
                );
            }

            if (attribute.default) {
                optionalAttributeProperties.default = attribute.default;
            }

            return {
                ...accumulation,
                [attribute.name]: {
                    ...optionalAttributeProperties,
                    title: attribute.title,
                    description: attribute.description,
                    [ReservedElementMappingKeyword.mapsToAttribute]: attribute.name,
                    type: attribute.type,
                },
            };
        },
        {}
    );
}

function mapSlotsToJSONSchema(slots: WebComponentSlot[]): { [key: string]: any } {
    return slots.reduce(
        (accumulation: { [key: string]: any }, slot: WebComponentSlot) => {
            const slotName =
                slot.name === ""
                    ? ""
                    : slot.name[1]
                    ? `${slot.name[0].toUpperCase()}${camelCase(slot.name.substring(1))}`
                    : slot.name[0].toUpperCase();
            return {
                ...accumulation,
                [`Slot${slotName}`]: {
                    title: slot.title,
                    description: slot.description,
                    [ReservedElementMappingKeyword.mapsToSlot]: slot.name,
                    ...linkedDataSchema,
                },
            };
        },
        {}
    );
}

/**
 * The converter for a web component definition
 * to a web component JSON schema
 */
export function mapWebComponentDefinitionToJSONSchema(
    webComponentDefinition: WebComponentDefinition
): { [key: string]: any }[] {
    const schemas: { [key: string]: any }[] = [];

    if (Array.isArray(webComponentDefinition.tags)) {
        for (
            let i = 0, tagLength = webComponentDefinition.tags.length;
            i < tagLength;
            i++
        ) {
            schemas.push({
                $schema: "http://json-schema.org/schema#",
                $id: webComponentDefinition.tags[i].name,
                id: webComponentDefinition.tags[i].name,
                title: `${webComponentDefinition.tags[i].title}`,
                description: `${webComponentDefinition.tags[i].description}`,
                type: "object",
                version: webComponentDefinition.version,
                [ReservedElementMappingKeyword.mapsToTagName]:
                    webComponentDefinition.tags[i].name,
                properties: {
                    ...mapAttributesToJSONSchema(
                        webComponentDefinition.tags[i].attributes
                    ),
                    ...mapSlotsToJSONSchema(webComponentDefinition.tags[i].slots),
                },
            });
        }
    }

    return schemas;
}
