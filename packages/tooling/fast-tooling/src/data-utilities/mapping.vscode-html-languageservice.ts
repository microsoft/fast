import { Node, parse } from "vscode-html-languageservice/lib/esm/parser/htmlParser";
import { uniqueId } from "lodash-es";
import { pascalCase } from "@microsoft/fast-web-utilities";
import {
    Data,
    DataDictionary,
    LinkedData,
    Parent,
    SchemaDictionary,
} from "../message-system";
import { DataType } from "./types";
import { XOR } from "./type.utilities";

export interface MapNodeToDataDictionaryConfig {
    /**
     * The Monaco editor models value
     */
    value: string[];

    /**
     * The schema dictionary to extrapolate HTML elements
     * and text elements from
     */
    schemaDictionary: SchemaDictionary;
}

/**
 * This file is in it's own mapping file because sideEffects are true for the
 * vscode-html-languageservice package
 */

function parseElementAttributeValue(schema, attribute): [string, any] {
    if (schema && schema.properties && schema.properties[attribute.name]) {
        if (schema.properties[attribute.name].type === DataType.boolean) {
            // When the attribute is a boolean, it does not matter
            // what it's value, it will always be true if present
            return [attribute.name, true];
        }

        if (schema.properties[attribute.name].type === DataType.number) {
            // Attributes are always strings, this must be converted
            return [attribute.name, parseFloat(JSON.parse(attribute.value))];
        }

        if (schema.properties[attribute.name].type === DataType.string) {
            let parsedValue;

            // Attributes which may appear as a JSON type other than
            // a string must be converted
            try {
                parsedValue = JSON.parse(attribute.value);

                if (typeof parsedValue !== "string") {
                    parsedValue = `${parsedValue}`;
                }
            } catch (e) {
                parsedValue = attribute.value;
            }

            return [attribute.name, parsedValue];
        }
    }

    if (attribute.name !== "slot") {
        try {
            const parsedValue = JSON.parse(attribute.value);

            return [attribute.name, parsedValue === null ? true : parsedValue];
        } catch (e) {
            return [attribute.name, attribute.value];
        }
    }
}

function mapAttributesAndSlotsToData(
    node: Node,
    slotAttributes: { [key: string]: LinkedData[] },
    schemaId: string,
    schemaDictionary: SchemaDictionary
): { [key: string]: any } {
    const attributes = Array.isArray(node.attributes)
        ? node.attributes.map(attribute => {
              return {
                  [attribute.name]: attribute.value,
              };
          })
        : Object.entries(node.attributes).map(
              ([attributeKey, attributeValue]: [string, string]) => {
                  return {
                      [attributeKey]: attributeValue,
                  };
              }
          );

    return attributes
        .map((attribute: { [key: string]: string }) => {
            const name = Object.keys(attribute)[0];
            const parsedAttributeValue = parseElementAttributeValue(
                schemaDictionary[schemaId],
                {
                    name,
                    value: attribute[name],
                }
            );

            if (parsedAttributeValue !== void 0) {
                return parsedAttributeValue;
            }
        })
        .reduce((previousValue, currentValue) => {
            if (currentValue) {
                return {
                    ...previousValue,
                    [currentValue[0]]: currentValue[1],
                };
            }

            return previousValue;
        }, slotAttributes);
}

function resolveDataDictionaryFromNode(
    linkedDataId: string,
    schemaId: string,
    node: Node,
    slotAttributes: { [key: string]: LinkedData[] },
    children: [DataDictionary<unknown>, string][],
    schemaDictionary: SchemaDictionary
): [DataDictionary<unknown>, string] {
    return [
        [
            {
                [linkedDataId]: {
                    schemaId,
                    data: node.attributes
                        ? mapAttributesAndSlotsToData(
                              node,
                              slotAttributes,
                              schemaId,
                              schemaDictionary
                          )
                        : slotAttributes,
                },
                ...children.reduce((previousValue, currentValue) => {
                    return {
                        ...previousValue,
                        ...currentValue[0][0],
                    };
                }, {}),
            },
            linkedDataId,
        ],
        node.attributes && typeof node.attributes.slot === "string"
            ? `Slot${pascalCase(node.attributes.slot)}`
            : "Slot",
    ];
}

