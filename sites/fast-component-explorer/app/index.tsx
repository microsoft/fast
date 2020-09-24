import React from "react";
import ReactDOM from "react-dom";
import HTML5Backend from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import App from "./app";
/* eslint-disable-next-line */
const styles = require("./css/style.css");

/**
 * Create the root node
 */
ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <App />
    </DndProvider>,
    document.getElementById("root")
);
