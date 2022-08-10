import {
    attr,
    nullableNumberConverter,
    observable,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import {
    Direction,
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyHome,
    Orientation,
} from "@microsoft/fast-web-utilities";
import { getDirection } from "../utilities/direction.js";
import { convertPixelToPercent } from "./slider-utilities.js";
import { FormAssociatedSlider } from "./slider.form-associated.js";

/**
 * The selection modes of a {@link @microsoft/fast-foundation#(FASTSlider:class)}.
 * @public
 */
export const SliderMode = {
    singleValue: "single-value",
} as const;

/**
 * The types for the selection mode of the slider
 * @public
 */
export type SliderMode = typeof SliderMode[keyof typeof SliderMode];

/**
 * The configuration structure of {@link @microsoft/fast-foundation#(FASTSlider:class)}.
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
export type SliderOptions = {
    thumb?: string | SyntheticViewTemplate;
};

/**
 * A Slider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#slider | ARIA slider }.
 *
 * @slot track - The track of the slider
 * @slot track-start - The track-start visual indicator
 * @slot thumb - The slider thumb
 * @slot - The default slot for labels
 * @csspart positioning-region - The region used to position the elements of the slider
 * @csspart track-container - The region containing the track elements
 * @csspart track-start - The element wrapping the track start slot
 * @csspart thumb-container - The thumb container element which is programatically positioned
 * @fires change - Fires a custom 'change' event when the slider value changes
 *
 * @public
 */
export class FASTSlider extends FormAssociatedSlider implements SliderConfiguration {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     *
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    protected readOnlyChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    /**
     * @internal
     */
    public track: HTMLDivElement;

    /**
     * @internal
     */
    public thumb: HTMLDivElement;

    /**
     * @internal
     */
    public stepMultiplier: number;

    /**
     * @internal
     */
    @observable
    public direction: Direction = Direction.ltr;

    /**
     * @internal
     */
    @observable
    public isDragging: boolean = false;

    /**
     * @internal
     */
    @observable
    public position: string;

    /**
     * @internal
     */
    @observable
    public trackWidth: number = 0;

    /**
     * @internal
     */
    @observable
    public trackMinWidth: number = 0;

    /**
     * @internal
     */
    @observable
    public trackHeight: number = 0;

    /**
     * @internal
     */
    @observable
    public trackLeft: number = 0;

    /**
     * @internal
     */
    @observable
    public trackMinHeight: number = 0;

    /**
     * The value property, typed as a number.
     *
     * @public
     */
    public get valueAsNumber(): number {
        return parseFloat(super.value);
    }

    public set valueAsNumber(next: number) {
        this.value = next.toString();
    }

    /**
     * Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.
     *
     * @public
     */
    @observable
    public valueTextFormatter: (value: string) => string | null = () => null;

    /**
     * @internal
     */
    public valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);

        if (this.$fastController.isConnected) {
            this.setThumbPositionForOrientation(this.direction);
        }
        this.$emit("change");
    }

    /**
     * The minimum allowed value.
     *
     * @defaultValue - 0
     * @public
     * @remarks
     * HTML Attribute: min
     */
    @attr({ converter: nullableNumberConverter })
    public min: number = 0; // Map to proxy element.
    private minChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.min = `${this.min}`;
        }

        this.validate();
    }

    /**
     * The maximum allowed value.
     *
     * @defaultValue - 10
     * @public
     * @remarks
     * HTML Attribute: max
     */
    @attr({ converter: nullableNumberConverter })
    public max: number = 10; // Map to proxy element.
    private maxChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.max = `${this.max}`;
        }
        this.validate();
    }

    /**
     * Value to increment or decrement via arrow keys, mouse click or drag.
     *
     * @public
     * @remarks
     * HTML Attribute: step
     */
    @attr({ converter: nullableNumberConverter })
    public step: number = 1; // Map to proxy element.
    private stepChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.step = `${this.step}`;
        }

        this.updateStepMultiplier();
        this.validate();
    }

    /**
     * The orientation of the slider.
     *
     * @public
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: Orientation = Orientation.horizontal;
    private orientationChanged(): void {
        if (this.$fastController.isConnected) {
            this.setThumbPositionForOrientation(this.direction);
        }
    }

    /**
     * The selection mode.
     *
     * @public
     * @remarks
     * HTML Attribute: mode
     */
    @attr
    public mode: SliderMode = SliderMode.singleValue;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "range");

        this.direction = getDirection(this);
        this.updateStepMultiplier();
        this.setupTrackConstraints();
        this.setupListeners();
        this.setupDefaultValue();
        this.setThumbPositionForOrientation(this.direction);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        this.setupListeners(true);
    }

    /**
     * Increment the value by the step
     *
     * @public
     */
    public increment(): void {
        const newVal: number =
            this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                ? Number(this.value) + Number(this.step)
                : Number(this.value) - Number(this.step);
        const incrementedVal: number = this.convertToConstrainedValue(newVal);
        const incrementedValString: string =
            incrementedVal < Number(this.max) ? `${incrementedVal}` : `${this.max}`;
        this.value = incrementedValString;
    }

    /**
     * Decrement the value by the step
     *
     * @public
     */
    public decrement(): void {
        const newVal =
            this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                ? Number(this.value) - Number(this.step)
                : Number(this.value) + Number(this.step);
        const decrementedVal: number = this.convertToConstrainedValue(newVal);
        const decrementedValString: string =
            decrementedVal > Number(this.min) ? `${decrementedVal}` : `${this.min}`;
        this.value = decrementedValString;
    }

    protected keypressHandler = (e: KeyboardEvent) => {
        if (this.readOnly) {
            return;
        }

        if (e.key === keyHome) {
            e.preventDefault();
            this.value = `${this.min}`;
        } else if (e.key === keyEnd) {
            e.preventDefault();
            this.value = `${this.max}`;
        } else if (!e.shiftKey) {
            switch (e.key) {
                case keyArrowRight:
                case keyArrowUp:
                    e.preventDefault();
                    this.increment();
                    break;
                case keyArrowLeft:
                case keyArrowDown:
                    e.preventDefault();
                    this.decrement();
                    break;
            }
        }
    };

    /**
     * Places the thumb based on the current value
     *
     * @public
     * @param direction - writing mode
     */
    private setThumbPositionForOrientation(direction: Direction): void {
        const newPct: number = convertPixelToPercent(
            Number(this.value),
            Number(this.min),
            Number(this.max),
            direction
        );
        const percentage: number = (1 - newPct) * 100;
        if (this.orientation === Orientation.horizontal) {
            this.position = this.isDragging
                ? `right: ${percentage}%; transition: none;`
                : `right: ${percentage}%; transition: all 0.2s ease;`;
        } else {
            this.position = this.isDragging
                ? `bottom: ${percentage}%; transition: none;`
                : `bottom: ${percentage}%; transition: all 0.2s ease;`;
        }
    }

    /**
     * Update the step multiplier used to ensure rounding errors from steps that
     * are not whole numbers
     */
    private updateStepMultiplier(): void {
        const stepString: string = this.step + "";
        const decimalPlacesOfStep: number = !!(this.step % 1)
            ? stepString.length - stepString.indexOf(".") - 1
            : 0;
        this.stepMultiplier = Math.pow(10, decimalPlacesOfStep);
    }

    private setupTrackConstraints = (): void => {
        const clientRect: DOMRect = this.track.getBoundingClientRect();
        this.trackWidth = this.track.clientWidth;
        this.trackMinWidth = this.track.clientLeft;
        this.trackHeight = clientRect.bottom;
        this.trackMinHeight = clientRect.top;
        this.trackLeft = this.getBoundingClientRect().left;
        if (this.trackWidth === 0) {
            this.trackWidth = 1;
        }
    };

    private setupListeners = (remove: boolean = false): void => {
        const eventAction = `${remove ? "remove" : "add"}EventListener`;
        this[eventAction]("keydown", this.keypressHandler);
        this[eventAction]("mousedown", this.handleMouseDown);
        this.thumb[eventAction]("mousedown", this.handleThumbMouseDown, {
            passive: true,
        });
        this.thumb[eventAction]("touchstart", this.handleThumbMouseDown, {
            passive: true,
        });
        // removes handlers attached by mousedown handlers
        if (remove) {
            this.handleMouseDown(null);
            this.handleThumbMouseDown(null);
        }
    };

    /**
     * @internal
     */
    public initialValue: string = "";

    private get midpoint(): string {
        return `${this.convertToConstrainedValue((this.max + this.min) / 2)}`;
    }

    private setupDefaultValue(): void {
        if (typeof this.value === "string") {
            if (this.value.length === 0) {
                this.initialValue = this.midpoint;
            } else {
                const value = parseFloat(this.value);

                if (!Number.isNaN(value) && (value < this.min || value > this.max)) {
                    this.value = this.midpoint;
                }
            }
        }
    }

    /**
     *  Handle mouse moves during a thumb drag operation
     *  If the event handler is null it removes the events
     */
    private handleThumbMouseDown = (event: MouseEvent | null): void => {
        if (event) {
            if (this.readOnly || this.disabled || event.defaultPrevented) {
                return;
            }
            (event.target as HTMLElement).focus();
        }
        const eventAction = `${event !== null ? "add" : "remove"}EventListener`;
        window[eventAction]("mouseup", this.handleWindowMouseUp);
        window[eventAction]("mousemove", this.handleMouseMove, { passive: true });
        window[eventAction]("touchmove", this.handleMouseMove, { passive: true });
        window[eventAction]("touchend", this.handleWindowMouseUp);
        this.isDragging = event !== null;
    };

    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleMouseMove = (e: MouseEvent | TouchEvent): void => {
        if (this.readOnly || this.disabled || e.defaultPrevented) {
            return;
        }

        // update the value based on current position
        const sourceEvent =
            window.TouchEvent && e instanceof TouchEvent
                ? e.touches[0]
                : (e as MouseEvent);
        const eventValue: number =
            this.orientation === Orientation.horizontal
                ? sourceEvent.pageX - document.documentElement.scrollLeft - this.trackLeft
                : sourceEvent.pageY - document.documentElement.scrollTop;

        this.value = `${this.calculateNewValue(eventValue)}`;
    };

    private calculateNewValue = (rawValue: number): number => {
        // update the value based on current position
        const newPosition = convertPixelToPercent(
            rawValue,
            this.orientation === Orientation.horizontal
                ? this.trackMinWidth
                : this.trackMinHeight,
            this.orientation === Orientation.horizontal
                ? this.trackWidth
                : this.trackHeight,
            this.direction
        );
        const newValue: number = (this.max - this.min) * newPosition + this.min;
        return this.convertToConstrainedValue(newValue);
    };

    /**
     * Handle a window mouse up during a drag operation
     */
    private handleWindowMouseUp = (event: MouseEvent): void => {
        this.stopDragging();
    };

    private stopDragging = (): void => {
        this.isDragging = false;
        this.handleMouseDown(null);
        this.handleThumbMouseDown(null);
    };

    /**
     *
     * @param e - MouseEvent or null. If there is no event handler it will remove the events
     */
    private handleMouseDown = (e: MouseEvent | null) => {
        const eventAction = `${e !== null ? "add" : "remove"}EventListener`;
        if (e === null || (!this.disabled && !this.readOnly)) {
            window[eventAction]("mouseup", this.handleWindowMouseUp);
            window.document[eventAction]("mouseleave", this.handleWindowMouseUp);
            window[eventAction]("mousemove", this.handleMouseMove);

            if (e) {
                e.preventDefault();
                this.setupTrackConstraints();
                (e.target as HTMLElement).focus();
                const controlValue: number =
                    this.orientation === Orientation.horizontal
                        ? e.pageX - document.documentElement.scrollLeft - this.trackLeft
                        : e.pageY - document.documentElement.scrollTop;

                this.value = `${this.calculateNewValue(controlValue)}`;
            }
        }
    };

    private convertToConstrainedValue = (value: number): number => {
        if (isNaN(value)) {
            value = this.min;
        }

        /**
         * The following logic intends to overcome the issue with math in JavaScript with regards to floating point numbers.
         * This is needed as the `step` may be an integer but could also be a float. To accomplish this the step  is assumed to be a float
         * and is converted to an integer by determining the number of decimal places it represent, multiplying it until it is an
         * integer and then dividing it to get back to the correct number.
         */
        let constrainedValue: number = value - this.min;
        const roundedConstrainedValue: number = Math.round(constrainedValue / this.step);
        const remainderValue: number =
            constrainedValue -
            (roundedConstrainedValue * (this.stepMultiplier * this.step)) /
                this.stepMultiplier;

        constrainedValue =
            remainderValue >= Number(this.step) / 2
                ? constrainedValue - remainderValue + Number(this.step)
                : constrainedValue - remainderValue;
        return constrainedValue + this.min;
    };
}
