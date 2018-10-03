import * as React from "react";
import {
    Divider as BaseDivider,
    DividerProps as BaseDividerProps,
    DividerRoles,
    IDividerClassNameContract,
    IDividerHandledProps as IBaseDividerHandledProps,
    IDividerManagedClasses,
    IDividerUnhandledProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { DividerStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Divider =  manageJss(DividerStyles)(BaseDivider);
type Divider = InstanceType<typeof Divider>;

interface IDividerHandledProps extends Subtract<IBaseDividerHandledProps, IDividerManagedClasses> {}
type DividerProps = JSSManagerProps<BaseDividerProps, IDividerClassNameContract, IDesignSystem>;

export {
    Divider,
    DividerProps,
    DividerRoles,
    IDividerHandledProps,
    IDividerUnhandledProps,
    IDividerClassNameContract
};
