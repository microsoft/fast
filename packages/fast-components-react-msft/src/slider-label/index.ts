import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { SliderLabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem, SliderLabelStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";
import sliderLabelSchema from "./slider-label.schema";
import MSFTSliderLabel, {
    SliderLabelHandledProps as MSFTSliderLabelHandledProps,
    SliderLabelProps as MSFTSliderLabelProps,
    SliderLabelManagedClasses,
    SliderLabelUnhandledProps,
} from "./slider-label";

const SliderLabel = manageJss(SliderLabelStyles)(MSFTSliderLabel);
type SliderLabel = InstanceType<typeof SliderLabel>;

type SliderLabelHandledProps = Subtract<
    MSFTSliderLabelHandledProps,
    SliderLabelManagedClasses
>;
type SliderLabelProps = ManagedJSSProps<
    MSFTSliderLabelProps,
    SliderLabelClassNameContract,
    DesignSystem
>;

export {
    SliderLabel,
    SliderLabelProps,
    SliderLabelClassNameContract,
    SliderLabelHandledProps,
    sliderLabelSchema,
    SliderLabelUnhandledProps,
};
