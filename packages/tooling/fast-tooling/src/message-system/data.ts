import { uniqueId } from "lodash-es";
import {
    Data,
    LinkedDataDictionaryConfig,
    LinkedDataDictionaryUpdate,
    ResolveDataDictionary,
} from "./data.props";

function resolveDataDictionary(
    parentId: string,
    parentDataLocation: string,
    dataSet: Data<unknown>[],
    itemDictionary: { [key: string]: string[] }
): ResolveDataDictionary {
    const currentIds: string[] = [];

    return {
        dataDictionary: {
            ...dataSet.reduce(
                (
                    previousValue: { [key: string]: Data<unknown> },
                    data: Data<unknown>
                ) => {
                    const currentId: string = uniqueId("fast");
                    currentIds.push(currentId);
                    itemDictionary[parentId] = Array.isArray(itemDictionary[parentId])
                        ? itemDictionary[parentId].concat([currentId])
                        : [currentId];
                    const linkedData: { [key: string]: Data<unknown> } = Array.isArray(
                        data.linkedData
                    )
                        ? resolveDataDictionary(
                              currentId,
                              data.linkedDataLocation,
                              data.linkedData,
                              itemDictionary
                          ).dataDictionary
                        : {};

                    return {
                        ...previousValue,
                        [currentId]: {
                            schemaId: data.schemaId,
                            data: data.data,
                            parent: {
                                id: parentId,
                                dataLocation: parentDataLocation,
                            },
                            items: itemDictionary[currentId] || [],
                        },
                        ...linkedData,
                    };
                },
                {}
            ),
        },
    };
}

export function getLinkedDataDictionary(
    config: LinkedDataDictionaryConfig
): LinkedDataDictionaryUpdate {
    const resolvedDataDictionary = resolveDataDictionary(
        config.dictionaryId,
        config.dataLocation,
        config.linkedData,
        {}
    );

    return {
        dataDictionary: [resolvedDataDictionary.dataDictionary, config.dictionaryId],
        linkedDataIds: Object.entries(resolvedDataDictionary.dataDictionary).map(
            ([id]: [string, Data<unknown>]) => {
                return {
                    id,
                };
            }
        ),
    };
}
