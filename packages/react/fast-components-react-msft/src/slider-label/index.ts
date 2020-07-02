import React from "react";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { SliderLabelClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem, SliderLabelStyles } from "@microsoft/fast-components-styles-msft";
import sliderLabelSchema from "./slider-label.schema";
import sliderLabelSchema2 from "./slider-label.schema.2";
import MSFTSliderLabel, {
    SliderLabelHandledProps as MSFTSliderLabelHandledProps,
    SliderLabelProps as MSFTSliderLabelProps,
    SliderLabelManagedClasses,
    SliderLabelUnhandledProps,
} from "./slider-label";
import { Subtract } from "utility-types";

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
    sliderLabelSchema2,
    SliderLabelUnhandledProps,
};
