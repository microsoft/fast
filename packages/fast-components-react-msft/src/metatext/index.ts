import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import { IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import Metatext, {
    IMetatextHandledProps,
    IMetatextManagedClasses,
    IMetatextUnhandledProps,
    MetatextTag
} from "./metatext";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, MetatextStyles } from "@microsoft/fast-components-styles-msft";

export default manageJss(MetatextStyles)(Metatext);
export * from "./metatext";
