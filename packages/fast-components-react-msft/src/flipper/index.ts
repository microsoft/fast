import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    ButtonHandledProps as BaseButtonHandledProps,
    ButtonUnhandledProps,
} from "@microsoft/fast-components-react-base";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, FlipperStyles } from "@microsoft/fast-components-styles-msft";
import MSFTFlipper, {
    FlipperDirection,
    FlipperHandledProps as MSFTFlipperHandledProps,
    FlipperManagedClasses,
    FlipperProps as MSFTFlipperProps,
    FlipperUnhandledProps,
} from "./flipper";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Flipper = manageJss(FlipperStyles)(MSFTFlipper);
type Flipper = InstanceType<typeof Flipper>;

interface FlipperHandledProps
    extends Subtract<MSFTFlipperHandledProps, FlipperManagedClasses> {}
type FlipperProps = ManagedJSSProps<
    MSFTFlipperProps,
    FlipperClassNameContract,
    DesignSystem
>;

export {
    Flipper,
    FlipperProps,
    FlipperDirection,
    FlipperHandledProps,
    FlipperUnhandledProps,
    FlipperClassNameContract,
};
