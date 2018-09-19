import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import { IHeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTHeading, {
    HeadingSize,
    HeadingTag,
    IHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { HeadingStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Heading = manageJss(HeadingStyles)(MSFTHeading);
type Heading = InstanceType<typeof Heading>;

export { Heading };
export * from "./heading";
