import { get, set } from "lodash-es";
import { Data, SchemaDictionary } from "../message-system";
import {
    DataType,
    ElementDictionary,
    PropertyKeyword,
    ReservedElementMappingKeyword,
} from "./types";

export interface MapperConfig<T> {
    /**
     * Data that maps to the JSON schema
     */
    data: any;

    /**
     * The data that has been previously
     * resolved from the mapper
     */
    resolvedData: T;

    /**
     * JSON schema
     */
    schema: any;
}

interface MapDataDictionaryConfig<T> {
    /**
     * The dictionary of data
     */
    dataDictionary: { [key: string]: Data<unknown> };

    /**
     * The dictionary of data key
     */
    dataDictionaryKey: string;

    /**
     * The dictionary of JSON schema that maps
     * to data in the dictionary of data
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The mapping function
     */
    mapper: (config: MapperConfig<T>) => T;
}

/**
 * Maps the data in a dictionary to a mapping function
 * should result in a data tree
 */
export function mapDataDictionary<T>(config: MapDataDictionaryConfig<T>): T {
    const resolvedData: any = config.dataDictionary[config.dataDictionaryKey].data;
    Object.entries(config.dataDictionary).map(
        ([key, value]: [string, Data<unknown>]): void => {
            if (value.parent && value.parent.id === config.dataDictionaryKey) {
                set(
                    resolvedData,
                    value.parent.dataLocation,
                    mapDataDictionary({
                        dataDictionary: config.dataDictionary,
                        dataDictionaryKey: key,
                        schemaDictionary: config.schemaDictionary,
                        mapper: config.mapper,
                    })
                );
            }
        }
    );

    return config.mapper({
        data: config.dataDictionary[config.dataDictionaryKey].data,
        resolvedData,
        schema:
            config.schemaDictionary[
                config.dataDictionary[config.dataDictionaryKey].schemaId
            ],
    });
}

/**
 * This is the HTML mapper to be used with mapDataDictionary
 * which will return HTML elements
 */
export function htmlMapper(
    elementDictionary: ElementDictionary
): (config: MapperConfig<any>) => HTMLElement | string {
    return (config: MapperConfig<string>): HTMLElement | string => {
        let mappedData: HTMLElement | string;

        if (typeof config.resolvedData === "string") {
            mappedData = config.resolvedData;
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
                const newElement = document.createElement(elementDefinition.name);
                // a list of available slots for this element
                const availableElementSlots = elementDefinition.slots.map(elementSlot => {
                    return elementSlot.name;
                });
                // a list of current slots used for this element
                const elementSlots = Object.keys(config.resolvedData).filter(
                    potentialAttribute => {
                        // remove slots from the attributes list
                        return availableElementSlots.includes(
                            get(
                                config.schema,
                                // This makes an assumption that the schema will not be wrapped with any special
                                // keywords such as oneOf or anyOf
                                `${PropertyKeyword.properties}[${potentialAttribute}][${
                                    ReservedElementMappingKeyword.mapsToSlot
                                }]`
                            )
                        );
                    }
                );
                // a list of attributes for this element
                const elementAttributes = Object.keys(config.resolvedData).filter(
                    potentialAttribute => {
                        // remove slots from the attributes list
                        return !availableElementSlots.includes(
                            get(
                                config.schema,
                                `${PropertyKeyword.properties}[${potentialAttribute}][${
                                    ReservedElementMappingKeyword.mapsToSlot
                                }]`
                            )
                        );
                    }
                );
                elementAttributes.forEach(elementAttribute => {
                    newElement.setAttribute(
                        elementAttribute,
                        config.resolvedData[elementAttribute]
                    );
                });
                elementSlots.forEach(elementSlot => {
                    const slotName = get(
                        config.schema,
                        // This makes an assumption that the schema will not be wrapped with any special
                        // keywords such as oneOf or anyOf
                        `${PropertyKeyword.properties}[${elementSlot}][${
                            ReservedElementMappingKeyword.mapsToSlot
                        }]`
                    );
                    if (
                        slotName !== "" &&
                        typeof config.resolvedData[elementSlot] !== "string"
                    ) {
                        config.resolvedData[elementSlot].setAttribute("slot", slotName);
                    }

                    newElement.append(config.resolvedData[elementSlot]);
                });

                mappedData = newElement;
            }
        }

        return mappedData;
    };
}
