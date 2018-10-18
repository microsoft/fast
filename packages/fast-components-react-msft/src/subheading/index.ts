import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTSubheading, {
    SubheadingHandledProps as MSFTSubheadingHandledProps,
    SubheadingManagedClasses,
    SubheadingProps as MSFTSubheadingProps,
    SubheadingSize,
    SubheadingTag,
    SubheadingUnhandledProps,
} from "./subheading";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, SubheadingStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Subheading = manageJss(SubheadingStyles)(MSFTSubheading);
type Subheading = typeof MSFTSubheading;

interface SubheadingHandledProps
    extends Subtract<MSFTSubheadingHandledProps, SubheadingManagedClasses> {}
type SubheadingProps = ManagedJSSProps<
    MSFTSubheadingProps,
    SubheadingClassNameContract,
    DesignSystem
>;

export {
    Subheading,
    SubheadingSize,
    SubheadingTag,
    SubheadingProps,
    SubheadingHandledProps,
    SubheadingUnhandledProps,
    SubheadingClassNameContract,
};
