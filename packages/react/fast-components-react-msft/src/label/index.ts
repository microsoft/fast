import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Label as BaseLabel,
    LabelHandledProps as BaseLabelHandledProps,
    LabelProps as BaseLabelProps,
    LabelClassNameContract,
    LabelManagedClasses,
    LabelTag,
    LabelUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, LabelStyles } from "@microsoft/fast-components-styles-msft";
import labelSchema from "./label.schema";
import labelSchema2 from "./label.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Label = manageJss(LabelStyles)(BaseLabel);
type Label = InstanceType<typeof Label>;

type LabelHandledProps = Subtract<BaseLabelHandledProps, LabelManagedClasses>;
type LabelProps = ManagedJSSProps<BaseLabelProps, LabelClassNameContract, DesignSystem>;

export {
    LabelClassNameContract,
    LabelHandledProps,
    LabelUnhandledProps,
    Label,
    LabelProps,
    labelSchema,
    labelSchema2,
    LabelTag,
};
