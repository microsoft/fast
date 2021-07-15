import { parse } from "vscode-html-languageservice/lib/esm/parser/htmlParser";
import { uniqueId } from "lodash-es";
import { pascalCase } from "@microsoft/fast-web-utilities";
import { DataType } from "./types";
/**
 * This file is in it's own mapping file because sideEffects are true for the
 * vscode-html-languageservice package
 */
function mapAttributesAndSlotsToData(node, slotAttributes, schemaId, schemaDictionary) {
    return Object.entries(node.attributes)
        .map(([attributeKey, attributeValue]) => {
            if (schemaDictionary[schemaId].properties[attributeKey]) {
                if (
                    schemaDictionary[schemaId].properties[attributeKey].type ===
                    DataType.boolean
                ) {
                    // When the attribute is a boolean, it does not matter
                    // what it's value, it will always be true if present
                    return [attributeKey, true];
                }
                if (
                    schemaDictionary[schemaId].properties[attributeKey].type ===
                    DataType.number
                ) {
                    // Attributes are always strings, this must be converted
                    return [attributeKey, parseFloat(JSON.parse(attributeValue))];
                }
            }
            if (attributeKey !== "slot") {
                try {
                    const parsedValue = JSON.parse(attributeValue);
                    return [attributeKey, parsedValue === null ? true : parsedValue];
                } catch (e) {
                    return [attributeKey, ""];
                }
            }
        })
        .reduce((previousValue, currentValue) => {
            if (currentValue) {
                return Object.assign(Object.assign({}, previousValue), {
                    [currentValue[0]]: currentValue[1],
                });
            }
            return previousValue;
        }, slotAttributes);
}
function resolveDataDictionaryFromNode(
    linkedDataId,
    schemaId,
    node,
    slotAttributes,
    children,
    schemaDictionary
) {
    return [
        [
            Object.assign(
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
                },
                children.reduce((previousValue, currentValue) => {
                    return Object.assign(
                        Object.assign({}, previousValue),
                        currentValue[0][0]
                    );
                }, {})
            ),
            linkedDataId,
        ],
        node.attributes && typeof node.attributes.slot === "string"
            ? `Slot${pascalCase(node.attributes.slot)}`
            : "Slot",
    ];
}
function resolveDataDictionaryFromTextNode(linkedDataId, textSchemaId, value) {
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
function mapNodeToDataDictionary(node, value, textSchemaId, schemaDictionary, parentId) {
    const linkedDataId = uniqueId("fast");
    const schemaId = Object.keys(schemaDictionary).find(key => {
        if (
            schemaDictionary[key] &&
            node &&
            schemaDictionary[key].mapsToTagName === node.tag
        ) {
            return schemaDictionary[key].$id;
        }
        return false;
    });
    const isNode = node && typeof node.tag === "string";
    const hasParent = typeof parentId === "string";
    const hasContent = node && node.startTagEnd && node.endTagStart && node.closed;
    const children = [];
    const slotAttributes = {};
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
    const dataDictionaryAndSlotName = isNode
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
export function mapVSCodeParsedHTMLToDataDictionary(config) {
    // Remove newlines and consolidate the array value to a single string
    const value = config.value.join("").replace(/\n/g, "");
    // Identify the JSON schema referring to text/strings
    const textSchema = Object.entries(config.schemaDictionary).find(([key]) => {
        return config.schemaDictionary[key].type === "string";
    });
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
function checkIsIncompleteElement(parsedValue) {
    return parsedValue.closed === false && typeof parsedValue.tag !== "string";
}
function consolidateHTMLElementsWithTextNodes(value, parsedValue) {
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
            const isIncompleteElement = checkIsIncompleteElement(parsedValue.children[i]);
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
function identifyElementsFromParsedValue(value, parsedValue) {
    return parsedValue.map(parsedValueItem => {
        const children = consolidateHTMLElementsWithTextNodes(value, parsedValueItem);
        return {
            tag: parsedValueItem.tag,
            attributes: parsedValueItem.attributes
                ? Object.entries(parsedValueItem.attributes).map(([name, value]) => {
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
                  })
                : [],
            children: identifyElementsFromParsedValue(value, children),
            content: parsedValueItem.content,
        };
    });
}
function mapElementAttributes(element) {
    return element.attributes.reduce((prevValue, currentValue) => {
        return Object.assign(Object.assign({}, prevValue), {
            [currentValue.name]: currentValue.value,
        });
    }, {});
}
function resolveDataDictionaryFromElement(
    linkedDataId,
    schemaId,
    node,
    parent,
    slotAttributes,
    schemaDictionary
) {
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
                              slotAttributes,
                              schemaId,
                              schemaDictionary
                          ),
            },
        },
        linkedDataId,
    ];
}
function findSchemaId(node, textSchemaId, schemaDictionary) {
    return node.tag === null
        ? textSchemaId
        : Object.keys(schemaDictionary).find(key => {
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
function mapElementToDataDictionary(node, textSchemaId, schemaDictionary, parent) {
    const linkedDataId = uniqueId("fast");
    const schemaId = findSchemaId(node, textSchemaId, schemaDictionary);
    return resolveDataDictionaryFromElement(
        linkedDataId,
        schemaId,
        node,
        parent,
        {},
        schemaDictionary
    );
}
function mapElementChildren(
    element,
    textSchemaId,
    schemaDictionary,
    currentDictionaryId,
    previousDataDictionary
) {
    const elementChildren = {};
    const previouslyMatchedChildren = [];
    let dataDictionaryChildItems = {};
    element.children.forEach(child => {
        const slotAttribute = child.attributes.find(attribute => {
            return attribute.name === "slot";
        });
        const slotName = slotAttribute === undefined ? "" : slotAttribute.value;
        const schemaSlotName = `Slot${pascalCase(slotName)}`;
        // Find current dictionary item slots
        if (
            Array.isArray(
                previousDataDictionary[0][currentDictionaryId].data[schemaSlotName]
            )
        ) {
            const matchingChild = previousDataDictionary[0][currentDictionaryId].data[
                schemaSlotName
            ].find(item => {
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
                dataDictionaryChildItems = Object.assign(
                    Object.assign({}, dataDictionaryChildItems),
                    mappedDataDictionaryChildItem[0]
                );
            } else {
                // children are present but do not match
                const newNode = mapElementToDataDictionary(
                    child,
                    textSchemaId,
                    schemaDictionary,
                    {
                        id: currentDictionaryId,
                        dataLocation: schemaSlotName,
                    }
                );
                elementChildren[schemaSlotName].push({
                    id: newNode[1],
                });
                dataDictionaryChildItems[newNode[1]] = newNode[0][newNode[1]];
            }
        } else {
            const newNode = mapElementToDataDictionary(
                child,
                textSchemaId,
                schemaDictionary,
                {
                    id: currentDictionaryId,
                    dataLocation: schemaSlotName,
                }
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
            dataDictionaryChildItems[newNode[1]] = newNode[0][newNode[1]];
        }
    });
    return [elementChildren, dataDictionaryChildItems];
}
/**
 * Map data updates coming from the monaco editor
 * which will take precendence over data stored in the data dictionary
 */
function mapUpdatesFromMonacoEditor(
    element,
    textSchemaId,
    dataDictionaryId,
    previousDataDictionary,
    schemaDictionary
) {
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
        Object.assign(
            {
                [dataDictionaryId]: Object.assign(
                    Object.assign({}, previousDataDictionary[0][dataDictionaryId]),
                    {
                        schemaId,
                        data: isTextNode
                            ? element.content
                            : Object.assign(
                                  Object.assign({}, mapElementAttributes(element)),
                                  children[0]
                              ),
                    }
                ),
            },
            children[1]
        ),
        dataDictionaryId,
    ];
}
/**
 * Map data updates coming from the monaco editor and consolidate
 * them with the current data dictionary stored in the Message System
 */
export function mapVSCodeHTMLAndDataDictionaryToDataDictionary(
    value,
    textSchemaId,
    previousDataDictionary,
    schemaDictionary
) {
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
        undefined
    );
}
