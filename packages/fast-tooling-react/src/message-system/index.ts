/// <reference lib="webworker" />

import {
    ComponentMessageIncoming,
    DataMessageIncoming,
    DeregisterComponentMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystemComponentTypeAction,
    MessageSystemIncoming,
    MessageSystemType,
    RegisterComponentMessageOutgoing,
} from "./message-system.props";

/**
 * This is the Message System, through which:
 * - Components may opt in/out of the messages
 * - Data manipulation may be performed
 *
 * The main purpose of this is to tie together
 * process heavy actions onto a separate thread,
 * as well as to allow components to opt into a
 * single source for data updates.
 */

const registeredComponents: object = {};
let dataBlob: any = {};

onmessage = function(e: MessageEvent): void {
    switch ((e.data as MessageSystemIncoming).type) {
        case MessageSystemType.component:
            handleComponentMessage(e.data);
            break;
        case MessageSystemType.data:
            handleDataMessage(e.data);
            break;
        case MessageSystemType.initialize:
            dataBlob = e.data.data;

            postMessage({
                type: MessageSystemType.initialize,
                data: e.data.data,
            } as InitializeMessageOutgoing);
    }
};

/**
 * Handles all component related messages
 */
function handleComponentMessage(data: ComponentMessageIncoming): void {
    switch (data.action) {
        case MessageSystemComponentTypeAction.register:
            registeredComponents[data.id] = {
                self: data.id,
            };

            postMessage({
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.registered,
                id: data.id,
            } as RegisterComponentMessageOutgoing);
            break;
        case MessageSystemComponentTypeAction.deregister:
            delete registeredComponents[data.id];

            postMessage({
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.deregistered,
                id: data.id,
            } as DeregisterComponentMessageOutgoing);
            break;
    }
}

/**
 * Handles all data manipulation messages
 */
function handleDataMessage(data: DataMessageIncoming): void {
    // TODO: update data
}
