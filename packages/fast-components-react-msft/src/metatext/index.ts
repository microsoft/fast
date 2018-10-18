import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { MetatextClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import MSFTMetatext, {
    MetatextHandledProps as MSFTMetatextHandledProps,
    MetatextManagedClasses,
    MetatextProps as MSFTMetatextProps,
    MetatextTag,
    MetatextUnhandledProps
} from "./metatext";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, MetatextStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Metatext = manageJss(MetatextStyles)(MSFTMetatext);
type Metatext = typeof Metatext;

interface MetatextHandledProps
    extends Subtract<MSFTMetatextHandledProps, MetatextManagedClasses> {}
type MetatextProps = ManagedJSSProps<
    MSFTMetatextProps,
    MetatextClassNameContract,
    DesignSystem
>;

export {
    Metatext,
    MetatextTag,
    MetatextProps,
    MetatextHandledProps,
    MetatextUnhandledProps,
    MetatextClassNameContract
};
