import React from "react";
import { SliderClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, SliderStyles } from "@microsoft/fast-components-styles-msft";
import MSFTSlider, {
    SliderHandledProps as MSFTSliderHandledProps,
    SliderProps as MSFTSliderProps,
    SliderManagedClasses,
    SliderUnhandledProps,
} from "./slider";
import sliderSchema from "./slider.schema";
import sliderSchema2 from "./slider.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Slider = manageJss(SliderStyles)(MSFTSlider);
type Slider = InstanceType<typeof Slider>;

type SliderHandledProps = Subtract<MSFTSliderHandledProps, SliderManagedClasses>;
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
    sliderSchema,
    sliderSchema2,
    SliderUnhandledProps,
};
