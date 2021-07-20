import { DataType } from "../data-utilities/types";
import { NavigationConfig, NavigationConfigDictionary } from "./navigation.props";
import { Data, DataDictionary, LinkedData } from "./data.props";
import { SchemaDictionary } from "./schema.props";
import { MessageSystemType } from "./types";
import { ValidationError } from "./validation.props";
import { History } from "./history.props";

/**
 * Note on nomenclature: incoming messages are being sent to, and recieved, by the message system
 * while outgoing messages are being sent from the message system to any registered service. These
 * terms are from the POV of the message system.
 */

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

export enum MessageSystemValidationTypeAction {
    update = "update",
    get = "get",
}

export enum MessageSystemHistoryTypeAction {
    get = "get",
}

export enum MessageSystemSchemaDictionaryTypeAction {
    add = "add",
}

interface ArbitraryMessageIncoming<TConfig = {}> {
    /**
     * Additional arbitrary options to be passed with the message
     */
    options?: TConfig;
}

interface ArbitraryMessageOutgoing<TConfig = {}> {
    /**
     * Additional arbitrary options to be passed with the message
     */
    options?: TConfig;
}

/**
 * The message to initialize the message system
 *
 * A message system can be initialized without a data dictionary or schema dictionary
 * if asynchronous services are being added to the message system and the initialization
 * must happen at a later stage once the asynchronous services have initialized.
 */
export interface InitializeMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.initialize;
    /**
     * This is deprecated in favor of the dataDictionary
     * property
     * @deprecated
     */
    data?: DataDictionary<unknown>;
    /**
     * This is required when data is not provided
     */
    dataDictionary?: DataDictionary<unknown>;
    /**
     * Set the dictionary id, otherwise default to the root
     */
    dictionaryId?: string;
    schemaDictionary: SchemaDictionary;
    historyLimit?: number;
}

/**
 * The message that the message system has been initialized
 */
export interface InitializeMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.initialize;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
    schema: any;
    schemaDictionary: SchemaDictionary;
    historyLimit: number;
}

/**
 * The message to get the data dictionary
 */
export interface GetDataDictionaryMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.get;
}

/**
 * The message that the data dictionary has been given
 */
export interface GetDataDictionaryMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.get;
    dataDictionary: DataDictionary<unknown>;
    activeDictionaryId: string;
}

/**
 * The message that the validation should be updated
 */
export interface UpdateValidationMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.validation;
    action: MessageSystemValidationTypeAction.update;
    dictionaryId: string;
    validationErrors: ValidationError[];
}

/**
 * The message that the validation has been updated
 */
export interface UpdateValidationMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.validation;
    action: MessageSystemValidationTypeAction.update;
    dictionaryId: string;
    validationErrors: ValidationError[];
}

/**
 * The message to get the validation
 */
export interface GetValidationMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.validation;
    action: MessageSystemValidationTypeAction.get;
    dictionaryId: string;
}

/**
 * The message that the validation has been given
 */
export interface GetValidationMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.validation;
    action: MessageSystemValidationTypeAction.get;
    dictionaryId: string;
    validationErrors: ValidationError[];
}

/**
 * The message to get the navigation dictionary
 */
export interface GetNavigationDictionaryMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.get;
}

/**
 * The message that the navigation dictionary has been given
 */
export interface GetNavigationDictionaryMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.get;
    navigationDictionary: NavigationConfigDictionary;
    activeDictionaryId: string;
}

/**
 * The message to update the active id of the data dictionary
 */
export interface UpdateActiveIdDataDictionaryMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message that the active id of the data dictionary has been updated
 */
export interface UpdateActiveIdDataDictionaryMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.dataDictionary;
    action: MessageSystemDataDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message to update the active id of the navigation dictionary
 */
export interface UpdateActiveIdNavigationDictionaryMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message that the active id of the navigation dictionary has been updated
 */
export interface UpdateActiveIdNavigationDictionaryMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.navigationDictionary;
    action: MessageSystemNavigationDictionaryTypeAction.updateActiveId;
    activeDictionaryId: string;
}

/**
 * The message to update data
 */
export interface UpdateDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.update;
    /**
     * Dictionary ID to use if it is different from the current
     * active dictionary ID
     */
    dictionaryId?: string;
    dataLocation: string;
    data: unknown;
}

/**
 * The message that the data has been updated
 */
export interface UpdateDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.update;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
}

/**
 * The message to add a linked data
 */
export interface AddLinkedDataDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.addLinkedData;
    /**
     * Dictionary ID to use if it is different from the current
     * active dictionary ID
     */
    dictionaryId?: string;
    /**
     * The index to insert the linked data to, if this is not provided
     * the linked data will be added to the end of the list
     */
    index?: number;
    dataLocation: string;
    linkedData: Array<Data<unknown>>;
}

/**
 * The message that linked data has been added
 */
export interface AddLinkedDataDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.addLinkedData;
    dictionaryId: string; // dictionary id that the linked data was added to
    linkedDataIds: LinkedData[]; // the linked data
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
}

