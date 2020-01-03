import { DataType } from "../data-utilities/types";
import Plugin, { PluginProps } from "./plugin";

export type ComponentsRegisteredBySubscription = {
    [key in MessageSystemAction]: WeakMap<ComponentRegistry, string>
};

export interface ComponentRegistry {
    self: string;
    subscribe: MessageSystemAction[];
}

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

export type MessageSystemAction =
    | MessageSystemComponentTypeAction
    | MessageSystemDataTypeAction;

export enum MessageSystemType {
    component = "component",
    data = "data",
    initialize = "initialize",
}

/**
 * Initializing with data
 */
export interface InitializeMessageIncoming {
    type: MessageSystemType.initialize;
    data: any;
    schema: any;
    plugins: Array<Plugin<PluginProps>>;
}

/**
 * The message that the message system has been initialized
 */
export interface InitializeMessageOutgoing {
    type: MessageSystemType.initialize;
    data: any;
    schema: any;
    plugins: Array<Plugin<PluginProps>>;
}

/**
 * The message to register a component
 */
export interface RegisterComponentIncoming {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.register;
    subscribe: MessageSystemAction[];
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
export interface RegisterComponentOutgoing {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.register;
    registry: string[];
    id: string;
}

/**
 * The message that the component has been deregistered
 */
export interface DeregisterComponentOutgoing {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.deregister;
    registry: string[];
    id: string;
}

/**
 * Incoming component messages to the message system
 */
export type ComponentMessageIncoming =
    | RegisterComponentIncoming
    | DeregisterComponentIncoming;

/**
 * Outgoing component messages to the message system
 */
export type ComponentMessageOutgoing =
    | RegisterComponentOutgoing
    | DeregisterComponentOutgoing;

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
 * Outgoing data messages to the message system
 */
export type DataMessageOutgoing =
    | DuplicateDataMessageOutgoing
    | RemoveDataMessageOutgoing
    | AddDataMessageOutgoing
    | UpdateDataMessageOutgoing;

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
    | InitializeMessageOutgoing
    | ComponentMessageOutgoing
    | DataMessageOutgoing;
