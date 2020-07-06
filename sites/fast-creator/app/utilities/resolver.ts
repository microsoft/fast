import {
    DataType,
    ElementDictionary,
    MapperConfig,
    PropertyKeyword,
    ReservedElementMappingKeyword,
} from "@microsoft/fast-tooling";
import { get } from "lodash-es";

export const dataSetDictionaryId = "data-creator-wrapper-dictionary-id";
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

/**
 * This wrapper is similar to the htmlMapper found in @microsoft/fast-tooling
 * however it also sets a dataset attribute to allow the current
 * active component to be highlighted
 */
export function htmlMapper(
    elementDictionary: ElementDictionary
): (config: MapperConfig<string>) => void {
    return (config: MapperConfig<string>): void => {
        const data = config.dataDictionary[0][config.dictionaryId].data;

        if (typeof data === "string") {
            const wrapper = document.createElement("span");
            wrapper.setAttribute(dataSetDictionaryId, config.dictionaryId);
            wrapper.appendChild(document.createTextNode(data));
            config.dataDictionary[0][config.dictionaryId].data = wrapper;
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

                newElement.setAttribute(dataSetDictionaryId, config.dictionaryId);

                config.dataDictionary[0][config.dictionaryId].data = newElement;
            }
        }
    };
}