function resolveDataDictionaryFromTextNode(
    linkedDataId,
    textSchemaId,
    value
): [DataDictionary<unknown>, string] {
    return [
        [
            {
                [linkedDataId]: {
                    schemaId: textSchemaId,
                    data: value,
                },
            },
            linkedDataId,
        ],
        "Slot",
    ];
}

function mapNodeToDataDictionary(
    node: Node,
    value: string,
    textSchemaId: string,
    schemaDictionary: SchemaDictionary,
    parentId?: string
): [DataDictionary<unknown>, string] {
    const linkedDataId = uniqueId("fast");
    const schemaId: string = Object.keys(schemaDictionary).find((key: string) => {
        if (
            schemaDictionary[key] &&
            node &&
            schemaDictionary[key].mapsToTagName === node.tag
        ) {
            return schemaDictionary[key].$id;
        }

        return false;
    });
    const isNode: boolean = node && typeof node.tag === "string";
    const hasParent: boolean = typeof parentId === "string";
    const hasContent: boolean =
        node && node.startTagEnd && node.endTagStart && node.closed;
    const children: [DataDictionary<unknown>, string][] = [];
    const slotAttributes: { [key: string]: LinkedData[] } = {};

    if (isNode) {
        const nodeChildrenLength = node.children.length;

        if (hasContent) {
            if (nodeChildrenLength > 0) {
                // add any text nodes before the first child
                if (node.children[0].start !== node.startTagEnd) {
                    children.push(
                        mapNodeToDataDictionary(
                            void 0,
                            value.slice(node.startTagEnd, node.children[0].start),
                            textSchemaId,
                            schemaDictionary,
                            linkedDataId
                        )
                    );
                }

                for (let i = 0; i < nodeChildrenLength; i++) {
                    children.push(
                        mapNodeToDataDictionary(
                            parse(
                                value.slice(node.children[i].start, node.children[i].end)
                            ).roots[0],
                            value.slice(node.children[i].start, node.children[i].end),
                            textSchemaId,
                            schemaDictionary,
                            linkedDataId
                        )
                    );

                    if (
                        node.children[i + 1] &&
                        node.children[i].end !== node.children[i + 1].start
                    ) {
                        children.push(
                            mapNodeToDataDictionary(
                                void 0,
                                value.slice(
                                    node.children[i].end,
                                    node.children[i + 1].start
                                ),
                                textSchemaId,
                                schemaDictionary,
                                linkedDataId
                            )
                        );
                    }
                }

                // add any text nodes after the last child
                if (node.children[nodeChildrenLength - 1].end !== node.endTagStart) {
                    children.push(
                        mapNodeToDataDictionary(
                            void 0,
                            value.slice(
                                node.children[nodeChildrenLength - 1].end,
                                node.endTagStart
                            ),
                            textSchemaId,
                            schemaDictionary,
                            linkedDataId
                        )
                    );
                }
            } else if (node.startTagEnd !== node.endTagStart) {
                // add all content between the start and end tag
                // as text nodes
                children.push(
                    mapNodeToDataDictionary(
                        void 0,
                        value.slice(node.startTagEnd, node.endTagStart),
                        textSchemaId,
                        schemaDictionary,
                        linkedDataId
                    )
                );
            }
        }

        children.forEach(child => {
            if (!Array.isArray(slotAttributes[child[1]])) {
                slotAttributes[child[1]] = [
                    {
                        id: child[0][1],
                    },
                ];
            } else {
                slotAttributes[child[1]].push({
                    id: child[0][1],
                });
            }
        });
    }

    const dataDictionaryAndSlotName: [DataDictionary<unknown>, string] = isNode
        ? resolveDataDictionaryFromNode(
              linkedDataId,
              schemaId,
              node,
              slotAttributes,
              children,
              schemaDictionary
          )
        : resolveDataDictionaryFromTextNode(linkedDataId, textSchemaId, value);

    if (hasParent) {
        dataDictionaryAndSlotName[0][0][dataDictionaryAndSlotName[0][1]].parent = {
            id: parentId,
            dataLocation: dataDictionaryAndSlotName[1],
        };
    }

    return dataDictionaryAndSlotName;
}

