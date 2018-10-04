import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTParagraph, {
    IParagraphHandledProps as IMSFTParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphProps as MSFTParagraphProps,
    ParagraphSize
} from "./paragraph";
import manageJss, { IManagedJSSProps, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ParagraphStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Paragraph = manageJss(ParagraphStyles)(MSFTParagraph);
type Paragraph = InstanceType<typeof Paragraph>;

interface IParagraphHandledProps extends Subtract<IMSFTParagraphHandledProps, IParagraphManagedClasses> {}
type ParagraphProps = ManagedJSSProps<MSFTParagraphProps, IParagraphClassNameContract, IDesignSystem>;

export {
    Paragraph,
    ParagraphSize,
    ParagraphProps,
    IParagraphHandledProps,
    IParagraphUnhandledProps,
    IParagraphClassNameContract
};
