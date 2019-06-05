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
document.body.setAttribute("style", "margin: 0");

const DragDropApp: any = DragDropContext(HTML5Backend)(App);

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(<DragDropApp />, document.getElementById("root"));
