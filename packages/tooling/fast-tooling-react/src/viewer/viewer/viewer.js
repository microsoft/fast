import { Viewer as BaseViewer } from "./viewer.base";
import { ViewerCustomAction } from "./viewer.props";
import manageJss from "@microsoft/fast-jss-manager-react";
import ViewerStyles from "./viewer.style";
/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Viewer = manageJss(ViewerStyles)(BaseViewer);
export {
    Viewer,
    // When drag and drop becomes available for this component,
    // this export should not include the wrapped DndProvider from react-dnd
    // as it is intended to work with the other Modular prefixed components
    // See: https://github.com/microsoft/fast/issues/2774
    Viewer as ModularViewer,
    ViewerCustomAction,
};
