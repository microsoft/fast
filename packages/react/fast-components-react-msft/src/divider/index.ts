import React from "react";
import {
    Divider as BaseDivider,
    DividerHandledProps as BaseDividerHandledProps,
    DividerProps as BaseDividerProps,
    DividerClassNameContract,
    DividerManagedClasses,
    DividerRoles,
    DividerUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, DividerStyles } from "@microsoft/fast-components-styles-msft";
import dividerSchema from "./divider.schema";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Divider = manageJss(DividerStyles)(BaseDivider);
type Divider = InstanceType<typeof Divider>;

type DividerHandledProps = Subtract<BaseDividerHandledProps, DividerManagedClasses>;
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
    dividerSchema,
    DividerUnhandledProps,
    DividerClassNameContract,
};
