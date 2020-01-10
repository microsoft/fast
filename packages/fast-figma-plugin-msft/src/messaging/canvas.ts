import { PluginMessageData } from "./common";

/**
 * Data interface, action creator, and ID for informing
 * the UI about the type of node currently selected
 */

export interface SetActiveNodeTypeEvent
    extends PluginMessageData<typeof SET_ACTIVE_NODE_TYPE> {
    value: NodeType;
}
export const SET_ACTIVE_NODE_TYPE = "CANVAS_EVENT_SET_ACTIVE_NODE_TYPE";
export function setActiveNodeTypeCreator(value: NodeType): string {
    return JSON.stringify({
        type: SET_ACTIVE_NODE_TYPE,
        value,
    });
}
export function isSetActiveNodeType(
    data: PluginMessageData<any>
): data is SetActiveNodeTypeEvent {
    return data.type === SET_ACTIVE_NODE_TYPE;
}
