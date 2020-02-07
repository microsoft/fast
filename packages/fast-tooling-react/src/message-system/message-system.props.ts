import { DataType } from "../data-utilities/types";
import { TreeNavigationConfig, TreeNavigationConfigDictionary } from "./navigation.props";
import { Children, Data, DataDictionary } from "./data.props";
import { SchemaDictionary } from "./schema.props";

export enum MessageSystemDataDictionaryTypeAction {
    get = "get",
    updateActiveId = "update-active-id",
}

export enum MessageSystemDataTypeAction {
    update = "update",
    remove = "remove",
    add = "add",
    duplicate = "duplicate",
    removeChildren = "remove-children",
    addChildren = "add-children",
}

export enum MessageSystemNavigationDictionaryTypeAction {
    get = "get",
    updateActiveId = "update-active-id",
}

export enum MessageSystemNavigationTypeAction {
    update = "update",
    get = "get",
}

export enum MessageSystemType {
    data = "data",
    dataDictionary = "data-dictionary",
    navigation = "navigation",
    navigationDictionary = "navigation-dictionary",
    initialize = "initialize",
}

/**
 * The message to initialize the message system
 */
export interface InitializeMessageIncoming {
    type: MessageSystemType.initialize;
    data: DataDictionary<unknown>;
    schemas: SchemaDictionary;
}

/**
 * The message that the message system has been initialized
 */
export interface InitializeMessageOutgoing {
    type: MessageSystemType.initialize;
    data: unknown;
    navigation: TreeNavigationConfig;
    activeId: string;
    schema: any;
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
    activeId: string;
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
    activeId: string;
}

/**
 * The message to update the active id of the data dictionary
 */
export interface UpdateActiveIdDataDictionaryMessageIncoming {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.updateActiveId;
    activeId: string;
}

/**
 * The message that the active id of the data dictionary has been updated
 */
export interface UpdateActiveIdDataDictionaryMessageOutgoing {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.updateActiveId;
    activeId: string;
}

/**
 * The message to update the active id of the navigation dictionary
 */
export interface UpdateActiveIdNavigationDictionaryMessageIncoming {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId;
    activeId: string;
}

/**
 * The message that the active id of the navigation dictionary has been updated
 */
export interface UpdateActiveIdNavigationDictionaryMessageOutgoing {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId;
    activeId: string;
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
    navigation: TreeNavigationConfig;
}

/**
 * The message to add a child
 */
export interface AddChildrenDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.addChildren;
    dataLocation: string;
    children: Array<Data<unknown>>;
}

/**
 * The message that a child has been added
 */
export interface AddChildrenDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.addChildren;
    data: unknown;
    navigation: TreeNavigationConfig;
}

/**
 * The message to remove a child
 */
export interface RemoveChildrenDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.removeChildren;
    dataLocation: string;
    children: Children[];
}

/**
 * The message that a child has been removed
 */
export interface RemoveChildrenDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.removeChildren;
    data: unknown;
    navigation: TreeNavigationConfig;
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
    navigation: TreeNavigationConfig;
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
    navigation: TreeNavigationConfig;
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
    navigation: TreeNavigationConfig;
}

/**
 * Incoming data messages to the message system
 */
export type DataMessageIncoming =
    | UpdateDataMessageIncoming
    | DuplicateDataMessageIncoming
    | RemoveDataMessageIncoming
    | AddDataMessageIncoming
    | AddChildrenDataMessageIncoming
    | RemoveChildrenDataMessageIncoming;

/**
 * Outgoing data messages to the message system
 */
export type DataMessageOutgoing =
    | DuplicateDataMessageOutgoing
    | RemoveDataMessageOutgoing
    | AddDataMessageOutgoing
    | UpdateDataMessageOutgoing
    | AddChildrenDataMessageOutgoing
    | RemoveChildrenDataMessageOutgoing;

/**
 * The message to update navigation
 */
export interface UpdateNavigationMessageIncoming {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeId: string;
}

/**
 * The message that the navigation has been updated
 */
export interface UpdateNavigationMessageOutgoing {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeId: string;
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
    activeId: string;
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
