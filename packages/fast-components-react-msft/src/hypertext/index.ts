import * as React from "react";
import {
    Hypertext as BaseHypertext,
    HypertextClassNameContract,
    HypertextHandledProps as BaseHypertextHandledProps,
    HypertextManagedClasses,
    HypertextProps as BaseHypertextProps,
    HypertextUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, HypertextStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Hypertext = manageJss(HypertextStyles)(BaseHypertext);
type Hypertext = typeof Hypertext;

interface HypertextHandledProps extends Subtract<BaseHypertextHandledProps, HypertextManagedClasses> {}
type HypertextProps = ManagedJSSProps<BaseHypertextProps, HypertextClassNameContract, DesignSystem>;

export {
    Hypertext,
    HypertextProps,
    HypertextHandledProps,
    HypertextUnhandledProps,
    HypertextClassNameContract
};
