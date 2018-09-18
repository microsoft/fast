import * as React from "react";
import {
    Divider as BaseDivider,
    IDividerClassNameContract,
    IDividerHandledProps,
    IDividerUnhandledProps,
    IFoundationProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { DividerStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Divider =  manageJss(DividerStyles)(BaseDivider);
type Divider = InstanceType<typeof Divider>;

export { Divider };
