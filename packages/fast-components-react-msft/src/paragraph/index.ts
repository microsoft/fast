import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { ParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTParagraph, {
    ParagraphHandledProps as MSFTParagraphHandledProps,
    ParagraphManagedClasses,
    ParagraphProps as MSFTParagraphProps,
    ParagraphSize,
    ParagraphUnhandledProps,
} from "./paragraph";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ParagraphStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Paragraph = manageJss(ParagraphStyles)(MSFTParagraph);
type Paragraph = InstanceType<typeof Paragraph>;

interface ParagraphHandledProps
    extends Subtract<MSFTParagraphHandledProps, ParagraphManagedClasses> {}
type ParagraphProps = ManagedJSSProps<
    MSFTParagraphProps,
    ParagraphClassNameContract,
    DesignSystem
>;

export {
    Paragraph,
    ParagraphSize,
    ParagraphProps,
    ParagraphHandledProps,
    ParagraphUnhandledProps,
    ParagraphClassNameContract,
};
