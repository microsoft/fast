import React from "react";
import { ViewerContent as BaseViewerContent } from "./viewer-content.base";
import {
    ViewerContentHandledProps as BaseViewerContentHandledProps,
    ViewerContentManagedClasses,
    ViewerContentProps as BaseViewerContentProps,
    ViewerContentUnhandledProps,
} from "./viewer-content.props";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import ViewerContentStyles from "./viewer-content.style";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const ViewerContent = manageJss(ViewerContentStyles)(BaseViewerContent);
type ViewerContent = InstanceType<typeof ViewerContent>;

interface ViewerContentHandledProps
    extends Subtract<BaseViewerContentHandledProps, ViewerContentManagedClasses> {}
type ViewerContentProps = ManagedJSSProps<BaseViewerContentProps, {}, {}>;

export {
    ViewerContent,
    ViewerContentProps,
    ViewerContentHandledProps,
    ViewerContentUnhandledProps,
};
