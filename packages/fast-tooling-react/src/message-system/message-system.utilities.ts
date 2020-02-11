import {
    DataDictionaryMessageIncoming,
    DataDictionaryMessageOutgoing,
    DataMessageIncoming,
    DataMessageOutgoing,
    MessageSystemDataDictionaryTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemIncoming,
    MessageSystemNavigationDictionaryTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemOutgoing,
    NavigationDictionaryMessageIncoming,
    NavigationDictionaryMessageOutgoing,
    NavigationMessageIncoming,
    NavigationMessageOutgoing,
} from "./message-system.utilities.props";
import { MessageSystemType } from "./types";
import { get, set, uniqueId } from "lodash-es";
import { getDataWithDuplicate } from "../data-utilities/duplicate";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
} from "../data-utilities/relocate";
import { getNavigationDictionary } from "./navigation";
import { TreeNavigationConfigDictionary } from "./navigation.props";
import { Children, Data, DataDictionary } from "./data.props";
import { SchemaDictionary } from "./schema.props";

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

let dataDictionary: DataDictionary<unknown>;
let navigationDictionary: TreeNavigationConfigDictionary;
let navigationActiveId: string;
let activeId: string; // this controls both the data and navigation dictionaries which must remain in sync
let schemaDictionary: SchemaDictionary;

export function getMessage(data: MessageSystemIncoming): MessageSystemOutgoing {
    switch (data.type) {
        case MessageSystemType.data:
            return getDataMessage(data);
        case MessageSystemType.dataDictionary:
            return getDataDictionaryMessage(data);
        case MessageSystemType.navigation:
            return getNavigationMessage(data);
        case MessageSystemType.navigationDictionary:
            return getNavigationDictionaryMessage(data);
        case MessageSystemType.initialize:
            dataDictionary = data.data;
            activeId = dataDictionary[1];
            schemaDictionary = data.schemas;
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary
            );
            navigationActiveId = navigationDictionary[0][navigationDictionary[1]][1];

            return {
                type: MessageSystemType.initialize,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
                activeId: navigationActiveId,
                schema: schemaDictionary[dataDictionary[0][activeId].schemaId],
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
                activeId,
            };
        case MessageSystemDataDictionaryTypeAction.updateActiveId:
            activeId = data.activeId;

            return {
                type: MessageSystemType.dataDictionary,
                action: MessageSystemDataDictionaryTypeAction.updateActiveId,
                activeId,
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
                activeId,
            };
        case MessageSystemNavigationDictionaryTypeAction.updateActiveId:
            activeId = data.activeId;

            return {
                type: MessageSystemType.navigationDictionary,
                action: MessageSystemNavigationDictionaryTypeAction.updateActiveId,
                activeId,
            };
    }
}

/**
 * Handles all data manipulation messages
 */
function getDataMessage(data: DataMessageIncoming): DataMessageOutgoing {
    switch (data.action) {
        case MessageSystemDataTypeAction.duplicate:
            dataDictionary[0][activeId].data = getDataWithDuplicate(
                data.sourceDataLocation,
                dataDictionary[0][activeId].data
            );
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: data.sourceDataLocation,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
            };
        case MessageSystemDataTypeAction.remove:
            dataDictionary[0][activeId].data = getDataUpdatedWithoutSourceData({
                sourceDataLocation: data.dataLocation,
                data: dataDictionary[0][activeId].data,
            });
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
            };
        case MessageSystemDataTypeAction.add:
            dataDictionary[0][activeId].data = getDataUpdatedWithSourceData({
                targetDataLocation: data.dataLocation,
                targetDataType: data.dataType,
                sourceData: data.data,
                data: dataDictionary[0][activeId].data,
            });
            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
            };
        case MessageSystemDataTypeAction.update:
            if (data.dataLocation === "") {
                dataDictionary[0][activeId].data = data.data;
            } else {
                set(
                    dataDictionary[0][activeId].data as object,
                    data.dataLocation,
                    data.data
                );
            }

            navigationDictionary = getNavigationDictionary(
                schemaDictionary,
                dataDictionary
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
            };
        case MessageSystemDataTypeAction.addChildren:
            const childrenRefs: Children[] = [];
            // add the children to the dictionary
            data.children.forEach((children: Data<unknown>) => {
                const id: string = uniqueId("fast");
                dataDictionary[0][id] = children;
                childrenRefs.push({ id });
            });
            // update the parent to include the added children
            let currentChildrenRefs: Children[] | void = get(
                dataDictionary[0][activeId].data,
                data.dataLocation
            );

            if (Array.isArray(currentChildrenRefs)) {
                currentChildrenRefs.concat(childrenRefs);
            } else {
                currentChildrenRefs = childrenRefs;
            }

            set(
                dataDictionary[0][activeId].data as object,
                data.dataLocation,
                currentChildrenRefs
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.addChildren,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
            };
        case MessageSystemDataTypeAction.removeChildren:
            // remove children from the dictionary
            data.children.forEach((children: Children) => {
                delete dataDictionary[0][children.id];
            });

            let filteredChildrenRefs: Children[] = get(
                dataDictionary[0][activeId].data,
                data.dataLocation,
                []
            );

            // filter the children in the item the children are being removed from to not include
            // those that were just removed
            filteredChildrenRefs = filteredChildrenRefs.filter(
                (filteredChildrenRef: Children) => {
                    return (
                        data.children.findIndex((children: Children) => {
                            return children.id === filteredChildrenRef.id;
                        }) === -1
                    );
                }
            );

            set(
                dataDictionary[0][activeId].data as object,
                data.dataLocation,
                filteredChildrenRefs
            );

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.removeChildren,
                data: dataDictionary[0][activeId].data,
                navigation: navigationDictionary[0][activeId],
            };
    }
}

function getNavigationMessage(
    data: NavigationMessageIncoming
): NavigationMessageOutgoing {
    switch (data.action) {
        case MessageSystemNavigationTypeAction.update:
            navigationActiveId = data.activeId;

            return {
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeId: data.activeId,
            };
        case MessageSystemNavigationTypeAction.get:
            return {
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.get,
                activeId: navigationActiveId,
                navigation: activeId[0][activeId],
            };
    }
}
