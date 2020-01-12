import { getPluginData } from "./plugin-data";
import { setUIStateDataMessageCreator } from "./messaging/canvas";
import { PluginUIState, PluginUIStateStore } from "./interface/plugin-ui.state";

/**
 * Main plugin file responsible for Figma document manipulation.
 * This file has full access to the Figma API.
 */

const pluginUIStateStore: PluginUIStateStore = new PluginUIStateStore(
    (state: PluginUIState): void => {
        figma.ui.postMessage(setUIStateDataMessageCreator(state));
    }
);

/**
 * Show UI on plugin launch
 */
figma.showUI(__html__);
// Manually trigger selection change flow when UI launches.
onSelectionChange();

/**
 * If plugin is launched and no editable node is selected, all editing UI should be disabled
 * If node is editable, fields should be enabled. If there is a current selection then the
 *    the UI should be set to that by default
 */
figma.on("selectionchange", onSelectionChange);

/**
 * Handles node selection changes.
 */
function onSelectionChange(): void {
    const { selection }: typeof figma.currentPage = figma.currentPage;
    pluginUIStateStore.activeNodeType = selection.length === 1 ? selection[0].type : null;
}
