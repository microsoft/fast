import React from "react";
import ReactDOM from "react-dom";
import { AppShell } from "../src/app-shell";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(<AppShell apps={[]} />, root);
}

render();
