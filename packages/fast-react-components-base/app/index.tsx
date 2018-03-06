import * as React from "react";
import * as ReactDOM from "react-dom";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

function render(): void {
    ReactDOM.render(
        <h1>Hello world</h1>,
        root
    );
}

render();