/**
 * Convert the parsed value to a data dictionary
 */
export function mapVSCodeParsedHTMLToDataDictionary(
    config: MapNodeToDataDictionaryConfig
): DataDictionary<unknown> {
    // Remove newlines and consolidate the array value to a single string
    const value: string = config.value.join("").replace(/\n/g, "");
    // Identify the JSON schema referring to text/strings
    const textSchema: [string, any] = Object.entries(config.schemaDictionary).find(
        ([key]: [string, any]) => {
            return config.schemaDictionary[key].type === "string";
        }
    );
    let textSchemaId;

    if (textSchema) {
        textSchemaId = textSchema[1].$id;
    }

    return mapNodeToDataDictionary(
        parse(value).roots[0],
        value,
        textSchemaId,
        config.schemaDictionary
    )[0];
}

export interface Attribute {
    name: string;
    value: any;
}

export interface ParsedValue {
    children: ParsedValue[];
    tag: string;
    attributes: { [key: string]: string };
    start: number;
    end: number;
    startTagEnd: number;
    endTagStart?: number;
    content?: string;
    closed: boolean;
}

function checkIsIncompleteElement(parsedValue: ParsedValue): boolean {
    return parsedValue.closed === false && typeof parsedValue.tag !== "string";
}

function consolidateHTMLElementsWithTextNodes(
    value: string,
    parsedValue: ParsedValue
): Node[] {
    const consolidatedNodes = [];

    if (!parsedValue.children) {
        return consolidatedNodes;
    }

    const nodeChildrenLength = parsedValue.children.length;

    // Check for text nodes when there are no HTML element children
    if (
        nodeChildrenLength === 0 &&
        parsedValue.endTagStart &&
        parsedValue.startTagEnd !== parsedValue.endTagStart
    ) {
        consolidatedNodes.push({
            tag: null,
            content: value.slice(parsedValue.startTagEnd, parsedValue.endTagStart),
        });
    } else if (nodeChildrenLength > 0) {
        // Check for text nodes before children
        if (parsedValue.children[0].start !== parsedValue.startTagEnd) {
            consolidatedNodes.push({
                tag: null,
                content: value.slice(
                    parsedValue.startTagEnd,
                    parsedValue.children[0].start
                ),
            });
        }

        // Check for text nodes in the middle
        for (let i = 0; i < nodeChildrenLength; i++) {
            // Replace any incomplete elements with text nodes
            const isIncompleteElement: boolean = checkIsIncompleteElement(
                parsedValue.children[i]
            );

            if (isIncompleteElement) {
                consolidatedNodes.push({
                    tag: null,
                    content: "<",
                });
            } else {
                consolidatedNodes.push(parsedValue.children[i]);
            }

            if (
                parsedValue.children[i + 1] &&
                parsedValue.children[i].end !== parsedValue.children[i + 1].start
            ) {
                consolidatedNodes.push({
                    tag: null,
                    content: value.slice(
                        parsedValue.children[i].end,
                        parsedValue.children[i + 1].start
                    ),
                });
            }
        }

        // Check for text nodes after children
        if (
            parsedValue.endTagStart &&
            parsedValue.children[nodeChildrenLength - 1].end !== parsedValue.endTagStart
        ) {
            consolidatedNodes.push({
                tag: null,
                content: value.slice(
                    parsedValue.children[nodeChildrenLength - 1].end,
                    parsedValue.endTagStart
                ),
            });
        }
    }

    return consolidatedNodes;
}

/**
 * Takes the parsed value from the VSCode HTML language service
 * and transforms it into an array with an array of elements as the first
 * index and any
 */
function identifyElementsFromParsedValue(
    value: string,
    parsedValue: ParsedValue[]
): Node[] {
    return parsedValue.map(parsedValueItem => {
        const children = consolidateHTMLElementsWithTextNodes(value, parsedValueItem);

        return {
            tag: parsedValueItem.tag,
            attributes: parsedValueItem.attributes
                ? Object.entries(parsedValueItem.attributes).map(
                      ([name, value]: [string, string]) => {
                          try {
                              return {
                                  name,
                                  value: JSON.parse(value),
                              };
                          } catch (e) {
                              return {
                                  name,
                                  value: "",
                              };
                          }
                      }
                  )
                : [],
            children: identifyElementsFromParsedValue(value, children),
            content: parsedValueItem.content,
        };
    });
}

