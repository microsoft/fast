import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { HeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTHeading, {
    HeadingAlignBaseline,
    HeadingHandledProps as MSFTHeadingHandledProps,
    HeadingManagedClasses,
    HeadingProps as MSFTHeadingProps,
    HeadingSize,
    HeadingTag,
    HeadingUnhandledProps,
} from "./heading";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, HeadingStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Heading = manageJss(HeadingStyles)(MSFTHeading);
type Heading = typeof Heading;

interface HeadingHandledProps
    extends Subtract<MSFTHeadingHandledProps, HeadingManagedClasses> {}
type HeadingProps = ManagedJSSProps<
    MSFTHeadingProps,
    HeadingClassNameContract,
    DesignSystem
>;

export {
    HeadingAlignBaseline,
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag,
    HeadingClassNameContract,
    HeadingHandledProps,
    HeadingUnhandledProps,
};
