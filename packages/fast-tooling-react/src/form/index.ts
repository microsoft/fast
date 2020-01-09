import BareForm from "./form";
import { FormPlugin, FormPluginProps } from "./plugin";
import { ControlConfig, ControlType, StandardControlPlugin } from "./templates";
import { ContextComponent, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const Form: typeof BareForm & ContextComponent<any> = DragDropContext(HTML5Backend)(
    BareForm
);

export * from "./custom-controls";
export * from "./controls";
export {
    ControlConfig,
    ControlType,
    Form,
    BareForm,
    FormPlugin,
    FormPluginProps,
    StandardControlPlugin,
};
