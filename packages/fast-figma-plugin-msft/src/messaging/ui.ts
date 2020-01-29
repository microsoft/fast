import { PluginMessageData } from "./common";

/**
 * Message utilities for setting UI state from the main application
 */
export const SET_FILL_RECIPE: "UI_EVENT_SET_FILL_RECIPE" = "UI_EVENT_SET_FILL_RECIPE";
export const SET_STROKE_RECIPE: "UI_EVENT_SET_STROKE_RECIPE" =
    "UI_EVENT_SET_STROKE_RECIPE";
export const SET_TEXT_FILL_RECIPE: "UI_EVENT_SET_TEXT_FILL_RECIPE" =
    "UI_EVENT_SET_TEXT_FILL_RECIPE";
export const REMOVE_PLUGIN_DATA: "REMOVE_PLUGIN_DATA" = "REMOVE_PLUGIN_DATA";

export interface SetRecipeMessage<T extends string> extends PluginMessageData<T> {
    value: string;
}

export type RemovePluginData = PluginMessageData<typeof REMOVE_PLUGIN_DATA>;

export type UIMessage =
    | SetRecipeMessage<typeof SET_FILL_RECIPE>
    | SetRecipeMessage<typeof SET_STROKE_RECIPE>
    | SetRecipeMessage<typeof SET_TEXT_FILL_RECIPE>
    | RemovePluginData;
