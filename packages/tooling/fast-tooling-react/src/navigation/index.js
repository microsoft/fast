import React from "react";
import ModularNavigation from "./navigation";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
const Navigation = props => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ModularNavigation {...props} />
        </DndProvider>
    );
};
export { ModularNavigation, Navigation };
export * from "./navigation.props";
