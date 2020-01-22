import { PluginData } from "../plugin-data";
import { PluginMessageData } from "./common";

/**
 * Message utilities for setting UI state from the main application
 */
export const SET_FILL_RECIPE: "UI_EVENT_SET_FILL_RECIPE" = "UI_EVENT_SET_FILL_RECIPE";
export const SET_STROKE_RECIPE: "UI_EVENT_SET_STROKE_RECIPE" =
    "UI_EVENT_SET_STROKE_RECIPE";
export const SET_TEXT_FILL_RECIPE: "UI_EVENT_SET_TEXT_FILL_RECIPE" =
    "UI_EVENT_SET_TEXT_FILL_RECIPE";

export interface SetFillRecipeData extends PluginMessageData<typeof SET_FILL_RECIPE> {
    value: PluginData["backgroundFill"];
}
export interface SetTextFillRecipeData
    extends PluginMessageData<typeof SET_TEXT_FILL_RECIPE> {
    value: PluginData["textFill"];
}
export interface SetStrokeRecipeData extends PluginMessageData<typeof SET_STROKE_RECIPE> {
    value: PluginData["strokeFill"];
}
