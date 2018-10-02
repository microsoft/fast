import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTSubheading, {
    ISubheadingHandledProps,
    ISubheadingUnhandledProps,
    SubheadingLevel,
    SubheadingTag
} from "./subheading";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, SubheadingStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Subheading = manageJss(SubheadingStyles)(MSFTSubheading);
type Subheading = InstanceType<typeof MSFTSubheading>;

export { Subheading };
export * from "./subheading";
