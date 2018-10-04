import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { ISubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTSubheading, {
    ISubheadingHandledProps as IMSFTSubheadingHandledProps,
    ISubheadingManagedClasses,
    ISubheadingUnhandledProps,
    SubheadingProps as MSFTSubheadingProps,
    SubheadingSize,
    SubheadingTag

} from "./subheading";
import manageJss, { IManagedJSSProps, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, SubheadingStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Subheading = manageJss(SubheadingStyles)(MSFTSubheading);
type Subheading = InstanceType<typeof MSFTSubheading>;

interface ISubheadingHandledProps extends Subtract<IMSFTSubheadingHandledProps, ISubheadingManagedClasses> {}
type SubheadingProps = ManagedJSSProps<MSFTSubheadingProps, ISubheadingClassNameContract, IDesignSystem>;

export {
    Subheading,
    SubheadingSize,
    SubheadingTag,
    SubheadingProps,
    ISubheadingHandledProps,
    ISubheadingUnhandledProps,
    ISubheadingClassNameContract
};
