import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    IToggleClassNameContract,
    IToggleHandledProps as IBaseToggleHandledProps,
    IToggleManagedClasses,
    IToggleUnhandledProps,
    Toggle as BaseToggle,
    ToggleProps as BaseToggleProps
} from "@microsoft/fast-components-react-base";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { IDesignSystem, ToggleStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Toggle = manageJss(ToggleStyles)(BaseToggle);
type Toggle = InstanceType<typeof Toggle>;

interface IToggleHandledProps extends Subtract<IBaseToggleHandledProps, IToggleManagedClasses> {}
type ToggleProps = JSSManagerProps<BaseToggleProps, IToggleClassNameContract, IDesignSystem>;

export {
    Toggle,
    ToggleProps,
    IToggleHandledProps,
    IToggleUnhandledProps,
    IToggleClassNameContract
};
