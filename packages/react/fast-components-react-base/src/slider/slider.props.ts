import React from "react";
import {
    ManagedClasses,
    SliderClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { SliderState, SliderThumb } from "./slider";

export type SliderManagedClasses = ManagedClasses<SliderClassNameContract>;
export type SliderUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export enum SliderOrientation {
    horizontal = "horizontal",
    vertical = "vertical",
}

export enum SliderMode {
    singleValue = "singleValue",
    adustUpperValue = "adustUpperValue",
    adustLowerValue = "adjustLowerValue",
    adjustBoth = "adjustBoth",
}

export interface SliderRange {
    minValue: number;
    maxValue: number;
}

export interface SliderHandledProps extends SliderManagedClasses {
    /**
     * The slider orientation, default is horizontal
     */
    orientation?: SliderOrientation;

    /**
     * The slider mode
     */
    mode?: SliderMode;

    /**
     * Custom function to render the thumb of the control
     */
    thumb?: (
        props: SliderProps,
        state: SliderState,
        mouseDownCallback: (event: React.MouseEvent) => void,
        keyDownCallback: (event: React.KeyboardEvent) => void,
        thumb: SliderThumb,
        touchStartCallback?: (event: React.TouchEvent) => void
    ) => React.ReactNode;

    /**
     * The initial value of the slider
     */
    initialValue?: number | SliderRange;

    /**
     * The total range of values represented in the slider
     */
    range?: SliderRange;

    /**
     * Constrains the slider to a subset of the whole bar
     */
    constrainedRange?: SliderRange;

    /**
     * Contrains the slider to a particular value increments
     */
    step?: number;

    /**
     * The amount added/subtracted to the current value per page up/down keystroke
     */
    pageStep?: number;

    /**
     * The value of the slider (controlled mode)
     */
    value?: number | SliderRange;

    /**
     * The onValueChange event handler
     */
    onValueChange?: (newValue: number | SliderRange) => void;

    /**
     * The children
     */
    children?: React.ReactNode;

    /**
     * The disabled state
     */
    disabled?: boolean;

    /**
     * Defines a name for the hidden native slider
     */
    name?: string;

    /**
     * Defines one or more forms the select field belongs to
     */
    form?: string;

    /**
     * The aria-label attribute to apply to the high value thumb (also used in single value mode)
     */
    maxThumbLabel?: string;

    /**
     * The aria-label attribute to apply to the low value thumb
     */
    minThumbLabel?: string;

    /**
     * The aria-describedby attribute for the min value thumb
     */
    minThumbDescribedBy?: string;

    /**
     * The aria-describedby attribute for the max value thumb
     */
    maxThumbDescribedBy?: string;

    /**
     * The aria-labelledby attribute for the min value thumb
     */
    minThumbLabelledBy?: string;

    /**
     * The aria-labelledby attribute for the max value thumb
     */
    maxThumbLabelledBy?: string;

    /**
     * Function which formats the string that populates the "aria-valuetext" attribute of a thumb
     */
    valuetextStringFormatter?: (
        sliderProps: SliderHandledProps,
        sliderState: SliderState,
        thumb: SliderThumb
    ) => string;

    /**
     * Function which converts the underlying slider value to another value to be displayed to the user.
     * This may be useful in scenarios such as the case where a slider is selecting indexes in an array and
     * the author wants aria to report the value at that index, not the index.
     */
    displayValueConverter?: (value: number) => number;
}

export type SliderProps = SliderUnhandledProps & SliderHandledProps;