/**
 * The message to remove linked data
 */
export interface RemoveLinkedDataDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
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
export interface RemoveLinkedDataDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.removeLinkedData;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
    /**
     * An array of linked data ids that were removed from
     * the data dictionary
     */
    linkedDataIds: string[];
}

/**
 * The message to reorder linked data
 */
export interface ReorderLinkedDataDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.reorderLinkedData;
    dataLocation: string;
    linkedData: LinkedData[];
}

/**
 * The message that linked data has been reordered
 */
export interface ReorderLinkedDataDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.reorderLinkedData;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
}

/**
 * The message to duplicate data
 */
export interface DuplicateDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.duplicate;
    sourceDataLocation: string;
}

/**
 * The message that the data has been duplicated
 * with updated data
 */
export interface DuplicateDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.duplicate;
    sourceDataLocation: string;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
}

/**
 * The message to remove data
 */
export interface RemoveDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.remove;
    dataLocation: string;
}

/**
 * The message that the data has been removed
 * with updated data
 */
export interface RemoveDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.remove;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
}

/**
 * The message to add data
 */
export interface AddDataMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
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
export interface AddDataMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.add;
    data: unknown;
    dataDictionary: DataDictionary<unknown>;
    navigation: NavigationConfig;
    navigationDictionary: NavigationConfigDictionary;
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
export interface UpdateNavigationMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
}

/**
 * The message that the navigation has been updated
 */
export interface UpdateNavigationMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.update;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
}

/**
 * The message to get navigation
 */
export interface GetNavigationMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.get;
}

/**
 * The message that the navigation has been given
 */
export interface GetNavigationMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.navigation;
    action: MessageSystemNavigationTypeAction.get;
    activeDictionaryId: string;
    activeNavigationConfigId: string;
    navigation: NavigationConfig;
}

/**
 * The message to get history
 */
export interface GetHistoryMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.history;
    action: MessageSystemHistoryTypeAction.get;
}

/**
 * The message that the history has been given
 */
export interface GetHistoryMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.history;
    action: MessageSystemHistoryTypeAction.get;
    history: History;
}

/**
 * The message to add schemas to the schema dictionary
 */
export interface AddSchemaDictionaryMessageIncoming<TConfig = {}>
    extends ArbitraryMessageIncoming<TConfig> {
    type: MessageSystemType.schemaDictionary;
    action: MessageSystemSchemaDictionaryTypeAction.add;
    schemas: any[];
}

/**
 * The message that schemas have been added to the schema dictionary
 */
export interface AddSchemaDictionaryMessageOutgoing<TConfig = {}>
    extends ArbitraryMessageOutgoing<TConfig> {
    type: MessageSystemType.schemaDictionary;
    action: MessageSystemSchemaDictionaryTypeAction.add;
    schemaDictionary: SchemaDictionary;
}

export interface CustomMessageIncomingOutgoing<OConfig>
    extends ArbitraryMessageIncoming<OConfig> {
    type: MessageSystemType.custom;
}

/**
 * The custom message interface
 */
export type CustomMessage<T, OConfig> = CustomMessageIncomingOutgoing<OConfig> & T;

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
 * Incoming validation messages to the message system
 */
export type ValidationMessageIncoming =
    | UpdateValidationMessageIncoming
    | GetValidationMessageIncoming;

/**
 * Outgoing validation messages to the message system
 */
export type ValidationMessageOutgoing =
    | UpdateValidationMessageOutgoing
    | GetValidationMessageOutgoing;

/**
 * Incoming history messages to the message system
 */
export type HistoryMessageIncoming = GetHistoryMessageIncoming;

/**
 * Outgoing history messages from the message system
 */
export type HistoryMessageOutgoing = GetHistoryMessageOutgoing;

/**
 * Incoming schema dictionary messages to the message system
 */
export type SchemaDictionaryMessageIncoming = AddSchemaDictionaryMessageIncoming;

/**
 * Outgoing schema dictionary messages from the message system
 */
export type SchemaDictionaryMessageOutgoing = AddSchemaDictionaryMessageOutgoing;

/**
 * Incoming messages to the message system
 */
export type MessageSystemIncoming<C = {}, OConfig = {}> =
    | InitializeMessageIncoming
    | DataMessageIncoming
    | HistoryMessageIncoming
    | SchemaDictionaryMessageIncoming
    | NavigationMessageIncoming
    | NavigationDictionaryMessageIncoming
    | DataDictionaryMessageIncoming
    | ValidationMessageIncoming
    | CustomMessage<C, OConfig>;

/**
 * Outgoing messages from the message system
 */
export type MessageSystemOutgoing<C = {}, OConfig = {}> =
    | InitializeMessageOutgoing
    | DataMessageOutgoing
    | HistoryMessageOutgoing
    | SchemaDictionaryMessageOutgoing
    | NavigationMessageOutgoing
    | NavigationDictionaryMessageOutgoing
    | DataDictionaryMessageOutgoing
    | ValidationMessageOutgoing
    | CustomMessage<C, OConfig>;
