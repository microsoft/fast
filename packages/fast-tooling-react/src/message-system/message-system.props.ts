export enum MessageSystemComponentTypeAction {
    register = "register",
    deregister = "deregister",
}

export enum MessageSystemDataTypeAction {
    update = "update",
    move = "move",
    duplicate = "duplicate",
}

export enum MessageSystemType {
    component = "component",
    data = "data",
}

export enum MessageSystemSubscriptionType {
    data = "data",
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
export interface MessageSystemRegisterComponent {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.register;
    subscribe: MessageSystemSubscription[];
    id: string;
}

/**
 * The message to deregister a component
 */
export interface MessageSystemDeregisterComponent {
    type: MessageSystemType.component;
    action: MessageSystemComponentTypeAction.deregister;
    id: string;
}

export type MessageSystemComponentType =
    | MessageSystemRegisterComponent
    | MessageSystemDeregisterComponent;

/**
 * The message to update data
 */
export interface MessageSystemUpdateData {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.update;
    sourceDataLocation: string;
    targetDataLocation: string;
}

/**
 * The message to duplicate data
 */
export interface MessageSystemDuplicateData {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.duplicate;
    sourceDataLocation: string;
}

/**
 * The message to move data to a new location
 */
export interface MessageSystemMoveData {
    type: MessageSystemType.data;
    action: MessageSystemDataTypeAction.move;
    sourceDataLocation: string;
    value: unknown;
}

export type MessageSystemData =
    | MessageSystemRegisterComponent
    | MessageSystemDeregisterComponent
    | MessageSystemUpdateData
    | MessageSystemDuplicateData
    | MessageSystemMoveData;
