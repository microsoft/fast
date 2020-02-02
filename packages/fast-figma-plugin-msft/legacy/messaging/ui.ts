import { PluginMessageData } from "./common";
import { DesignSystem } from "@microsoft/fast-components-styles-msft";

/**
 * Message utilities for setting UI state from the main application
 */
export const SET_FILL_RECIPE: "UI_EVENT_SET_FILL_RECIPE" = "UI_EVENT_SET_FILL_RECIPE";
export const SET_STROKE_RECIPE: "UI_EVENT_SET_STROKE_RECIPE" =
    "UI_EVENT_SET_STROKE_RECIPE";
export const SET_TEXT_FILL_RECIPE: "UI_EVENT_SET_TEXT_FILL_RECIPE" =
    "UI_EVENT_SET_TEXT_FILL_RECIPE";
export const REMOVE_PLUGIN_DATA: "REMOVE_PLUGIN_DATA" = "REMOVE_PLUGIN_DATA";
export const SET_DESIGN_SYSTEM_PROPERTY: "SET_DESIGN_SYSTEM_PROPERTY" =
    "SET_DESIGN_SYSTEM_PROPERTY";
export const REMOVE_DESIGN_SYSTEM_PROPERTY: "REMOVE_DESIGN_SYSTEM_PROPERTY" =
    "REMOVE_DESIGN_SYSTEM_PROPERTY";

export interface SetRecipeMessage<T extends string> extends PluginMessageData<T> {
    value: string;
}

export interface SetDesignSystemPropertyMessage
    extends PluginMessageData<typeof SET_DESIGN_SYSTEM_PROPERTY> {
    value: { [k in keyof DesignSystem]: DesignSystem[keyof DesignSystem] }; // TODO: this isn't right
}

export interface RemoveDesignSystemPropertyMessage
    extends PluginMessageData<typeof REMOVE_DESIGN_SYSTEM_PROPERTY> {
    value: keyof DesignSystem;
}

export type RemovePluginData = PluginMessageData<typeof REMOVE_PLUGIN_DATA>;

export type UIMessage =
    | SetRecipeMessage<typeof SET_FILL_RECIPE>
    | SetRecipeMessage<typeof SET_STROKE_RECIPE>
    | SetRecipeMessage<typeof SET_TEXT_FILL_RECIPE>
    | SetDesignSystemPropertyMessage
    | RemoveDesignSystemPropertyMessage
    | RemovePluginData;
