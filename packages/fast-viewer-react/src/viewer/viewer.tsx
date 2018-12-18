import React from "react";
import BaseViewer from "./viewer.base";
import {
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
/* tslint:disable-next-line:typedef */
const Viewer = manageJss(ViewerStyles)(BaseViewer);
type Viewer = InstanceType<typeof Viewer>;

interface ViewerHandledProps
    extends Subtract<BaseViewerHandledProps, ViewerManagedClasses> {}
type ViewerProps = ManagedJSSProps<BaseViewerProps, ViewerClassNameContract, {}>;

export default Viewer;
export { ViewerProps, ViewerClassNameContract, ViewerHandledProps, ViewerUnhandledProps };
