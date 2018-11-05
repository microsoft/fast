import * as React from "react";
import {
    Divider as BaseDivider,
    DividerClassNameContract,
    DividerHandledProps as BaseDividerHandledProps,
    DividerManagedClasses,
    DividerProps as BaseDividerProps,
    DividerRoles,
    DividerUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, DividerStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Divider = manageJss(DividerStyles)(BaseDivider);
type Divider = InstanceType<typeof Divider>;

interface DividerHandledProps
    extends Subtract<BaseDividerHandledProps, DividerManagedClasses> {}
type DividerProps = ManagedJSSProps<
    BaseDividerProps,
    DividerClassNameContract,
    DesignSystem
>;

export {
    Divider,
    DividerProps,
    DividerRoles,
    DividerHandledProps,
    DividerUnhandledProps,
    DividerClassNameContract,
};
