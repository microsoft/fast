import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import { IHeadingClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Heading, {
    HeadingLevel,
    HeadingTag,
    IHeadingHandledProps,
    IHeadingManagedClasses,
    IHeadingUnhandledProps
} from "./heading";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { HeadingStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

export default manageJss(HeadingStyles)(Heading);
export * from "./heading";
