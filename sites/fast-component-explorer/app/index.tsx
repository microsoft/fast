import { fastAnchor } from "@microsoft/fast-components";
import { DesignSystem } from "@microsoft/fast-foundation";
import React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import ReactDOM from "react-dom";
import App from "./app";
/* eslint-disable-next-line */
const styles = require("@microsoft/site-utilities/src/components/editor/editor.style.css");

DesignSystem.getOrCreate().register(fastAnchor());
/**
 * Create the root node
 */
ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <App />
    </DndProvider>,
    document.getElementById("root")
);
