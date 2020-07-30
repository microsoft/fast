import { cloneDeep, get, uniqueId, unset } from "lodash-es";
import {
    Data,
    DataDictionary,
    LinkedData,
    LinkedDataDictionaryConfig,
    LinkedDataDictionaryUpdate,
} from "./data.props";

/**
 * Resolves a set of data dictionaries from multiple data items
 */
function resolveDataDictionaries(
    parentId: string,
    parentDataLocation: string,
    dataSet: Data<unknown>[]
): DataDictionary<unknown>[] {
    return dataSet.map(dataItem => {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        return resolveDataDictionary(parentId, parentDataLocation, dataItem, {});
    });
}

/**
 * Resolves a data dictionary from a data item
 */
function resolveDataDictionary(
    parentId: string,
    parentDataLocation: string,
    data: Data<unknown>,
    itemDictionary: { [key: string]: Data<unknown> }
): DataDictionary<unknown> {
    const id: string = uniqueId("fast");
    const dataDictionary: DataDictionary<unknown> = [itemDictionary, id];
    const linkedDataDictionary: DataDictionary<unknown>[] | null = Array.isArray(
        data.linkedData
    )
        ? resolveDataDictionaries(id, parentDataLocation, data.linkedData)
        : null;

    const currentData = data.data;

    if (linkedDataDictionary !== null) {
        linkedDataDictionary.forEach(linkedDataDictionaryItem => {
            const currentLinkedDataItems: LinkedData[] =
                (currentData as any)[
                    linkedDataDictionaryItem[0][linkedDataDictionaryItem[1]].parent
                        .dataLocation
                ] || [];

            (currentData as any)[
                linkedDataDictionaryItem[0][
                    linkedDataDictionaryItem[1]
                ].parent.dataLocation
            ] = currentLinkedDataItems.concat([
                {
                    id: linkedDataDictionaryItem[1],
                },
            ]);
            dataDictionary[0] = {
                ...dataDictionary[0],
                ...linkedDataDictionaryItem[0],
            };
        });
    }

    dataDictionary[0][id] = {
        schemaId: data.schemaId,
        data: currentData,
        parent: {
            id: parentId,
            dataLocation: data.dataLocation || parentDataLocation,
        },
    };

    return dataDictionary;
}

export function getLinkedDataDictionary(
    config: LinkedDataDictionaryConfig
): LinkedDataDictionaryUpdate {
    const resolvedDataDictionary = resolveDataDictionaries(
        config.dictionaryId,
        config.dataLocation,
        config.linkedData
    );

    return {
        dataDictionary: resolvedDataDictionary[0],
        dictionaryId: config.dictionaryId,
    };
}

/**
 * Gets linked data from a data dictionary
 * that can be used to add to an existing data dictionary
 * via the Message System
 */
export function getLinkedData(
    dataDictionary: DataDictionary<unknown>,
    dictionaryIds: string[]
): Data<unknown>[] {
    return dictionaryIds.map(dictionaryId => {
        const data = cloneDeep(dataDictionary[0][dictionaryId].data);
        // Retrieve all direct linked data for each data item
        // and removes it from the original parent linked data item
        const linkedDataKeys: string[] = Object.keys(dataDictionary[0]).filter(
            (dataDictionaryKey: string) => {
                const isLinkedData =
                    get(dataDictionary[0][dataDictionaryKey], "parent.id") ===
                    dictionaryId;

                if (isLinkedData) {
                    unset(
                        data,
                        get(dataDictionary[0][dataDictionaryKey], "parent.dataLocation")
                    );
                }

                return isLinkedData;
            }
        );

        return {
            schemaId: dataDictionary[0][dictionaryId].schemaId,
            data,
            linkedData: getLinkedData(dataDictionary, linkedDataKeys),
        };
    });
}

/**
 * Gets a list of linked data ids from a single dictionary id
 */
export function getLinkedDataList(
    dataDictionary: DataDictionary<unknown>,
    dictionaryId: string
): string[] {
    let linkedDataIds: string[] = [];

    Object.entries(dataDictionary[0]).forEach(
        ([key, dataDictionaryItem]: [string, Data<unknown>]) => {
            if (get(dataDictionaryItem, "parent.id") === dictionaryId) {
                linkedDataIds.push(key);

                linkedDataIds = linkedDataIds.concat(
                    getLinkedDataList(dataDictionary, key)
                );
            }
        }
    );

    return linkedDataIds;
}
