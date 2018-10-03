import * as React from "react";
import { IFoundationProps } from "@microsoft/fast-components-foundation-react";
import {
    IButtonHandledProps as IBaseButtonHandledProps,
    IButtonUnhandledProps
} from "@microsoft/fast-components-react-base";
import { IFlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { IJSSManagerProps, JSSManagerProps } from "@microsoft/fast-jss-manager-react";
import { FlipperStyles, IDesignSystem } from "@microsoft/fast-components-styles-msft";
import MSFTFlipper, {
    FlipperDirection,
    FlipperProps as MSFTFlipperProps,
    IFlipperHandledProps as IMSFTFlipperHandledProps,
    IFlipperManagedClasses,
    IFlipperUnhandledProps
} from "./flipper";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Flipper = manageJss(FlipperStyles)(MSFTFlipper);
type Flipper = InstanceType<typeof Flipper>;

interface IFlipperHandledProps extends Subtract<IMSFTFlipperHandledProps, IFlipperManagedClasses> {}
type FlipperProps = JSSManagerProps<MSFTFlipperProps, IFlipperClassNameContract, IDesignSystem>;

export {
    Flipper,
    FlipperProps,
    FlipperDirection,
    IFlipperHandledProps,
    IFlipperUnhandledProps,
    IFlipperClassNameContract
};
