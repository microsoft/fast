import React from "react";
import ReactDOM from "react-dom";
import { PluginUI } from "./core/ui";
/* eslint-disable */
const styles = require("./global.css");
/* eslint-enable */
/**
 * Dispatches a UI message to the host
 * @param message The message to dispatch
 */
function dispatchMessage(message) {
    parent.postMessage({ pluginMessage: message }, "*");
}
const root = document.querySelector("fast-design-system-provider");
function render(props) {
    ReactDOM.render(<PluginUI {...props} dispatch={dispatchMessage} />, root);
}
/**
 * Wire iframe's onmessage to render function
 */
window.onmessage = e => {
    render(e.data.pluginMessage);
};
// Render UI
render();
