import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    TextArea as BaseTextArea,
    TextAreaClassNameContract,
    TextAreaHandledProps as BaseTextAreaHandledProps,
    TextAreaManagedClasses,
    TextAreaProps as BaseTextAreaProps,
    TextAreaUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TextAreaStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TextArea = manageJss(TextAreaStyles)(BaseTextArea);
type TextArea = InstanceType<typeof TextArea>;

interface TextAreaHandledProps
    extends Subtract<BaseTextAreaHandledProps, TextAreaManagedClasses> {}
type TextAreaProps = ManagedJSSProps<
    BaseTextAreaProps,
    TextAreaClassNameContract,
    DesignSystem
>;

export {
    TextAreaClassNameContract,
    TextAreaHandledProps,
    TextAreaUnhandledProps,
    TextArea,
    TextAreaProps,
};
