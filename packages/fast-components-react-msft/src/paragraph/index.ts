import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import { IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTParagraph, {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphLevel
} from "./paragraph";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ParagraphStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Paragraph = manageJss(ParagraphStyles)(MSFTParagraph);
type Paragraph = InstanceType<typeof Paragraph>;

export { Paragraph };
export * from "./paragraph";
