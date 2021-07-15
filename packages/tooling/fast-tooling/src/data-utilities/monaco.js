/**
 * These utilities are meant to facilitate the use of
 * the monaco editor https://github.com/Microsoft/monaco-editor
 * with FAST tooling
 */
import { get } from "lodash-es";
import { ReservedElementMappingKeyword } from "./types";
import { voidElements } from "./html-element";
const whiteSpace = " ";
const newline = "\n";
const doubleQuote = '"';
function getLinkedDataDataLocations(dictionaryId, dataDictionary) {
    const allDataLocations = Object.entries(dataDictionary[0])
        .filter(([, dictionaryItem]) => {
            return get(dictionaryItem, "parent.id") === dictionaryId;
        })
        .map(dictionaryItem => {
            return dictionaryItem[0];
        });
    return allDataLocations.filter((dataLocation, index) => {
        return allDataLocations.indexOf(dataLocation) === index;
    });
}
function mapDataDictionaryItemToMonacoEditorHTMLLine(
    dictionaryId,
    data,
    dataDictionary,
    schema,
    schemaDictionary,
    lines = []
) {
    if (schema) {
        if (schema.type === "string") {
            lines.push(data.data);
        } else if (
            typeof schema[ReservedElementMappingKeyword.mapsToTagName] === "string"
        ) {
            const attributes = Object.entries(data.data)
                .filter(([, dataValue]) => {
                    return (
                        typeof dataValue !== "object" &&
                        !Array.isArray(dataValue) &&
                        dataValue !== false
                    );
                })
                .map(value => {
                    return typeof value[1] === "string"
                        ? `${value[0]}${"=" /* assign */}${doubleQuote}${
                              value[1]
                          }${doubleQuote}`
                        : typeof value[1] === "boolean"
                        ? value[0]
                        : `${value[0]}${"=" /* assign */}${doubleQuote}${JSON.stringify(
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
                    `slot${"=" /* assign */}${doubleQuote}${
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
                    `${"<" /* startTagOpen */}${
                        schema[ReservedElementMappingKeyword.mapsToTagName]
                    }${attributes.length > 0 ? whiteSpace : ""}${attributes.join(
                        whiteSpace
                    )}${whiteSpace}${"/>" /* startTagSelfClose */}`
                );
            } else {
                const linkedDataDataLocations = getLinkedDataDataLocations(
                    dictionaryId,
                    dataDictionary
                );
                let content = [];
                if (linkedDataDataLocations.length > 0) {
                    content = linkedDataDataLocations.map(linkedDataDataLocation => {
                        return mapDataDictionaryItemToMonacoEditorHTMLLine(
                            linkedDataDataLocation,
                            dataDictionary[0][linkedDataDataLocation],
                            dataDictionary,
                            schemaDictionary[
                                dataDictionary[0][linkedDataDataLocation].schemaId
                            ],
                            schemaDictionary
                        ).join(newline);
                    });
                }
                lines.push(
                    `${"<" /* startTagOpen */}${
                        schema[ReservedElementMappingKeyword.mapsToTagName]
                    }${attributes.length > 0 ? whiteSpace : ""}${attributes.join(
                        whiteSpace
                    )}${">" /* startTagClose */}${content.join("")}${
                        "</" /* endTagOpen */
                    }${schema[ReservedElementMappingKeyword.mapsToTagName]}${
                        ">" /* endTagClose */
                    }`
                );
            }
        }
    }
    return lines;
}
export function mapDataDictionaryToMonacoEditorHTML(dataDictionary, schemaDictionary) {
    return mapDataDictionaryItemToMonacoEditorHTMLLine(
        dataDictionary[1],
        dataDictionary[0][dataDictionary[1]],
        dataDictionary,
        schemaDictionary[dataDictionary[0][dataDictionary[1]].schemaId],
        schemaDictionary
    ).join(newline);
}
