import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { FlyoutClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, FlyoutStyles } from "@microsoft/fast-components-styles-msft";
import MSFTFlyout, {
    FlyoutAxisPositioningMode,
    FlyoutHandledProps as MSFTFlyoutHandledProps,
    FlyoutHorizontalPosition,
    FlyoutManagedClasses,
    FlyoutProps as MSFTFlyoutProps,
    FlyoutUnhandledProps,
    FlyoutVerticalPosition,
} from "./flyout";
import flyoutSchema from "./flyout.schema";
import flyoutSchema2 from "./flyout.schema.2";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Flyout = manageJss(FlyoutStyles)(MSFTFlyout);
type Flyout = InstanceType<typeof Flyout>;

interface FlyoutHandledProps
    extends Subtract<MSFTFlyoutHandledProps, FlyoutManagedClasses> {}
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
