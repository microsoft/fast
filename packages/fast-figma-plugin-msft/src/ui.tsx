import React from "react";
import ReactDOM from "react-dom";
import { PluginUI, PluginUIProps } from "./core/ui";

function render(props?: PluginUIProps): void {
    console.log("RENDER", props);
    ReactDOM.render(<PluginUI {...props} />, root);
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
