import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import { IMetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTMetatext, {
    IMetatextHandledProps as IMSFTMetatextHandledProps,
    IMetatextManagedClasses,
    IMetatextUnhandledProps,
    MetatextProps as MSFTMetatextProps,
    MetatextTag
} from "./metatext";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, MetatextStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Metatext = manageJss(MetatextStyles)(MSFTMetatext);
type Metatext = InstanceType<typeof Metatext>;

interface IMetatextHandledProps extends Subtract<IMSFTMetatextHandledProps, IMetatextManagedClasses> {}
type MetatextProps = JSSManagerProps<MSFTMetatextProps, IMetatextClassNameContract, IDesignSystem>;

export {
    Metatext,
    MetatextTag,
    MetatextProps,
    IMetatextHandledProps,
    IMetatextUnhandledProps,
    IMetatextClassNameContract
};
