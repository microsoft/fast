import * as React from "react";
import {
    Hypertext as BaseHypertext,
    HypertextProps as BaseHypertextProps,
    IHypertextClassNameContract,
    IHypertextHandledProps as IBaseHypertextHandledProps,
    IHypertextManagedClasses,
    IHypertextUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IManagedJSSProps, ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { HypertextStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Hypertext = manageJss(HypertextStyles)(BaseHypertext);
type Hypertext = InstanceType<typeof Hypertext>;

interface IHypertextHandledProps extends Subtract<IBaseHypertextHandledProps, IHypertextManagedClasses> {}
type HypertextProps = ManagedJSSProps<BaseHypertextProps, IHypertextClassNameContract, IDesignSystem>;

export {
    Hypertext,
    HypertextProps,
    IHypertextHandledProps,
    IHypertextUnhandledProps,
    IHypertextClassNameContract
};
