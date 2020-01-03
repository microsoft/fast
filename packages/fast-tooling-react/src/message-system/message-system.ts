import {
    ComponentMessageIncoming,
    ComponentMessageOutgoing,
    ComponentRegistry,
    ComponentsRegisteredBySubscription,
    DataMessageIncoming,
    DataMessageOutgoing,
    MessageSystemAction,
    MessageSystemComponentTypeAction,
    MessageSystemDataTypeAction,
    MessageSystemIncoming,
    MessageSystemOutgoing,
    MessageSystemType,
} from "./message-system.props";
import { set } from "lodash-es";
import { getDataWithDuplicate } from "../data-utilities/duplicate";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
} from "../data-utilities/relocate";
import Plugin, { PluginProps } from "./plugin";

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

const subscriptions: ComponentsRegisteredBySubscription = {
    [MessageSystemComponentTypeAction.register]: new WeakMap(),
    [MessageSystemComponentTypeAction.deregister]: new WeakMap(),
    [MessageSystemDataTypeAction.add]: new WeakMap(),
    [MessageSystemDataTypeAction.duplicate]: new WeakMap(),
    [MessageSystemDataTypeAction.remove]: new WeakMap(),
    [MessageSystemDataTypeAction.update]: new WeakMap(),
};
const registeredComponents: { [key: string]: ComponentRegistry } = {};
let dataBlob: any = {};
let schema: any = {};
let plugins: Array<Plugin<PluginProps>> = [];

export function getMessage(data: MessageSystemIncoming): MessageSystemOutgoing {
    switch (data.type) {
        case MessageSystemType.component:
            return getComponentMessage(data);
        case MessageSystemType.data:
            return getDataMessage(data);
        case MessageSystemType.initialize:
            dataBlob = data.data;
            schema = data.schema;
            plugins = data.plugins || [];

            return {
                type: MessageSystemType.initialize,
                data: dataBlob,
                schema,
                plugins,
            };
    }
}

/**
 * Handles all component related messages
 */
function getComponentMessage(data: ComponentMessageIncoming): ComponentMessageOutgoing {
    switch (data.action) {
        case MessageSystemComponentTypeAction.register:
            registeredComponents[data.id] = {
                self: data.id,
                subscribe: data.subscribe,
            };
            data.subscribe.forEach((action: MessageSystemAction) => {
                subscriptions[action].set(registeredComponents[data.id], data.id);
            });

            return {
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.register,
                registry: Object.keys(registeredComponents),
                id: data.id,
            };
        case MessageSystemComponentTypeAction.deregister:
            delete registeredComponents[data.id];

            return {
                type: MessageSystemType.component,
                action: MessageSystemComponentTypeAction.deregister,
                registry: Object.keys(registeredComponents),
                id: data.id,
            };
    }
}

/**
 * Handles all data manipulation messages
 */
function getDataMessage(data: DataMessageIncoming): DataMessageOutgoing {
    switch (data.action) {
        case MessageSystemDataTypeAction.duplicate:
            dataBlob = getDataWithDuplicate(data.sourceDataLocation, dataBlob);

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.duplicate,
                sourceDataLocation: data.sourceDataLocation,
                data: dataBlob,
            };
        case MessageSystemDataTypeAction.remove:
            dataBlob = getDataUpdatedWithoutSourceData({
                sourceDataLocation: data.dataLocation,
                data: dataBlob,
            });

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.remove,
                data: dataBlob,
            };
        case MessageSystemDataTypeAction.add:
            dataBlob = getDataUpdatedWithSourceData({
                targetDataLocation: data.dataLocation,
                targetDataType: data.dataType,
                sourceData: data.data,
                data: dataBlob,
            });

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.add,
                data: dataBlob,
            };
        case MessageSystemDataTypeAction.update:
            set(dataBlob, data.dataLocation, data.data);

            return {
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                data: dataBlob,
            };
    }
}