function mapElementAttributes(element: Node, schema): { [key: string]: any } {
    return element.attributes.reduce((prevValue, currentValue) => {
        const parsedAttribute = parseElementAttributeValue(schema, currentValue);

        return {
            ...prevValue,
            [currentValue.name]: parsedAttribute
                ? parsedAttribute[1]
                : currentValue.value,
        };
    }, {});
}

function resolveDataDictionaryFromElement(
    linkedDataId: string,
    schemaId: string,
    node: Node,
    parent: Parent,
    slotAttributes: { [key: string]: LinkedData[] },
    children: ElementChildren,
    schemaDictionary: SchemaDictionary
): DataDictionary<unknown> {
    return [
        {
            [linkedDataId]: {
                schemaId,
                parent,
                data:
                    typeof node.content === "string"
                        ? node.content
                        : mapAttributesAndSlotsToData(
                              node,
                              {
                                  ...slotAttributes,
                                  ...children[0],
                              },
                              schemaId,
                              schemaDictionary
                          ),
            },
            ...children[1],
        },
        linkedDataId,
    ];
}

function findSchemaId(
    node: Node,
    textSchemaId: string,
    schemaDictionary: SchemaDictionary
): string {
    return node.tag === null
        ? textSchemaId
        : Object.keys(schemaDictionary).find((key: string) => {
              if (
                  schemaDictionary[key] &&
                  node &&
                  schemaDictionary[key].mapsToTagName === node.tag
              ) {
                  return schemaDictionary[key].$id;
              }

              return false;
          }) || "div";
}

function getUniqueId(linkedDataIds: string[]): string {
    const id: string = uniqueId("fast");

    if (linkedDataIds.includes(id)) {
        return getUniqueId(linkedDataIds);
    }

    return id;
}

function mapElementToDataDictionary(
    node: Node,
    textSchemaId: string,
    schemaDictionary: SchemaDictionary,
    parent: Parent,
    linkedDataIds: string[],
    previousDataDictionary: DataDictionary<unknown>
): DataDictionary<unknown> {
    const linkedDataId = getUniqueId(linkedDataIds);
    const schemaId: string = findSchemaId(node, textSchemaId, schemaDictionary);
    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
    const linkedData = mapElementChildren(
        node,
        textSchemaId,
        schemaDictionary,
        linkedDataId,
        previousDataDictionary
    );

    return resolveDataDictionaryFromElement(
        linkedDataId,
        schemaId,
        node,
        parent,
        {},
        linkedData,
        schemaDictionary
    );
}

interface ElementChildren {
    /**
     * A list of linked data that represents element children
     */
    0: { [key: string]: LinkedData[] };

    /**
     * The new data dictionary keys
     */
    1: { [key: string]: Data<unknown> };
}

