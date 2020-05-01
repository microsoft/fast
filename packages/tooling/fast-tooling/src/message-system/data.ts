import { uniqueId } from "lodash-es";
import {
    Data,
    LinkedData,
    LinkedDataDictionaryConfig,
    LinkedDataDictionaryUpdate,
} from "./data.props";

interface ResolveDataDictionary {
    dataDictionary: { [key: string]: Data<unknown> };
    linkedDataIds: LinkedData[];
}

function resolveDataDictionary(
    parentId: string,
    parentDataLocation: string,
    dataSet: Data<unknown>[]
): ResolveDataDictionary {
    const ids: string[] = [];

    return {
        dataDictionary: {
            ...dataSet.reduce(
                (
                    previousValue: { [key: string]: Data<unknown> },
                    data: Data<unknown>
                ) => {
                    const id: string = uniqueId("fast");
                    ids.push(id);
                    const linkedData: { [key: string]: Data<unknown> } = Array.isArray(
                        data.linkedData
                    )
                        ? resolveDataDictionary(
                              id,
                              data.linkedDataLocation,
                              data.linkedData
                          ).dataDictionary
                        : {};

                    return {
                        ...previousValue,
                        [id]: {
                            schemaId: data.schemaId,
                            data: data.data,
                            parent: {
                                id: parentId,
                                dataLocation: parentDataLocation,
                            },
                            items: Object.keys(linkedData),
                        },
                        ...linkedData,
                    };
                },
                {}
            ),
        },
        linkedDataIds: ids.map((id: string) => {
            return {
                id,
            };
        }),
    };
}

export function getLinkedDataDictionary(
    config: LinkedDataDictionaryConfig
): LinkedDataDictionaryUpdate {
    const resolvedDataDictionary = resolveDataDictionary(
        config.dictionaryId,
        config.dataLocation,
        config.linkedData
    );

    return {
        dataDictionary: [resolvedDataDictionary.dataDictionary, config.dictionaryId],
        linkedDataIds: resolvedDataDictionary.linkedDataIds,
    };
}
