import { SyntheticViewTemplate } from "@microsoft/fast-element";
import { Direction, Orientation } from "@microsoft/fast-web-utilities";
import type { FoundationElementDefinition } from "../foundation-element";
import { FormAssociatedSlider } from "./slider.form-associated";
/**
 * The selection modes of a {@link @microsoft/fast-foundation#(Slider:class)}.
 * @public
 */
export declare enum SliderMode {
    singleValue = "single-value",
}
/**
 * The configuration structure of {@link @microsoft/fast-foundation#(Slider:class)}.
 * @public
 */
export interface SliderConfiguration {
    max: number;
    min: number;
    orientation?: Orientation;
    direction?: Direction;
    disabled?: boolean;
}
/**
 * Slider configuration options
 * @public
 */
export declare type SliderOptions = FoundationElementDefinition & {
    thumb?: string | SyntheticViewTemplate;
};
/**
 * A Slider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#slider | ARIA slider }.
 *
 * @public
 */
export declare class Slider extends FormAssociatedSlider implements SliderConfiguration {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     *
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * @internal
     */
    track: HTMLDivElement;
    /**
     * @internal
     */
    thumb: HTMLDivElement;
    /**
     * @internal
     */
    stepMultiplier: number;
    /**
     * @internal
     */
    direction: Direction;
    /**
     * @internal
     */
    isDragging: boolean;
    /**
     * @internal
     */
    position: string;
    /**
     * @internal
     */
    trackWidth: number;
    /**
     * @internal
     */
    trackMinWidth: number;
    /**
     * @internal
     */
    trackHeight: number;
    /**
     * @internal
     */
    trackLeft: number;
    /**
     * @internal
     */
    trackMinHeight: number;
    /**
     * Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.
     *
     * @public
     */
    valueTextFormatter: (value: string) => string | null;
    /**
     * @internal
     */
    valueChanged(previous: any, next: any): void;
    /**
     * The minimum allowed value.
     *
     * @defaultValue - 0
     * @public
     * @remarks
     * HTML Attribute: min
     */
    min: number;
    private minChanged;
    /**
     * The maximum allowed value.
     *
     * @defaultValue - 10
     * @public
     * @remarks
     * HTML Attribute: max
     */
    max: number;
    private maxChanged;
    /**
     * Value to increment or decrement via arrow keys, mouse click or drag.
     *
     * @public
     * @remarks
     * HTML Attribute: step
     */
    step: number;
    private stepChanged;
    /**
     * The orientation of the slider.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    orientation: Orientation;
    private orientationChanged;
    /**
     * The selection mode.
     *
     * @public
     * @remarks
     * HTML Attribute: mode
     */
    mode: SliderMode;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Increment the value by the step
     *
     * @public
     */
    increment(): void;
    /**
     * Decrement the value by the step
     *
     * @public
     */
    decrement(): void;
    protected keypressHandler: (e: KeyboardEvent) => void;
    /**
     * Places the thumb based on the current value
     *
     * @public
     * @param direction - writing mode
     */
    private setThumbPositionForOrientation;
    /**
     * Update the step multiplier used to ensure rounding errors from steps that
     * are not whole numbers
     */
    private updateStepMultiplier;
    private setupTrackConstraints;
    private setupListeners;
    /**
     * @internal
     */
    initialValue: string;
    private get midpoint();
    private setupDefaultValue;
    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleThumbMouseDown;
    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleMouseMove;
    private calculateNewValue;
    /**
     * Handle a window mouse up during a drag operation
     */
    private handleWindowMouseUp;
    private stopDragging;
    private handleMouseDown;
    private convertToConstrainedValue;
}
