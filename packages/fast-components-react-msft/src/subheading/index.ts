import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import Subheading, {
    ISubheadingHandledProps,
    ISubheadingUnhandledProps,
    SubheadingLevel,
    SubheadingTag
} from "./subheading";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, SubheadingStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(SubheadingStyles)(Subheading);
export * from "./subheading";
