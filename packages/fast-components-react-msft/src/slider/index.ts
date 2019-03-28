import React from "react";
import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, SliderStyles } from "@microsoft/fast-components-styles-msft";
import MSFTSlider, {
    SliderHandledProps as MSFTSliderHandledProps,
    SliderManagedClasses,
    SliderProps as MSFTSliderProps,
    SliderUnhandledProps,
} from "./slider";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const Slider = manageJss(SliderStyles)(MSFTSlider);
type Slider = InstanceType<typeof Slider>;

interface SliderHandledProps
    extends Subtract<MSFTSliderHandledProps, SliderManagedClasses> {}
type SliderProps = ManagedJSSProps<
    MSFTSliderProps,
    SliderClassNameContract,
    DesignSystem
>;

export {
    Slider,
    SliderProps,
    SliderClassNameContract,
    SliderHandledProps,
    SliderUnhandledProps,
};
