import { DataType } from "../data-utilities/types";

export enum MessageSystemComponentTypeAction {
    register = "register",
    deregister = "deregister",
}

export enum MessageSystemDataTypeAction {
    update = "update",
    remove = "remove",
    add = "add",
    duplicate = "duplicate",
}

export enum MessageSystemType {
    component = "component",
    data = "data",
    initialize = "initialize",
}

export enum MessageSystemSubscriptionType {
    data = "data",
}

/**
 * Initializing with data
 */
export interface InitializeMessageIncoming {
    type: MessageSystemType.initialize;
    data: any;
}

/**
 * The message that the message system has been initialized
 */
export interface InitializeMessageOutgoing {
    type: MessageSystemType.initialize;
    data: any;
}

/**
 * Subscription to messages
 */
export interface MessageSystemSubscription {
    type: MessageSystemSubscriptionType;
    actions: MessageSystemDataTypeAction[];
}

/**
 * The message to register a component
 */
export interface RegisterComponentIncoming {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.register;
    subscribe: MessageSystemSubscription[];
    id: string;
}

/**
 * The message to deregister a component
 */
export interface DeregisterComponentIncoming {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.deregister;
    id: string;
}

/**
 * The message that the component has been registered
 */
export interface RegisterComponentMessageOutgoing {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.register;
    id: string;
}

/**
 * The message that the component has been deregistered
 */
export interface DeregisterComponentMessageOutgoing {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.deregister;
    id: string;
}

export type ComponentMessageIncoming =
    | RegisterComponentIncoming
    | DeregisterComponentIncoming;

/**
 * The message to update data
 */
export interface UpdateDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.update;
    sourceDataLocation: string;
    targetDataLocation: string;
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
}

/**
 * The message to remove data
 */
export interface RemoveDataMessageIncoming {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.remove;
    dataLocation: string;
    data: unknown;
}

/**
 * The message that the data has been removed
 * with updated data
 */
export interface RemoveDataMessageOutgoing {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.remove;
    data: unknown;
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
}

/**
 * Incoming data messages to the message system
 */
export type DataMessageIncoming =
    | UpdateDataMessageIncoming
    | DuplicateDataMessageIncoming
    | RemoveDataMessageIncoming
    | AddDataMessageIncoming;

/**
 * Incoming messages to the message system
 */
export type MessageSystemIncoming =
    | InitializeMessageIncoming
    | ComponentMessageIncoming
    | DataMessageIncoming;

/**
 * Outgoing messages from the message system
 */
export type MessageSystemOutgoing =
    | RegisterComponentMessageOutgoing
    | DeregisterComponentMessageOutgoing
    | DuplicateDataMessageOutgoing
    | RemoveDataMessageOutgoing
    | AddDataMessageOutgoing;
