import { isUndefined } from "lodash-es";

// Expand uppon the browser's MessageEvent object to define
// align to Figma
export interface PluginMessageEvent extends MessageEvent {
    data: {
        pluginMessage: any; // TODO can we type this better?
        pluginId: string;
    };
}

// Assert the MessageEvent is a PluginMessageEvent
export function isPluginMessageEvent(
    e: MessageEvent | PluginMessageEvent
): e is PluginMessageEvent {
    return (
        e && e.data && !isUndefined(e.data.pluginMessage) && !isUndefined(e.data.pluginId)
    );
}
