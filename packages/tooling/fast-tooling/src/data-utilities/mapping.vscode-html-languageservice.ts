import { Node, parse } from "vscode-html-languageservice/lib/esm/parser/htmlParser";
import { uniqueId } from "lodash-es";
import { pascalCase } from "@microsoft/fast-web-utilities";
import { DataDictionary, LinkedData, SchemaDictionary } from "../message-system";
import { DataType } from "./types";

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

function mapAttributesAndSlotsToData(
    node: Node,
    slotAttributes: { [key: string]: LinkedData[] },
    schemaId: string,
    schemaDictionary: SchemaDictionary
) {
    console.log(
        "\n***mapAttributesAndSlotsToDa",
        node,
        " slotAttributes:",
        slotAttributes,
        " schemaId:",
        schemaId,
        " schemaDictionary:",
        schemaDictionary
    );
    if (schemaId !== null && schemaId !== undefined) {
        return Object.entries(node.attributes)
            .map(([attributeKey, attributeValue]: [string, string]) => {
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

                try {
                    const parsedValue = JSON.parse(attributeValue);

                    return [attributeKey, parsedValue === null ? true : parsedValue];
                } catch (e) {
                    return [attributeKey, ""];
                }
            })
            .reduce((previousValue, currentValue) => {
                return {
                    ...previousValue,
                    [currentValue[0]]: currentValue[1],
                };
            }, slotAttributes);
    } else {
        console.log(
            "schemaId was null so the reduce won't work for this item node:",
            node,
            " schemaDictionary:",
            schemaDictionary
        );
    }
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

    if (schemaId === null || schemaId === undefined) {
        console.log("schemaId was:", schemaId, " value:", value, " node:", node);
    }
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
        if (textSchemaId === null || textSchemaId === undefined) {
            console.log(
                "textSchemaId is null in mapVSCodeParsedHTMLToDataDictionary config:",
                config
            );
        }
    }

    return mapNodeToDataDictionary(
        parse(value).roots[0],
        value,
        textSchemaId,
        config.schemaDictionary
    )[0];
}