function mapElementChildren(
    element: Node,
    textSchemaId: string,
    schemaDictionary: SchemaDictionary,
    currentDictionaryId: string,
    previousDataDictionary: DataDictionary<unknown>
): ElementChildren {
    const elementChildren: { [key: string]: LinkedData[] } = {};
    const previouslyMatchedChildren: string[] = [];
    let dataDictionaryChildItems: { [key: string]: Data<unknown> } = {};

    (element.children || []).forEach(child => {
        const slotAttribute: Attribute | undefined = child.attributes.find(
            (attribute: Attribute) => {
                return attribute.name === "slot";
            }
        );

        const slotName = slotAttribute === undefined ? "" : slotAttribute.value;
        const schemaSlotName = `Slot${pascalCase(slotName)}`;

        // Find current dictionary item slots
        if (
            Array.isArray(
                previousDataDictionary[0][currentDictionaryId]?.data?.[schemaSlotName]
            )
        ) {
            const matchingChild: LinkedData = previousDataDictionary[0][
                currentDictionaryId
            ].data[schemaSlotName].find((item: LinkedData) => {
                return (
                    !previouslyMatchedChildren.find(
                        previouslyMatchedChild => previouslyMatchedChild === item.id
                    ) &&
                    (schemaDictionary[previousDataDictionary[0][item.id].schemaId]
                        .mapsToTagName === child.tag ||
                        (schemaDictionary[previousDataDictionary[0][item.id].schemaId]
                            .$id === textSchemaId &&
                            typeof child.content === "string"))
                );
            });

            if (!Array.isArray(elementChildren[schemaSlotName])) {
                elementChildren[schemaSlotName] = [];
            }

            if (matchingChild) {
                previouslyMatchedChildren.push(matchingChild.id); // ensure there are no duplicates
                elementChildren[schemaSlotName].push(matchingChild);

                /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                const mappedDataDictionaryChildItem = mapUpdatesFromMonacoEditor(
                    child,
                    textSchemaId,
                    matchingChild.id,
                    previousDataDictionary,
                    schemaDictionary
                );

                dataDictionaryChildItems = {
                    ...dataDictionaryChildItems,
                    ...mappedDataDictionaryChildItem[0],
                };
            } else {
                // children are present but do not match
                const newNode = mapElementToDataDictionary(
                    child,
                    textSchemaId,
                    schemaDictionary,
                    {
                        id: currentDictionaryId,
                        dataLocation: schemaSlotName,
                    },
                    Object.keys(previousDataDictionary[0]),
                    previousDataDictionary
                );

                elementChildren[schemaSlotName].push({
                    id: newNode[1],
                });

                dataDictionaryChildItems = {
                    ...dataDictionaryChildItems,
                    ...newNode[0],
                };
            }
        } else {
            const newNode = mapElementToDataDictionary(
                child,
                textSchemaId,
                schemaDictionary,
                {
                    id: currentDictionaryId,
                    dataLocation: schemaSlotName,
                },
                Object.keys(previousDataDictionary[0]),
                previousDataDictionary
            );

            if (Array.isArray(elementChildren[schemaSlotName])) {
                elementChildren[schemaSlotName].push({
                    id: newNode[1],
                });
            } else {
                elementChildren[schemaSlotName] = [
                    {
                        id: newNode[1],
                    },
                ];
            }

            dataDictionaryChildItems = {
                ...dataDictionaryChildItems,
                ...newNode[0],
            };
        }
    });

    return [elementChildren, dataDictionaryChildItems];
}

/**
 * Map data updates coming from the monaco editor
 * which will take precendence over data stored in the data dictionary
 */
function mapUpdatesFromMonacoEditor(
    element: Node,
    textSchemaId: string,
    dataDictionaryId: string,
    previousDataDictionary: DataDictionary<unknown>,
    schemaDictionary: SchemaDictionary
): DataDictionary<unknown> {
    const schemaId = findSchemaId(element, textSchemaId, schemaDictionary);
    const isTextNode = schemaId === textSchemaId;
    const children = mapElementChildren(
        element,
        textSchemaId,
        schemaDictionary,
        dataDictionaryId,
        previousDataDictionary
    );

    return [
        {
            [dataDictionaryId]: {
                ...previousDataDictionary[0][dataDictionaryId],
                schemaId,
                data: isTextNode
                    ? element.content
                    : {
                          ...mapElementAttributes(element, schemaDictionary[schemaId]),
                          ...children[0],
                      },
            },
            ...children[1],
        },
        dataDictionaryId,
    ];
}

/**
 * Map data updates coming from the monaco editor and consolidate
 * them with the current data dictionary stored in the Message System
 */
export function mapVSCodeHTMLAndDataDictionaryToDataDictionary(
    value: string,
    textSchemaId: string,
    previousDataDictionary: DataDictionary<unknown>,
    schemaDictionary: SchemaDictionary
): XOR<DataDictionary<unknown>, null> {
    const parsedValue = parse(value);
    const elements = identifyElementsFromParsedValue(value, parsedValue.roots);

    if (parsedValue.roots && elements[0]) {
        return mapUpdatesFromMonacoEditor(
            elements[0],
            textSchemaId,
            previousDataDictionary[1],
            previousDataDictionary,
            schemaDictionary
        );
    }

    return mapElementToDataDictionary(
        {
            tag: null,
            content: value,
        },
        textSchemaId,
        schemaDictionary,
        undefined,
        Object.keys(previousDataDictionary[0]),
        previousDataDictionary
    );
}
