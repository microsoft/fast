import { get, set } from "lodash-es";
import { getDataWithDuplicate } from "../data-utilities/duplicate";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
    getNextActiveParentDictionaryId,
} from "../data-utilities/relocate";
import { getLinkedDataDictionary, getLinkedDataList } from "./data";
import { MessageSystemType } from "./types";
import {
    CustomMessage,
    DataDictionaryMessageIncoming,
    DataDictionaryMessageOutgoing,
    DataMessageIncoming,
    DataMessageOutgoing,
    HistoryMessageIncoming,
    HistoryMessageOutgoing,
    InternalIncomingMessage,
    InternalMessageSystemIncoming,
    InternalMessageSystemOutgoing,
    InternalOutgoingMessage,
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemHistoryTypeAction,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemValidationTypeAction,
    NavigationDictionaryMessageIncoming,
    NavigationDictionaryMessageOutgoing,
    NavigationMessageIncoming,
    NavigationMessageOutgoing,
    RemoveLinkedDataDataMessageIncoming,
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
function getCustomMessage<C, OConfig>(
    data: InternalIncomingMessage<CustomMessage<C, OConfig>>
): InternalOutgoingMessage<CustomMessage<C, OConfig>> {
    return data;
}

/**
 * Handles all validation messages
 */
function getValidationMessage(
    data: InternalOutgoingMessage<ValidationMessageIncoming>
): InternalOutgoingMessage<ValidationMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemValidationTypeAction.update:
            validation[data[0].dictionaryId] = data[0].validationErrors;

            return [
                {
                    type: MessageSystemType.validation,
                    action: MessageSystemValidationTypeAction.update,
                    dictionaryId: data[0].dictionaryId,
                    validationErrors: data[0].validationErrors,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemValidationTypeAction.get:
            return [
                {
                    type: MessageSystemType.validation,
                    action: MessageSystemValidationTypeAction.get,
                    dictionaryId: data[0].dictionaryId,
                    validationErrors: validation[data[0].dictionaryId],
                    options: data[0].options,
                },
                data[1],
            ];
    }
}

/**
 * Handles all data dictionary messages
 */
function getDataDictionaryMessage(
    data: InternalIncomingMessage<DataDictionaryMessageIncoming>
): InternalOutgoingMessage<DataDictionaryMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemDataDictionaryTypeAction.get:
            return [
                {
                    type: MessageSystemType.dataDictionary,
                    action: MessageSystemDataDictionaryTypeAction.get,
                    dataDictionary,
                    activeDictionaryId,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemDataDictionaryTypeAction.updateActiveId:
            activeDictionaryId = data[0].activeDictionaryId;

            return [
                {
                    type: MessageSystemType.dataDictionary,
                    action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                    activeDictionaryId,
                    options: data[0].options,
                },
                data[1],
            ];
    }
}

/**
 * Handles all navigation dictionary messages
 */
function getNavigationDictionaryMessage(
    data: InternalIncomingMessage<NavigationDictionaryMessageIncoming>
): InternalOutgoingMessage<NavigationDictionaryMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemNavigationDictionaryTypeAction.get:
            return [
                {
                    type: MessageSystemType.navigationDictionary,
                    action: MessageSystemNavigationDictionaryTypeAction.get,
                    navigationDictionary,
                    activeDictionaryId,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemNavigationDictionaryTypeAction.updateActiveId:
            activeDictionaryId = data[0].activeDictionaryId;

            return [
                {
                    type: MessageSystemType.navigationDictionary,
                    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                    activeDictionaryId,
                    options: data[0].options,
                },
                data[1],
            ];
    }
}

/**
 * Handles all history manipulation messages
 */
function getHistoryMessage(
    data: InternalIncomingMessage<HistoryMessageIncoming>
): InternalOutgoingMessage<HistoryMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemHistoryTypeAction.get:
            return [
                {
                    type: MessageSystemType.history,
                    action: MessageSystemHistoryTypeAction.get,
                    history,
                },
                data[1],
            ];
    }
}

/**
 * Handles all schema dictionary manipulation messages
 */
function getSchemaDictionaryMessage(
    data: InternalIncomingMessage<SchemaDictionaryMessageIncoming>
): InternalOutgoingMessage<SchemaDictionaryMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemSchemaDictionaryTypeAction.add:
            schemaDictionary = data[0].schemas.reduce(
                (previousSchemaDictionary, currentSchema) => {
                    return {
                        ...previousSchemaDictionary,
                        [currentSchema.$id]: currentSchema,
                    };
                },
                schemaDictionary
            );

            return [
                {
                    type: MessageSystemType.schemaDictionary,
                    action: MessageSystemSchemaDictionaryTypeAction.add,
                    schemaDictionary,
                },
                data[1],
            ];
    }
}

