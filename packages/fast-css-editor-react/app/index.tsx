import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);
document.body.setAttribute("style", "margin: 0");

/* tslint:disable */
function render(): void {
    ReactDOM.render(<App />, root);
}

render();
