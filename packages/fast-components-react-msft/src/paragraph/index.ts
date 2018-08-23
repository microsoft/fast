import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import { IParagraphClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Paragraph, {
    IParagraphHandledProps,
    IParagraphManagedClasses,
    IParagraphUnhandledProps,
    ParagraphLevel
} from "./paragraph";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ParagraphStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(ParagraphStyles)(Paragraph);
export * from "./paragraph";
