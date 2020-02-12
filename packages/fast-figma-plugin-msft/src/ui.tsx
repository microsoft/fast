import React from "react";
import ReactDOM from "react-dom";
import { PluginUI, PluginUIProps } from "./core/ui";
import { UIMessage } from "./core/messaging";

/**
 * Dispatches a UI message to the host
 * @param message The message to dispatch
 */
function dispatchMessage(message: UIMessage): void {
    parent.postMessage({ pluginMessage: message }, "*");
}

function render(props?: PluginUIProps): void {
    ReactDOM.render(<PluginUI {...props} dispatch={dispatchMessage} />, root);
}

// Import with require so the dependency doesn't get tree-shaken
// tslint:disable-next-line
const styles = require("./global.css");

/**
 * Create root element
 */
const root: HTMLDivElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

/**
 * Wire iframe's onmessage to render function
 */
window.onmessage = (e: any): void => {
    render(e.data.pluginMessage);
};

// Render UI
render();
