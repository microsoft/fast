import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    ILabelClassNameContract,
    ILabelHandledProps as IBaseLabelHandledProps,
    ILabelManagedClasses,
    ILabelUnhandledProps,
    Label as BaseLabel,
    LabelProps as BaseLabelProps,
    LabelTag
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, LabelStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Label = manageJss(LabelStyles)(BaseLabel);
type Label = typeof Label;

interface ILabelHandledProps extends Subtract<IBaseLabelHandledProps, ILabelManagedClasses> {}
type LabelProps = ManagedJSSProps<BaseLabelProps, ILabelClassNameContract, IDesignSystem>;

export {
    ILabelClassNameContract,
    ILabelHandledProps,
    ILabelUnhandledProps,
    Label,
    LabelProps,
    LabelTag
};
