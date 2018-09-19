import * as React from "react";
import {
    IFoundationProps,
    ILabelClassNameContract,
    ILabelHandledProps,
    ILabelUnhandledProps,
    Label as BaseLabel
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, LabelStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Label = manageJss(LabelStyles)(BaseLabel);
type Label = InstanceType<typeof Label>;

export { Label };
