import React from "react";
import ReactDOM from "react-dom";
import Example from "./example";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

/**
 * Primary render function for app. Called on store updates
 */
ReactDOM.render(
    <DndProvider backend={HTML5Backend}>
        <Example />
    </DndProvider>,
    document.getElementById("root")
);
