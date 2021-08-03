import { get, set } from "lodash-es";
import { getDataWithDuplicate } from "../data-utilities/duplicate";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
} from "../data-utilities/relocate";
import { getLinkedDataDictionary, getLinkedDataList } from "./data";
import { MessageSystemType } from "./types";
import {
    DataDictionaryMessageIncoming,
    DataDictionaryMessageOutgoing,
    DataMessageIncoming,
    DataMessageOutgoing,
    HistoryMessageIncoming,
    HistoryMessageOutgoing,
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemHistoryTypeAction,
    MessageSystemIncoming,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemOutgoing,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemValidationTypeAction,
    NavigationDictionaryMessageIncoming,
    NavigationDictionaryMessageOutgoing,
    NavigationMessageIncoming,
    NavigationMessageOutgoing,
    SchemaDictionaryMessageIncoming,
    SchemaDictionaryMessageOutgoing,
    ValidationMessageIncoming,
    ValidationMessageOutgoing,
} from "./message-system.utilities.props";
import { getNavigationDictionary } from "./navigation";
import { NavigationConfigDictionary } from "./navigation.props";
import { DataDictionary, LinkedData } from "./data.props";
import { defaultHistoryLimit } from "./history";
import { History } from "./history.props";
import { SchemaDictionary } from "./schema.props";
import { Validation } from "./validation.props";

/**
 * The default name that the display text maps to
 */
export const dataSetName: string = "data-fast-tooling-name";

/**
 * This is the Message System, through which:
 * - Data manipulation may be performed
 * - Navigation will be updated
 *
 * The main purpose of this is to tie together
 * process heavy actions onto a separate thread,
 * as well as to allow services to opt into a
 * single source for data updates.
 */

const history: History = {
    items: [],
    limit: defaultHistoryLimit,
};
let activeHistoryIndex: number = 0;
let dataDictionary: DataDictionary<unknown>;
let navigationDictionary: NavigationConfigDictionary;
let activeNavigationConfigId: string;
let activeDictionaryId: string; // this controls both the data and navigation dictionaries which must remain in sync
let schemaDictionary: SchemaDictionary;
const validation: Validation = {};

/**
 * Handles all custom messages
 */
function getCustomMessage<C>(data: C): C {
    return data;
}

/**
 * Handles all validation messages
 */
function getValidationMessage(
    data: ValidationMessageIncoming
): ValidationMessageOutgoing {
    switch (data.action) {
        case MessageSystemValidationTypeAction.update:
            validation[data.dictionaryId] = data.validationErrors;

            return {
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.update,
                dictionaryId: data.dictionaryId,
                validationErrors: data.validationErrors,
                options: data.options,
            };
        case MessageSystemValidationTypeAction.get:
            return {
                type: MessageSystemType.validation,
                action: MessageSystemValidationTypeAction.get,
                dictionaryId: data.dictionaryId,
                validationErrors: validation[data.dictionaryId],
                options: data.options,
            };
    }
}

/**
 * Handles all data dictionary messages
 */
function getDataDictionaryMessage(
    data: DataDictionaryMessageIncoming
): DataDictionaryMessageOutgoing {
    switch (data.action) {
        case MessageSystemDataDictionaryTypeAction.get:
            return {
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.get,
                dataDictionary,
                activeDictionaryId,
                options: data.options,
            };
        case MessageSystemDataDictionaryTypeAction.updateActiveId:
            activeDictionaryId = data.activeDictionaryId;

            return {
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                activeDictionaryId,
                options: data.options,
            };
    }
}

/**
 * Handles all navigation dictionary messages
 */
function getNavigationDictionaryMessage(
    data: NavigationDictionaryMessageIncoming
): NavigationDictionaryMessageOutgoing {
    switch (data.action) {
        case MessageSystemNavigationDictionaryTypeAction.get:
            return {
                type: MessageSystemType.navigationDictionary,
                action: MessageSystemNavigationDictionaryTypeAction.get,
                navigationDictionary,
                activeDictionaryId,
                options: data.options,
            };
        case MessageSystemNavigationDictionaryTypeAction.updateActiveId:
            activeDictionaryId = data.activeDictionaryId;

            return {
                type: MessageSystemType.navigationDictionary,
                action: MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                activeDictionaryId,
                options: data.options,
            };
    }
}

/**
 * Handles all history manipulation messages
 */
function getHistoryMessage(data: HistoryMessageIncoming): HistoryMessageOutgoing {
    switch (data.action) {
        case MessageSystemHistoryTypeAction.get:
            return {
                type: MessageSystemType.history,
                action: MessageSystemHistoryTypeAction.get,
                history,
            };
    }
}

/**
 * Handles all schema dictionary manipulation messages
 */
