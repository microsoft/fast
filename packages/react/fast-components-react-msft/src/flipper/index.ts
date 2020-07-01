import React from "react";
import { FoundationProps } from "@microsoft/fast-components-foundation-react";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, FlipperStyles } from "@microsoft/fast-components-styles-msft";
import MSFTFlipper, {
    FlipperDirection,
    FlipperManagedClasses,
    FlipperUnhandledProps,
    FlipperHandledProps as MSFTFlipperHandledProps,
    FlipperProps as MSFTFlipperProps,
} from "./flipper";
import flipperSchema from "./flipper.schema";
import flipperSchema2 from "./flipper.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Flipper = manageJss(FlipperStyles)(MSFTFlipper);
type Flipper = InstanceType<typeof Flipper>;

type FlipperHandledProps = Subtract<MSFTFlipperHandledProps, FlipperManagedClasses>;
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
    flipperSchema,
    flipperSchema2,
    FlipperUnhandledProps,
    FlipperClassNameContract,
};
