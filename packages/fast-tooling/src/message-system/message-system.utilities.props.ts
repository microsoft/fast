import { DataType } from "../data-utilities/types";
import { TreeNavigationConfig, TreeNavigationConfigDictionary } from "./navigation.props";
import { Data, DataDictionary, LinkedData } from "./data.props";
import { SchemaDictionary } from "./schema.props";
import { MessageSystemType } from "./types";

export enum MessageSystemDataDictionaryTypeAction {
    get = "get",
    updateActiveId = "update-active-id",
}

export enum MessageSystemDataTypeAction {
    update = "update",
    remove = "remove",
    add = "add",
    duplicate = "duplicate",
    removeLinkedData = "remove-linked-data",
    addLinkedData = "add-linked-data",
    reorderLinkedData = "reorder-linked-data",
}

export enum MessageSystemNavigationDictionaryTypeAction {
    get = "get",
    updateActiveId = "update-active-id",
}

export enum MessageSystemNavigationTypeAction {
    update = "update",
    get = "get",
}

/**
 * The message to initialize the message system
 */
export interface InitializeMessageIncoming {
    type: MessageSystemType.initialize;
    data: DataDictionary<unknown>;
    schemaDictionary: SchemaDictionary;
}

/**
 * The message that the message system has been initialized
 */
export interface InitializeMessageOutgoing {
    type: MessageSystemType.initialize;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
    schema: any;
    schemaDictionary: SchemaDictionary;
}

/**
 * The message to get the data dictionary
 */
export interface GetDataDictionaryMessageIncoming {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.get;
}

/**
 * The message that the data dictionary has been given
 */
export interface GetDataDictionaryMessageOutgoing {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.get;
    dataDictionary: DataDictionary<unknown>;
    activeDictionaryId: string;
}

/**
 * The message to get the navigation dictionary
 */
export interface GetNavigationDictionaryMessageIncoming {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.get;
}

/**
 * The message that the navigation dictionary has been given
 */
export interface GetNavigationDictionaryMessageOutgoing {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.get;
    navigationDictionary: TreeNavigationConfigDictionary;
    activeDictionaryId: string;
}

/**
 * The message to update the active id of the data dictionary
 */
export interface UpdateActiveIdDataDictionaryMessageIncoming {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message that the active id of the data dictionary has been updated
 */
export interface UpdateActiveIdDataDictionaryMessageOutgoing {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message to update the active id of the navigation dictionary
 */
export interface UpdateActiveIdNavigationDictionaryMessageIncoming {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message that the active id of the navigation dictionary has been updated
 */
export interface UpdateActiveIdNavigationDictionaryMessageOutgoing {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message to update data
 */
export interface UpdateDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.update;
    dataLocation: string;
    data: unknown;
}

/**
 * The message that the data has been updated
 */
export interface UpdateDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.update;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * The message to add a linked data
 */
export interface AddLinkedDataDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.addLinkedData;
    /**
     * Dictionary ID to use if it is different from the current
     * active dictionary ID
     */
    dictionaryId?: string;
    dataLocation: string;
    linkedData: Array<Data<unknown>>;
}

/**
 * The message that linked data has been added
 */
export interface AddLinkedDataDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.addLinkedData;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * The message to remove linked data
 */
export interface RemoveLinkedDataDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.removeLinkedData;
    /**
     * Dictionary ID to use if it is different from the current
     * active dictionary ID
     */
    dictionaryId?: string;
    dataLocation: string;
    linkedData: LinkedData[];
}

/**
 * The message that linked data has been removed
 */
export interface RemoveLinkedDataDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.removeLinkedData;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * The message to reorder linked data
 */
export interface ReorderLinkedDataDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.reorderLinkedData;
    dataLocation: string;
    linkedData: LinkedData[];
}

/**
 * The message that linked data has been reordered
 */
export interface ReorderLinkedDataDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.reorderLinkedData;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * The message to duplicate data
 */
