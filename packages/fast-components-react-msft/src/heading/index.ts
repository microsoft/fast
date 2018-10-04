import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { IHeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTHeading, {
    HeadingAlignBaseline,
    HeadingProps as MSFTHeadingProps,
    HeadingSize,
    HeadingTag,
    IHeadingHandledProps as IMSFTHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading";
import manageJss, { IManagedJSSProps, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { HeadingStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Heading = manageJss(HeadingStyles)(MSFTHeading);
type Heading = InstanceType<typeof Heading>;

interface IHeadingHandledProps extends Subtract<IMSFTHeadingHandledProps, IHeadingManagedClasses> {}
type HeadingProps = ManagedJSSProps<MSFTHeadingProps, IHeadingClassNameContract, IDesignSystem>;

export {
    HeadingAlignBaseline,
    Heading,
    HeadingProps,
    HeadingSize,
    HeadingTag,
    IHeadingClassNameContract,
    IHeadingHandledProps,
    IHeadingUnhandledProps
};
