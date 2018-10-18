import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(<App />, root);
}

render();