function getSchemaDictionaryMessage(
    data: SchemaDictionaryMessageIncoming
): SchemaDictionaryMessageOutgoing {
    switch (data.action) {
        case MessageSystemSchemaDictionaryTypeAction.add:
            schemaDictionary = data.schemas.reduce(
                (previousSchemaDictionary, currentSchema) => {
                    return {
                        ...previousSchemaDictionary,
                        [currentSchema.$id]: currentSchema,
                    };
                },
                schemaDictionary
            );

            return {
                type: MessageSystemType.schemaDictionary,
                action: MessageSystemSchemaDictionaryTypeAction.add,
                schemaDictionary,
            };
    }
}

/**
 * Handles all data manipulation messages
 */
function getDataMessage(data: DataMessageIncoming): DataMessageOutgoing {
    switch (data.action) {
        case MessageSystemDataTypeAction.duplicate:
            dataDictionary[0][activeDictionaryId].data = getDataWithDuplicate(
                data.sourceDataLocation,
                dataDictionary[0][activeDictionaryId].data
            );
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: data.sourceDataLocation,
                data: dataDictionary[0][activeDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][activeDictionaryId],
                navigationDictionary,
                options: data.options,
            };
        case MessageSystemDataTypeAction.remove:
            dataDictionary[0][activeDictionaryId].data = getDataUpdatedWithoutSourceData({
                sourceDataLocation: data.dataLocation,
                data: dataDictionary[0][activeDictionaryId].data,
            });
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                data: dataDictionary[0][activeDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][activeDictionaryId],
                navigationDictionary,
                options: data.options,
            };
        case MessageSystemDataTypeAction.add:
            dataDictionary[0][activeDictionaryId].data = getDataUpdatedWithSourceData({
                targetDataLocation: data.dataLocation,
                targetDataType: data.dataType,
                sourceData: data.data,
                data: dataDictionary[0][activeDictionaryId].data,
            });
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                data: dataDictionary[0][activeDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][activeDictionaryId],
                navigationDictionary,
                options: data.options,
            };
        case MessageSystemDataTypeAction.update: {
            const dictionaryId: string =
                data.dictionaryId !== undefined ? data.dictionaryId : activeDictionaryId;

            if (data.dataLocation === "") {
                dataDictionary[0][dictionaryId].data = data.data;
            } else {
                set(
                    dataDictionary[0][dictionaryId].data as object,
                    data.dataLocation,
                    data.data
                );
            }

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                data: dataDictionary[0][dictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][dictionaryId],
                navigationDictionary,
                options: data.options,
            };
        }
        case MessageSystemDataTypeAction.addLinkedData: {
            const addLinkedDataDictionaryId: string =
                typeof data.dictionaryId === "string"
                    ? data.dictionaryId
                    : activeDictionaryId;

            const updatedDataForDataDictionary = getLinkedDataDictionary({
                linkedData: data.linkedData,
                dictionaryId: addLinkedDataDictionaryId,
                dataLocation: data.dataLocation,
            });
            let currentLinkedDataRefs: LinkedData[] | void = get(
                dataDictionary[0][addLinkedDataDictionaryId].data,
                data.dataLocation
            );

            if (Array.isArray(currentLinkedDataRefs)) {
                if (typeof data.index === "number") {
                    currentLinkedDataRefs.splice(data.index, 0, {
                        id: updatedDataForDataDictionary.dataDictionary[1],
                    });
                } else {
                    currentLinkedDataRefs = currentLinkedDataRefs.concat([
                        {
                            id: updatedDataForDataDictionary.dataDictionary[1],
                        },
                    ]);
                }
            } else {
                currentLinkedDataRefs = [
                    {
                        id: updatedDataForDataDictionary.dataDictionary[1],
                    },
                ];
            }

            // update the data dictionary root dictionary id location with
            // the update linked data references
            set(
                dataDictionary[0][addLinkedDataDictionaryId].data as object,
                data.dataLocation,
                currentLinkedDataRefs
            );

            // update the data dictionary keys with the update data dictionary
            // of linked data items
            dataDictionary[0] = {
                ...dataDictionary[0],
                ...updatedDataForDataDictionary.dataDictionary[0],
            };

            // update the navigation dictionary
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addLinkedData,
                dictionaryId: addLinkedDataDictionaryId,
                linkedDataIds: Object.keys(
                    updatedDataForDataDictionary.dataDictionary[0]
                ).map((dataDictionaryKey: string) => {
                    return { id: dataDictionaryKey };
                }),
                data: dataDictionary[0][addLinkedDataDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][addLinkedDataDictionaryId],
                navigationDictionary,
                options: data.options,
            };
        }
        case MessageSystemDataTypeAction.removeLinkedData: {
            const removeLinkedDataDictionaryId: string = data.dictionaryId
                ? data.dictionaryId
                : activeDictionaryId;
            const linkedDataIds: string[] = [];
            // remove linkedData from the dictionary
            data.linkedData.forEach((linkedData: LinkedData) => {
                delete dataDictionary[0][linkedData.id];
                linkedDataIds.push(linkedData.id);

                // remove references from the linkedData to any other
                // piece of linkedData
                getLinkedDataList(dataDictionary, linkedData.id).forEach((id: string) => {
                    delete dataDictionary[0][id];
                    linkedDataIds.push(id);
                });
            });

            let filteredLinkedDataRefs: LinkedData[] = get(
                dataDictionary[0][removeLinkedDataDictionaryId].data,
                data.dataLocation,
                []
            );

            // filter the linkedData in the item the linkedData are being removed from to not include
            // those that were just removed
            filteredLinkedDataRefs = filteredLinkedDataRefs.filter(
                (filteredLinkedDataRef: LinkedData) => {
                    return (
                        data.linkedData.findIndex((linkedData: LinkedData) => {
                            return linkedData.id === filteredLinkedDataRef.id;
                        }) === -1
                    );
                }
            );

            set(
                dataDictionary[0][removeLinkedDataDictionaryId].data as object,
                data.dataLocation,
                filteredLinkedDataRefs
            );

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeLinkedData,
                data: dataDictionary[0][activeDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][activeDictionaryId],
                navigationDictionary,
                linkedDataIds,
                options: data.options,
            };
        }
        case MessageSystemDataTypeAction.reorderLinkedData:
            set(
                dataDictionary[0][activeDictionaryId].data as object,
                data.dataLocation,
                data.linkedData
            );

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.reorderLinkedData,
                data: dataDictionary[0][activeDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][activeDictionaryId],
                navigationDictionary,
                options: data.options,
            };
    }
}

