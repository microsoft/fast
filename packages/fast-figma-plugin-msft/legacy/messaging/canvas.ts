import { PluginMessageData } from "./common";
import { PluginUIState } from "../interface/plugin-ui.state";

/**
 * Message utilities for setting UI state from the main application
 */
export const SET_UI_STATE = "CANVAS_EVENT_SET_UI_STATE";
export interface SetUIStateData extends PluginMessageData<typeof SET_UI_STATE> {
    /**
     * Serializable state data to be parsed and
     * set by the UI component
     */
    value: PluginUIState;
}

export function setUIStateDataMessageCreator(value: PluginUIState): string {
    return JSON.stringify({
        type: SET_UI_STATE,
        value,
    });
}
export function isSetUIStateMessage(
    value: PluginMessageData<any>
): value is SetUIStateData {
    return value.type === SET_UI_STATE;
}
