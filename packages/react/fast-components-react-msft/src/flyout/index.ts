import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { FlyoutClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, FlyoutStyles } from "@microsoft/fast-components-styles-msft";
import MSFTFlyout, {
    FlyoutAxisPositioningMode,
    FlyoutHorizontalPosition,
    FlyoutManagedClasses,
    FlyoutUnhandledProps,
    FlyoutVerticalPosition,
    FlyoutHandledProps as MSFTFlyoutHandledProps,
    FlyoutProps as MSFTFlyoutProps,
} from "./flyout";
import flyoutSchema from "./flyout.schema";
import flyoutSchema2 from "./flyout.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Flyout = manageJss(FlyoutStyles)(MSFTFlyout);
type Flyout = InstanceType<typeof Flyout>;

type FlyoutHandledProps = Omit<MSFTFlyoutHandledProps, keyof FlyoutManagedClasses>;
type FlyoutProps = ManagedJSSProps<
    MSFTFlyoutProps,
    FlyoutClassNameContract,
    DesignSystem
>;

export {
    Flyout,
    FlyoutProps,
    FlyoutAxisPositioningMode,
    FlyoutHorizontalPosition,
    FlyoutVerticalPosition,
    FlyoutHandledProps,
    flyoutSchema,
    flyoutSchema2,
    FlyoutUnhandledProps,
    FlyoutClassNameContract,
};
