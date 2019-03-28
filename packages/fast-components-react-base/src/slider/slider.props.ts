import * as React from "react";
import {
    ManagedClasses,
    SliderClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { SliderState, SliderThumb } from "./slider";

export interface SliderManagedClasses extends ManagedClasses<SliderClassNameContract> {}
export interface SliderUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

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
        thumb: SliderThumb
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
     * The aria-labelledby attribute to link the slider to an existing
     * element that provides it an accessible name
     */
    labelledBy?: string;
}

export type SliderProps = SliderUnhandledProps & SliderHandledProps;
