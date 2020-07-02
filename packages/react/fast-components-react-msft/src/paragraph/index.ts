import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { ParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ParagraphStyles } from "@microsoft/fast-components-styles-msft";
import paragraphSchema from "./paragraph.schema";
import paragraphSchema2 from "./paragraph.schema.2";
import MSFTParagraph, {
    ParagraphHandledProps as MSFTParagraphHandledProps,
    ParagraphProps as MSFTParagraphProps,
    ParagraphManagedClasses,
    ParagraphSize,
    ParagraphUnhandledProps,
} from "./paragraph";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Paragraph = manageJss(ParagraphStyles)(MSFTParagraph);
type Paragraph = InstanceType<typeof Paragraph>;

type ParagraphHandledProps = Subtract<MSFTParagraphHandledProps, ParagraphManagedClasses>;
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
    paragraphSchema,
    paragraphSchema2,
    ParagraphUnhandledProps,
    ParagraphClassNameContract,
};
