import * as React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Toggle as BaseToggle,
    ToggleClassNameContract,
    ToggleHandledProps as BaseToggleHandledProps,
    ToggleManagedClasses,
    ToggleProps as BaseToggleProps,
    ToggleUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ToggleStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Toggle = manageJss(ToggleStyles)(BaseToggle);
type Toggle = InstanceType<typeof Toggle>;

interface ToggleHandledProps
    extends Subtract<BaseToggleHandledProps, ToggleManagedClasses> {}
type ToggleProps = ManagedJSSProps<
    BaseToggleProps,
    ToggleClassNameContract,
    DesignSystem
>;

export {
    Toggle,
    ToggleProps,
    ToggleHandledProps,
    ToggleUnhandledProps,
    ToggleClassNameContract,
};
