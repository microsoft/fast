/**
 * These utilities are meant to facilitate the use of
 * the monaco editor https://github.com/Microsoft/monaco-editor
 * with FAST tooling
 */

import { get } from "lodash-es";
import { Data, DataDictionary, SchemaDictionary } from "../message-system";
import { ReservedElementMappingKeyword } from "./types";
import { Delimiter, voidElements } from "./html-element";

const whiteSpace = " ";
const newline = "\n";
const doubleQuote = '"';

function getLinkedDataDataLocations(
    dictionaryId: string,
    dataDictionary: DataDictionary<unknown>
): string[] {
    // get all linked data data locations for a dictionary id
    const allLinkedDataDictionaryIds = Object.entries(dataDictionary[0])
        .filter(([, dictionaryItem]: [string, Data<any>]) => {
            return get(dictionaryItem, "parent.id") === dictionaryId;
        })
        .map((dictionaryItem: [string, Data<any>]) => {
            return dictionaryItem[0];
        });

    // identify and group all items by slot name
    // e.g. { Slot: ["id1", "id2", "id3"], SlotFoo: ["id5", "id4"] }
    const dictionaryOfLinkedDataIdsBySlotName: { [key: string]: string[] } = {};

    for (let i = 0, length = allLinkedDataDictionaryIds.length; i < length; i++) {
        const linkedDataSlotName =
            dataDictionary[0][allLinkedDataDictionaryIds[i]].parent.dataLocation;
        const slottedIndex = dataDictionary[0][dictionaryId].data[linkedDataSlotName]
            .map(item => {
                return item.id;
            })
            .indexOf(allLinkedDataDictionaryIds[i]);

        if (!dictionaryOfLinkedDataIdsBySlotName[linkedDataSlotName]) {
            dictionaryOfLinkedDataIdsBySlotName[linkedDataSlotName] = [];
        }

        dictionaryOfLinkedDataIdsBySlotName[linkedDataSlotName][slottedIndex] =
            allLinkedDataDictionaryIds[i];
    }

    // flatten the object structure with string arrays into a single string array
    return Object.values(dictionaryOfLinkedDataIdsBySlotName).reduce((prev, curr) => {
        return prev.concat(curr);
    }, []);
}

function mapDataDictionaryItemToMonacoEditorHTMLLine(
    dictionaryId: string,
    data: Data<any>,
    dataDictionary: DataDictionary<unknown>,
    schema: any,
    schemaDictionary: SchemaDictionary,
    lines: string[] = []
): string[] {
    if (schema) {
        if (schema.type === "string") {
            lines.push(data.data);
        } else if (
            typeof schema[ReservedElementMappingKeyword.mapsToTagName] === "string"
        ) {
            const attributes: string[] = Object.entries(data.data)
                .filter(([, dataValue]: [string, any]) => {
                    return (
                        typeof dataValue !== "object" &&
                        !Array.isArray(dataValue) &&
                        dataValue !== false
                    );
                })
                .map((value: [string, any]) => {
                    return typeof value[1] === "string"
                        ? `${value[0]}${Delimiter.assign}${doubleQuote}${value[1]}${doubleQuote}`
                        : typeof value[1] === "boolean"
                        ? value[0]
                        : `${value[0]}${Delimiter.assign}${doubleQuote}${JSON.stringify(
                              value[1]
                          )}${doubleQuote}`;
                });

            if (
                dataDictionary[0][dictionaryId].parent &&
                schemaDictionary[
                    dataDictionary[0][dataDictionary[0][dictionaryId].parent.id].schemaId
                ].properties &&
                schemaDictionary[
                    dataDictionary[0][dataDictionary[0][dictionaryId].parent.id].schemaId
                ].properties[dataDictionary[0][dictionaryId].parent.dataLocation][
                    ReservedElementMappingKeyword.mapsToSlot
                ] !== ""
            ) {
                attributes.push(
                    `slot${Delimiter.assign}${doubleQuote}${
                        schemaDictionary[
                            dataDictionary[0][dataDictionary[0][dictionaryId].parent.id]
                                .schemaId
                        ].properties[dataDictionary[0][dictionaryId].parent.dataLocation][
                            ReservedElementMappingKeyword.mapsToSlot
                        ]
                    }${doubleQuote}`
                );
            }

            if (
                voidElements.includes(schema[ReservedElementMappingKeyword.mapsToTagName])
            ) {
                lines.push(
                    `${Delimiter.startTagOpen}${
                        schema[ReservedElementMappingKeyword.mapsToTagName]
                    }${attributes.length > 0 ? whiteSpace : ""}${attributes.join(
                        whiteSpace
                    )}${whiteSpace}${Delimiter.startTagSelfClose}`
                );
            } else {
                const linkedDataDataLocations = getLinkedDataDataLocations(
                    dictionaryId,
                    dataDictionary
                );
                let content: string[] = [];
                if (linkedDataDataLocations.length > 0) {
                    content = linkedDataDataLocations.map(
                        (linkedDataDataLocation: string) => {
                            return mapDataDictionaryItemToMonacoEditorHTMLLine(
                                linkedDataDataLocation,
                                dataDictionary[0][linkedDataDataLocation],
                                dataDictionary,
                                schemaDictionary[
                                    dataDictionary[0][linkedDataDataLocation].schemaId
                                ],
                                schemaDictionary
                            ).join(newline);
                        }
                    );
                }

                lines.push(
                    `${Delimiter.startTagOpen}${
                        schema[ReservedElementMappingKeyword.mapsToTagName]
                    }${attributes.length > 0 ? whiteSpace : ""}${attributes.join(
                        whiteSpace
                    )}${Delimiter.startTagClose}${content.join("")}${
                        Delimiter.endTagOpen
                    }${schema[ReservedElementMappingKeyword.mapsToTagName]}${
                        Delimiter.endTagClose
                    }`
                );
            }
        }
    }

    return lines;
}

export function mapDataDictionaryToMonacoEditorHTML(
    dataDictionary: DataDictionary<unknown>,
    schemaDictionary: SchemaDictionary
): string {
    return mapDataDictionaryItemToMonacoEditorHTMLLine(
        dataDictionary[1],
        dataDictionary[0][dataDictionary[1]],
        dataDictionary,
        schemaDictionary[dataDictionary[0][dataDictionary[1]].schemaId],
        schemaDictionary
    ).join(newline);
}
