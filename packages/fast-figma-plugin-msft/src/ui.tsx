/**
 * to communicate with the parent script.
 */
import React from "react";
import ReactDOM from "react-dom";
import { PluginUI } from "./interface/plugin-ui";

// Import with require so the dependency doesn't get tree-shaken
// tslint:disable-next-line
const styles = require("./global.css");

const root: HTMLDivElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

// Render UI
ReactDOM.render(<PluginUI />, root);
