import React from "react";
import { Subtract } from "utility-types";
import {
    SliderHandledProps as BaseSliderHandledProps,
    SliderManagedClasses as BaseSliderManagedClasses,
    SliderUnhandledProps as BaseSliderUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    SliderClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type SliderManagedClasses = ManagedClasses<SliderClassNameContract>;
export interface SliderHandledProps
    extends SliderManagedClasses,
        Subtract<BaseSliderHandledProps, BaseSliderManagedClasses> {}

export type SliderUnhandledProps = BaseSliderUnhandledProps;
export type SliderProps = SliderHandledProps & SliderUnhandledProps;
