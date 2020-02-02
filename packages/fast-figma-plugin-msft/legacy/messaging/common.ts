import { isString } from "lodash-es";
/**
 * There are two general types of messages, plugin ui -> Figma document and Figma document -> plugin ui.
 * In this application, events originating from the plugin ui are referred to as UI_EVENTs
 * while events originating in the Figma document are referred to as CANVAS_EVENTs
 *
 * All messages sent by both the canvas and UI implement the BaseEventData structure.
 */

export interface PluginMessageData<T extends string> {
    /**
     * A message sent by either the UI or the Canvas will always contain
     * a type field that is a symbol
     */
    type: T;
}

// Assert the MessageEvent is a PluginMessageEvent
export function isPluginMessageEvent(
    e: MessageEvent | PluginMessageEvent
): e is PluginMessageEvent {
    try {
        return !!(
            e &&
            e.data &&
            isString(e.data.pluginMessage) &&
            isString(e.data.pluginId) &&
            JSON.parse(e.data.pluginMessage)
        );
    } catch (e) {
        return false;
    }
}

/**
 * Extend upon the browser's MessageEvent interface to
 * align to the message structure sent by Figma
 */
export interface PluginMessageEvent extends MessageEvent {
    data: {
        pluginMessage: string; // This is always a string, but our plugin will always send JSON data
        pluginId: string;
    };
}
