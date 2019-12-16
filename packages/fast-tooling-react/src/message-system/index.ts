/// <reference lib="webworker" />

import {
    AddDataMessageOutgoing,
    ComponentMessageIncoming,
    DataMessageIncoming,
    DeregisterComponentMessageOutgoing,
    DuplicateDataMessageOutgoing,
    InitializeMessageOutgoing,
    MessageSystemComponentTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemIncoming,
    MessageSystemType,
    RegisterComponentMessageOutgoing,
    RemoveDataMessageOutgoing,
} from "./message-system.props";
import { getDataWithDuplicate } from "../data-utilities/duplicate";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
} from "../data-utilities/relocate";

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
                action: MessageSystemComponentTypeAction.register,
                id: data.id,
            } as RegisterComponentMessageOutgoing);
            break;
        case MessageSystemComponentTypeAction.deregister:
            delete registeredComponents[data.id];

            postMessage({
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.deregister,
                id: data.id,
            } as DeregisterComponentMessageOutgoing);
            break;
    }
}

/**
 * Handles all data manipulation messages
 */
function handleDataMessage(data: DataMessageIncoming): void {
    switch (data.action) {
        case MessageSystemDataTypeAction.duplicate:
            dataBlob = getDataWithDuplicate(data.sourceDataLocation, dataBlob);

            postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: data.sourceDataLocation,
                data: dataBlob,
            } as DuplicateDataMessageOutgoing);
            break;
        case MessageSystemDataTypeAction.remove:
            dataBlob = getDataUpdatedWithoutSourceData({
                sourceDataLocation: data.dataLocation,
                data,
            });

            postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                data: dataBlob,
            } as RemoveDataMessageOutgoing);
            break;
        case MessageSystemDataTypeAction.add:
            dataBlob = getDataUpdatedWithSourceData({
                targetDataLocation: data.dataLocation,
                targetDataType: data.dataType,
                sourceData: data.data,
                data: dataBlob,
            });

            postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                data: dataBlob,
            } as AddDataMessageOutgoing);
            break;
    }
}
