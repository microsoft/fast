import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-react-base";
import { IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTMetatext, {
    IMetatextHandledProps,
    IMetatextManagedClasses,
    IMetatextUnhandledProps,
    MetatextTag
} from "./metatext";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, MetatextStyles } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Metatext = manageJss(MetatextStyles)(MSFTMetatext);
type Metatext = InstanceType<typeof Metatext>;
export { Metatext };
export * from "./metatext";
