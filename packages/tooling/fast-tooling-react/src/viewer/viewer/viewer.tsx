import React from "react";
import { Viewer as BaseViewer } from "./viewer.base";
import {
    ViewerCustomAction,
    ViewerHandledProps as BaseViewerHandledProps,
    ViewerManagedClasses,
    ViewerProps as BaseViewerProps,
    ViewerUnhandledProps,
} from "./viewer.props";
import { ViewerClassNameContract } from "./viewer.class-name-contract";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import ViewerStyles from "./viewer.style";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Viewer = manageJss(ViewerStyles)(BaseViewer);
type Viewer = InstanceType<typeof Viewer>;

interface ViewerHandledProps
    extends Subtract<BaseViewerHandledProps, ViewerManagedClasses> {}
type ViewerProps = ManagedJSSProps<BaseViewerProps, ViewerClassNameContract, {}>;

export {
    Viewer,
    // When drag and drop becomes available for this component,
    // this export should not include the wrapped DndProvider from react-dnd
    // as it is intended to work with the other Modular prefixed components
    // See: https://github.com/microsoft/fast/issues/2774
    Viewer as ModularViewer,
    ViewerCustomAction,
    ViewerProps,
    ViewerClassNameContract,
    ViewerHandledProps,
    ViewerUnhandledProps,
};