export interface DuplicateDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.duplicate;
    sourceDataLocation: string;
}

/**
 * The message that the data has been duplicated
 * with updated data
 */
export interface DuplicateDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.duplicate;
    sourceDataLocation: string;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * The message to remove data
 */
export interface RemoveDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.remove;
    dataLocation: string;
}

/**
 * The message that the data has been removed
 * with updated data
 */
export interface RemoveDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.remove;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * The message to add data
 */
export interface AddDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.add;
    dataLocation: string;
    data: unknown;
    dataType: DataType;
}

/**
 * The message that the data has been added
 * with updated data
 */
export interface AddDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.add;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: TreeNavigationConfig;
    navigationDictionary: TreeNavigationConfigDictionary;
}

/**
 * Incoming data messages to the message system
 */
export type DataMessageIncoming =
    | UpdateDataMessageIncoming
    | DuplicateDataMessageIncoming
    | RemoveDataMessageIncoming
    | AddDataMessageIncoming
    | AddLinkedDataDataMessageIncoming
    | RemoveLinkedDataDataMessageIncoming
    | ReorderLinkedDataDataMessageIncoming;

/**
 * Outgoing data messages to the message system
 */
export type DataMessageOutgoing =
    | DuplicateDataMessageOutgoing
    | RemoveDataMessageOutgoing
    | AddDataMessageOutgoing
    | UpdateDataMessageOutgoing
    | AddLinkedDataDataMessageOutgoing
    | RemoveLinkedDataDataMessageOutgoing
    | ReorderLinkedDataDataMessageOutgoing;

/**
 * The message to update navigation
 */
export interface UpdateNavigationMessageIncoming {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
}

/**
 * The message that the navigation has been updated
 */
export interface UpdateNavigationMessageOutgoing {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
}

/**
 * The message to get navigation
 */
export interface GetNavigationMessageIncoming {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.get;
}

/**
 * The message that the navigation has been given
 */
export interface GetNavigationMessageOutgoing {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.get;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
    navigation: TreeNavigationConfig;
}

/**
 * Incoming navigation dictionary messages to the message system
 */
export type NavigationDictionaryMessageIncoming =
    | GetNavigationDictionaryMessageIncoming
    | UpdateActiveIdNavigationDictionaryMessageIncoming;

/**
 * Outgoing navigation dictionary messages from the message system
 */
export type NavigationDictionaryMessageOutgoing =
    | GetNavigationDictionaryMessageOutgoing
    | UpdateActiveIdNavigationDictionaryMessageOutgoing;

/**
 * Incoming data dictionary messages to the message system
 */
export type DataDictionaryMessageIncoming =
    | GetDataDictionaryMessageIncoming
    | UpdateActiveIdDataDictionaryMessageIncoming;

/**
 * Outgoing data dictionary messages from the message system
 */
export type DataDictionaryMessageOutgoing =
    | GetDataDictionaryMessageOutgoing
    | UpdateActiveIdDataDictionaryMessageOutgoing;

/**
 * Incoming navigation messages to the message system
 */
export type NavigationMessageIncoming =
    | UpdateNavigationMessageIncoming
    | GetNavigationMessageIncoming;

/**
 * Outgoing navigation messages to the message system
 */
export type NavigationMessageOutgoing =
    | UpdateNavigationMessageOutgoing
    | GetNavigationMessageOutgoing;

/**
 * Incoming messages to the message system
 */
export type MessageSystemIncoming =
    | InitializeMessageIncoming
    | DataMessageIncoming
    | NavigationMessageIncoming
    | NavigationDictionaryMessageIncoming
    | DataDictionaryMessageIncoming;

/**
 * Outgoing messages from the message system
 */
export type MessageSystemOutgoing =
    | InitializeMessageOutgoing
    | DataMessageOutgoing
    | NavigationMessageOutgoing
    | NavigationDictionaryMessageOutgoing
    | DataDictionaryMessageOutgoing;
