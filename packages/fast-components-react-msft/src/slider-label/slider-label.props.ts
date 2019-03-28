import React from "react";
import { Omit, Subtract } from "utility-types";
import {
    SliderTrackItemAnchor,
    SliderTrackItemHandledProps as BaseSliderTrackItemHandledProps,
    SliderTrackItemManagedClasses as BaseSliderTrackItemManagedClasses,
    SliderTrackItemUnhandledProps as BaseSliderTrackItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    SliderLabelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface SliderLabelManagedClasses
    extends ManagedClasses<SliderLabelClassNameContract> {}

export interface SliderLabelHandledProps
    extends Omit<
            BaseSliderTrackItemHandledProps,
            "maxValuePositionBinding" | keyof BaseSliderTrackItemManagedClasses
        >,
        Omit<
            BaseSliderTrackItemHandledProps,
            "minValuePositionBinding" | keyof BaseSliderTrackItemManagedClasses
        >,
        SliderLabelManagedClasses {
    /**
     * Text to display in the label
     */
    label?: string;

    /**
     * Show tick mark
     */
    showTickmark?: boolean;

    /**
     * The slider value to align the component with
     */
    valuePositionBinding?: number | SliderTrackItemAnchor;
}

/* tslint:disable-next-line:no-empty-interface */
export interface SliderLabelUnhandledProps extends BaseSliderTrackItemUnhandledProps {}
export type SliderLabelProps = SliderLabelHandledProps & SliderLabelUnhandledProps;
