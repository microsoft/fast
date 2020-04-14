import React from "react";
import ModularForm from "./form";
import {
    ControlConfig,
    ControlTemplateUtilities,
    ControlType,
    StandardControlPlugin,
} from "./templates";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const Form: React.FC<any> = (props: React.PropsWithChildren<any>): React.ReactElement => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ModularForm {...props} />
        </DndProvider>
    );
};

export * from "./custom-controls";
export * from "./controls";
export {
    ControlConfig,
    ControlType,
    Form,
    ModularForm,
    StandardControlPlugin,
    ControlTemplateUtilities,
};
