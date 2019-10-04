import BareForm from "./form";
import { FormPlugin, FormPluginProps } from "./plugin";
import { ContextComponent, DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const Form: typeof BareForm & ContextComponent<any> = DragDropContext(HTML5Backend)(
    BareForm
);

export { Form, BareForm, FormPlugin, FormPluginProps };
