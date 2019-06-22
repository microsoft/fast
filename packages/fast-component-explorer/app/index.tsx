import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";

/**
 * Create the root node
 */
const root: HTMLElement = document.createElement("div");
root.setAttribute("id", "root");
document.body.appendChild(root);

const DragDropApp: any = DragDropContext(HTML5Backend)(App);

function render(): void {
    ReactDOM.render(<DragDropApp />, root);
}

render();
