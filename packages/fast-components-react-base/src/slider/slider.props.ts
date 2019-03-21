import * as React from "react";
import {
    ManagedClasses,
    SliderClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import { SliderState } from "./slider";

export interface SliderManagedClasses extends ManagedClasses<SliderClassNameContract> {}
export interface SliderUnhandledProps extends React.AllHTMLAttributes<HTMLElement> {}

export enum SliderOrientation {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface SliderHandledProps extends SliderManagedClasses {
    /**
     * The slider orientation, default is horizontal
     */
    orientation?: SliderOrientation;

    /**
     * Custom function to render the thumb of the control
     */
    thumb?: (
        props: SliderProps,
        state: SliderState,
        mouseDownCallback: (event: React.MouseEvent) => void,
        keyDownCallback: (event: React.KeyboardEvent) => void
    ) => React.ReactNode;

    /**
     * The initial value of the slider
     */
    initialValue?: number;

    /**
     * The initial value of the slider
     */
    min?: number;

    /**
     * The initial value of the slider
     */
    max?: number;

    /**
     * The initial value of the slider
     */
    step?: number;

    /**
     * The initial value of the slider
     */
    pageStep?: number;

    /**
     * The value of the slider (controlled mode)
     */
    value?: number;

    /**
     * The onValueChange event handler
     */
    onValueChange?: (newValue: number) => void;

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
