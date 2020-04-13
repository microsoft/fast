import React from "react";
import ReactDOM from "react-dom";
import { FASTDesignSystemProvider } from "@microsoft/fast-components";
import { PluginUI, PluginUIProps } from "./core/ui";
import { UIMessage } from "./core/messaging";

/* eslint-disable */
const styles = require("./global.css");
FASTDesignSystemProvider;
/* eslint-enable */
/**
 * Dispatches a UI message to the host
 * @param message The message to dispatch
 */
function dispatchMessage(message: UIMessage): void {
    parent.postMessage({ pluginMessage: message }, "*");
}

const root = document.querySelector("fast-design-system-provider");

function render(props?: PluginUIProps): void {
    ReactDOM.render(<PluginUI {...props} dispatch={dispatchMessage} />, root);
}

/**
 * Wire iframe's onmessage to render function
 */
window.onmessage = (e: any): void => {
    render(e.data.pluginMessage);
};

// Render UI
render();