/**
 * Handles all data manipulation messages
 */
function getDataMessage(
    data: InternalIncomingMessage<DataMessageIncoming>
): InternalOutgoingMessage<DataMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemDataTypeAction.duplicate:
            dataDictionary[0][activeDictionaryId].data = getDataWithDuplicate(
                data[0].sourceDataLocation,
                dataDictionary[0][activeDictionaryId].data
            );
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return [
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.duplicate,
                    sourceDataLocation: data[0].sourceDataLocation,
                    data: dataDictionary[0][activeDictionaryId].data,
                    dataDictionary,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    navigationDictionary,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemDataTypeAction.remove:
            dataDictionary[0][activeDictionaryId].data = getDataUpdatedWithoutSourceData({
                sourceDataLocation: data[0].dataLocation,
                data: dataDictionary[0][activeDictionaryId].data,
            });
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return [
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.remove,
                    data: dataDictionary[0][activeDictionaryId].data,
                    dataDictionary,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    navigationDictionary,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemDataTypeAction.add:
            dataDictionary[0][activeDictionaryId].data = getDataUpdatedWithSourceData({
                targetDataLocation: data[0].dataLocation,
                targetDataType: data[0].dataType,
                sourceData: data[0].data,
                data: dataDictionary[0][activeDictionaryId].data,
            });
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return [
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.add,
                    data: dataDictionary[0][activeDictionaryId].data,
                    dataDictionary,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    navigationDictionary,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemDataTypeAction.update: {
            const dictionaryId: string =
                data[0].dictionaryId !== undefined
                    ? data[0].dictionaryId
                    : activeDictionaryId;

            if (data[0].dataLocation === "") {
                dataDictionary[0][dictionaryId].data = data[0].data;
            } else {
                set(
                    dataDictionary[0][dictionaryId].data as object,
                    data[0].dataLocation,
                    data[0].data
                );
            }

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return [
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.update,
                    data: dataDictionary[0][dictionaryId].data,
                    dataDictionary,
                    navigation: navigationDictionary[0][dictionaryId],
                    navigationDictionary,
                    options: data[0].options,
                },
                data[1],
            ];
        }
        case MessageSystemDataTypeAction.addLinkedData: {
            const addLinkedDataDictionaryId: string =
                typeof data[0].dictionaryId === "string"
                    ? data[0].dictionaryId
                    : activeDictionaryId;

            const updatedDataForDataDictionary = getLinkedDataDictionary({
                linkedData: data[0].linkedData,
                dictionaryId: addLinkedDataDictionaryId,
                dataLocation: data[0].dataLocation,
            });
            let currentLinkedDataRefs: LinkedData[] | void = get(
                dataDictionary[0][addLinkedDataDictionaryId].data,
                data[0].dataLocation
            );

            if (Array.isArray(currentLinkedDataRefs)) {
                if (typeof data[0].index === "number") {
                    currentLinkedDataRefs.splice(data[0].index, 0, {
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
                data[0].dataLocation,
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

            return [
                {
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
                    options: data[0].options,
                },
                data[1],
            ];
        }
        case MessageSystemDataTypeAction.removeLinkedData: {
            const removeLinkedDataDictionaryId: string = data[0].dictionaryId
                ? data[0].dictionaryId
                : activeDictionaryId;
            const linkedDataIds: string[] = [];
            const removedLinkedData: unknown = dataDictionary[0][activeDictionaryId].data;

            // add linked data IDs to be removed
            data[0].linkedData.forEach((linkedData: LinkedData) => {
                linkedDataIds.push(linkedData.id);

                // add linked data IDs to be removed from other pieces of linked data
                getLinkedDataList(dataDictionary, linkedData.id).forEach((id: string) => {
                    linkedDataIds.push(id);
                });
            });
            // get the active dictionary ID in case it is among those being removed
            activeDictionaryId = getNextActiveParentDictionaryId(
                activeDictionaryId,
                linkedDataIds,
                dataDictionary
            );

            // remove linked data from the dictionary
            linkedDataIds.forEach((linkedDataId: string) => {
                delete dataDictionary[0][linkedDataId];
            });

            let filteredLinkedDataRefs: LinkedData[] = get(
                dataDictionary[0][removeLinkedDataDictionaryId].data,
                data[0].dataLocation,
                []
            );

            // filter the linkedData in the item the linkedData are being removed from to not include
            // those that were just removed
            filteredLinkedDataRefs = filteredLinkedDataRefs.filter(
                (filteredLinkedDataRef: LinkedData) => {
                    return (
                        (data[0] as RemoveLinkedDataDataMessageIncoming).linkedData.findIndex(
                            (linkedData: LinkedData) => {
                                return linkedData.id === filteredLinkedDataRef.id;
                            }
                        ) === -1
                    );
                }
            );

            set(
                dataDictionary[0][removeLinkedDataDictionaryId].data as object,
                data[0].dataLocation,
                filteredLinkedDataRefs
            );

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return [
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.removeLinkedData,
                    data: removedLinkedData,
                    activeDictionaryId,
                    dataDictionary,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    navigationDictionary,
                    linkedDataIds,
                    options: data[0].options,
                },
                data[1],
            ];
        }
        case MessageSystemDataTypeAction.reorderLinkedData:
            set(
                dataDictionary[0][activeDictionaryId].data as object,
                data[0].dataLocation,
                data[0].linkedData
            );

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );

            return [
                {
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.reorderLinkedData,
                    data: dataDictionary[0][activeDictionaryId].data,
                    dataDictionary,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    navigationDictionary,
                    options: data[0].options,
                },
                data[1],
            ];
    }
}

function getNavigationMessage(
    data: InternalOutgoingMessage<NavigationMessageIncoming>
): InternalOutgoingMessage<NavigationMessageOutgoing> {
    switch (data[0].action) {
        case MessageSystemNavigationTypeAction.update:
            activeDictionaryId = data[0].activeDictionaryId;
            activeNavigationConfigId = data[0].activeNavigationConfigId;

            return [
                {
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: data[0].activeDictionaryId,
                    activeNavigationConfigId: data[0].activeNavigationConfigId,
                    options: data[0].options,
                },
                data[1],
            ];
        case MessageSystemNavigationTypeAction.get:
            return [
                {
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.get,
                    activeDictionaryId,
                    activeNavigationConfigId,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    options: data[0].options,
                },
                data[1],
            ];
    }
}

function updateHistory<C>(
    data: InternalMessageSystemOutgoing<C>
): InternalMessageSystemOutgoing<C> {
    history.items.push(data[0]);
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
    data: InternalMessageSystemIncoming
): InternalMessageSystemOutgoing<C> {
    switch (data[0].type) {
        case MessageSystemType.custom:
            return updateHistory(
                getCustomMessage(data as InternalIncomingMessage<CustomMessage<C, {}>>)
            );
        case MessageSystemType.data:
            return updateHistory(
                getDataMessage(data as InternalIncomingMessage<DataMessageIncoming>)
            );
        case MessageSystemType.dataDictionary:
            return updateHistory(
                getDataDictionaryMessage(
                    data as InternalIncomingMessage<DataDictionaryMessageIncoming>
                )
            );
        case MessageSystemType.navigation:
            return updateHistory(
                getNavigationMessage(
                    data as InternalIncomingMessage<NavigationMessageIncoming>
                )
            );
        case MessageSystemType.navigationDictionary:
            return updateHistory(
                getNavigationDictionaryMessage(
                    data as InternalIncomingMessage<NavigationDictionaryMessageIncoming>
                )
            );
        case MessageSystemType.validation:
            return updateHistory(
                getValidationMessage(
                    data as InternalIncomingMessage<ValidationMessageIncoming>
                )
            );
        case MessageSystemType.history:
            return getHistoryMessage(
                data as InternalIncomingMessage<HistoryMessageIncoming>
            );
        case MessageSystemType.schemaDictionary:
            return getSchemaDictionaryMessage(
                data as InternalIncomingMessage<SchemaDictionaryMessageIncoming>
            );
        case MessageSystemType.initialize:
            /**
             * TODO: remove this ternary to rely on the dataDictionary
             * as data is @deprecated
             */
            dataDictionary = Array.isArray(data[0].dataDictionary)
                ? data[0].dataDictionary
                : data[0].data;
            activeDictionaryId =
                typeof data[0].dictionaryId === "string"
                    ? data[0].dictionaryId
                    : dataDictionary[1];
            schemaDictionary = data[0].schemaDictionary;
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary,
                dataSetName
            );
            activeNavigationConfigId =
                navigationDictionary[0][navigationDictionary[1]][1];
            history.limit = data[0].historyLimit || defaultHistoryLimit;

            return updateHistory([
                {
                    type: MessageSystemType.initialize,
                    data: dataDictionary[0][activeDictionaryId].data,
                    dataDictionary,
                    navigation: navigationDictionary[0][activeDictionaryId],
                    navigationDictionary,
                    activeDictionaryId,
                    activeNavigationConfigId,
                    schema:
                        schemaDictionary[dataDictionary[0][activeDictionaryId].schemaId],
                    schemaDictionary,
                    historyLimit: history.limit,
                    options: data[0].options,
                },
                data[1],
            ]);
    }
}
