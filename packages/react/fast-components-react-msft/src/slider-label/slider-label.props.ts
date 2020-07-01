import React from "react";
import {
    SliderTrackItemHandledProps as BaseSliderTrackItemHandledProps,
    SliderTrackItemManagedClasses as BaseSliderTrackItemManagedClasses,
    SliderTrackItemUnhandledProps as BaseSliderTrackItemUnhandledProps,
    SliderTrackItemAnchor,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    SliderLabelClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type SliderLabelManagedClasses = ManagedClasses<SliderLabelClassNameContract>;

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

export type SliderLabelUnhandledProps = BaseSliderTrackItemUnhandledProps;
export type SliderLabelProps = SliderLabelHandledProps & SliderLabelUnhandledProps;
