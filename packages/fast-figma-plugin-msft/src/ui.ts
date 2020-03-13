import { ThemeDesigner } from "./core/ui/theme-designer";
import { PluginUI, PluginUIProps } from "./core/ui";
import { UIMessage } from "./core/messaging";
import { FASTDesignSystemProvider } from "@microsoft/fast-components";

// tslint:disable
const styles = require("./global.css");
ThemeDesigner;
FASTDesignSystemProvider;
// tslint:enable
/**
 * Dispatches a UI message to the host
 * @param message The message to dispatch
 */
function dispatchMessage(message: UIMessage): void {
    parent.postMessage({ pluginMessage: message }, "*");
}

const root = document.querySelector("theme-designer");

if (root instanceof ThemeDesigner) {
    root.dispatchMessage = dispatchMessage;

    /**
     * Wire iframe's onmessage to render function
     */
    window.onmessage = (e: any): void => {
        const { selectedNodes, recipeOptions } = e.data.pluginMessage;

        root.selectedNodes = selectedNodes;
        root.recipeOptions = recipeOptions;
    };
}