function getNavigationMessage(
    data: NavigationMessageIncoming
): NavigationMessageOutgoing {
    switch (data.action) {
        case MessageSystemNavigationTypeAction.update:
            activeDictionaryId = data.activeDictionaryId;
            activeNavigationConfigId = data.activeNavigationConfigId;

            return {
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: data.activeDictionaryId,
                activeNavigationConfigId: data.activeNavigationConfigId,
                options: data.options,
            };
        case MessageSystemNavigationTypeAction.get:
            return {
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.get,
                activeDictionaryId,
                activeNavigationConfigId,
                navigation: navigationDictionary[0][activeDictionaryId],
                options: data.options,
            };
    }
}

function updateHistory<C>(data: MessageSystemOutgoing<C>): MessageSystemOutgoing<C> {
    history.items.push(data);
    const historyItemsLength = history.items.length;

    if (historyItemsLength > history.limit) {
        history.items.splice(0, historyItemsLength - history.limit);
    }

    if (activeHistoryIndex !== historyItemsLength) {
        activeHistoryIndex = historyItemsLength;
    }

    return data;
}

export function getMessage<C = {}>(
    data: MessageSystemIncoming<C>
): MessageSystemOutgoing<C> {
    switch (data.type) {
        case MessageSystemType.custom:
            return updateHistory(getCustomMessage(data));
        case MessageSystemType.data:
            return updateHistory(getDataMessage(data));
        case MessageSystemType.dataDictionary:
            return updateHistory(getDataDictionaryMessage(data));
        case MessageSystemType.navigation:
            return updateHistory(getNavigationMessage(data));
        case MessageSystemType.navigationDictionary:
            return updateHistory(getNavigationDictionaryMessage(data));
        case MessageSystemType.validation:
            return updateHistory(getValidationMessage(data));
        case MessageSystemType.history:
            return getHistoryMessage(data);
        case MessageSystemType.schemaDictionary:
            return getSchemaDictionaryMessage(data);
        case MessageSystemType.initialize:
            /**
             * TODO: remove this ternary to rely on the dataDictionary
             * as data is @deprecated
             */
            dataDictionary = Array.isArray(data.dataDictionary)
                ? data.dataDictionary
                : data.data;
            activeDictionaryId =
                typeof data.dictionaryId === "string"
                    ? data.dictionaryId
                    : dataDictionary[1];
            schemaDictionary = data.schemaDictionary;
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );
            activeNavigationConfigId =
                navigationDictionary[0][navigationDictionary[1]][1];
            history.limit = data.historyLimit || defaultHistoryLimit;

            return updateHistory({
                type: MessageSystemType.initialize,
                data: dataDictionary[0][activeDictionaryId].data,
                dataDictionary,
                navigation: navigationDictionary[0][activeDictionaryId],
                navigationDictionary,
                activeDictionaryId,
                activeNavigationConfigId,
                schema: schemaDictionary[dataDictionary[0][activeDictionaryId].schemaId],
                schemaDictionary,
                historyLimit: history.limit,
                options: data.options,
            });
    }
}
