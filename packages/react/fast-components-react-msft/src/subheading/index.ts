import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { SubheadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, SubheadingStyles } from "@microsoft/fast-components-styles-msft";
import subheadingSchema from "./subheading.schema";
import subheadingSchema2 from "./subheading.schema.2";
import MSFTSubheading, {
    SubheadingHandledProps as MSFTSubheadingHandledProps,
    SubheadingProps as MSFTSubheadingProps,
    SubheadingManagedClasses,
    SubheadingSize,
    SubheadingTag,
    SubheadingUnhandledProps,
} from "./subheading";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Subheading = manageJss(SubheadingStyles)(MSFTSubheading);
type Subheading = InstanceType<typeof MSFTSubheading>;

type SubheadingHandledProps = Subtract<
    MSFTSubheadingHandledProps,
    SubheadingManagedClasses
>;
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
    subheadingSchema,
    subheadingSchema2,
    SubheadingClassNameContract,
};
