import * as React from "react";
import {
    Hypertext as BaseHypertext,
    IFoundationProps,
    IHypertextClassNameContract,
    IHypertextHandledProps,
    IHypertextUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { HypertextStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Hypertext = manageJss(HypertextStyles)(BaseHypertext);
type Hypertext = InstanceType<typeof Hypertext>;

export { Hypertext };
