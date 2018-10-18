import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Label as BaseLabel,
    LabelClassNameContract,
    LabelHandledProps as BaseLabelHandledProps,
    LabelManagedClasses,
    LabelProps as BaseLabelProps,
    LabelTag,
    LabelUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, LabelStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Label = manageJss(LabelStyles)(BaseLabel);
type Label = typeof Label;

interface LabelHandledProps
    extends Subtract<BaseLabelHandledProps, LabelManagedClasses> {}
type LabelProps = ManagedJSSProps<BaseLabelProps, LabelClassNameContract, DesignSystem>;

export {
    LabelClassNameContract,
    LabelHandledProps,
    LabelUnhandledProps,
    Label,
    LabelProps,
    LabelTag
};
