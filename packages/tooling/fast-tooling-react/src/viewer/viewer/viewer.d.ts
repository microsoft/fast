import React from "react";
import {
    ViewerCustomAction,
    ViewerHandledProps as BaseViewerHandledProps,
    ViewerManagedClasses,
    ViewerProps as BaseViewerProps,
    ViewerUnhandledProps,
} from "./viewer.props";
import { ViewerClassNameContract } from "./viewer.class-name-contract";
import { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
declare const Viewer: React.ComponentClass<
    ManagedJSSProps<unknown, ViewerClassNameContract, {}>,
    any
>;
declare type Viewer = InstanceType<typeof Viewer>;
interface ViewerHandledProps
    extends Omit<BaseViewerHandledProps, keyof ViewerManagedClasses> {}
declare type ViewerProps = ManagedJSSProps<BaseViewerProps, ViewerClassNameContract, {}>;
export {
    Viewer,
    Viewer as ModularViewer,
    ViewerCustomAction,
    ViewerProps,
    ViewerClassNameContract,
    ViewerHandledProps,
    ViewerUnhandledProps,
};
