import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { HeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, HeadingStyles } from "@microsoft/fast-components-styles-msft";
import headingSchema from "./heading.schema";
import headingSchema2 from "./heading.schema.2";
import MSFTHeading, {
    HeadingAlignBaseline,
    HeadingManagedClasses,
    HeadingSize,
    HeadingTag,
    HeadingUnhandledProps,
    HeadingHandledProps as MSFTHeadingHandledProps,
    HeadingProps as MSFTHeadingProps,
} from "./heading";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Heading = manageJss(HeadingStyles)(MSFTHeading);
type Heading = InstanceType<typeof Heading>;

type HeadingHandledProps = Subtract<MSFTHeadingHandledProps, HeadingManagedClasses>;
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
    headingSchema,
    headingSchema2,
    HeadingUnhandledProps,
};
