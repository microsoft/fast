import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    Toggle as BaseToggle,
    ToggleHandledProps as BaseToggleHandledProps,
    ToggleProps as BaseToggleProps,
    ToggleClassNameContract,
    ToggleManagedClasses,
    ToggleUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, ToggleStyles } from "@microsoft/fast-components-styles-msft";
import toggleSchema from "./toggle.schema";
import toggleSchema2 from "./toggle.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Toggle = manageJss(ToggleStyles)(BaseToggle);
type Toggle = InstanceType<typeof Toggle>;

type ToggleHandledProps = Subtract<BaseToggleHandledProps, ToggleManagedClasses>;
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
    toggleSchema,
    toggleSchema2,
};
