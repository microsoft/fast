import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import {
    Direction,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
    keyCodeTab,
    Orientation,
} from "@microsoft/fast-web-utilities";
import { getDirection } from "../utilities/direction";
import { convertPixelToPercent } from "./slider-utilities";
import { FormAssociatedSlider } from "./slider.form-associated";

/**
 * The selection modes of a {@link @microsoft/fast-foundation#(Slider:class)}.
 * @public
 */
export enum SliderMode {
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
 * A Slider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#slider | ARIA slider }.
 *
 * @public
 */
export class Slider extends FormAssociatedSlider implements SliderConfiguration {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     *
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
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
     * Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.
     *
     * @public
     */
    @observable
    public valueTextFormatter: (value: string) => string | null = () => null;

    /**
     * @internal
     */
    public valueChanged(previous, next): void {
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
        this.setupTrackConstraints();
        this.setupListeners();
        this.setupDefaultValue();
        this.setThumbPositionForOrientation(this.direction);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        this.removeEventListener("keydown", this.keypressHandler);
        this.removeEventListener("mousedown", this.handleMouseDown);
        this.thumb.removeEventListener("mousedown", this.handleThumbMouseDown);
        this.thumb.removeEventListener("touchstart", this.handleThumbMouseDown);
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
        if (e.keyCode !== keyCodeTab) {
            e.preventDefault();
        }

        if (e.keyCode === keyCodeHome) {
            this.value = `${this.min}`;
        } else if (e.keyCode === keyCodeEnd) {
            this.value = `${this.max}`;
        } else if (!e.shiftKey) {
            switch (e.keyCode) {
                case keyCodeArrowRight:
                case keyCodeArrowUp:
                    this.increment();
                    break;
                case keyCodeArrowLeft:
                case keyCodeArrowDown:
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
        const percentage: number = Math.round((1 - newPct) * 100);
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

    private setupListeners = (): void => {
        this.addEventListener("keydown", this.keypressHandler);
        this.addEventListener("mousedown", this.handleMouseDown);
        this.thumb.addEventListener("mousedown", this.handleThumbMouseDown);
        this.thumb.addEventListener("touchstart", this.handleThumbMouseDown);
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
     */
    private handleThumbMouseDown = (event: MouseEvent): void => {
        if (this.readOnly || this.disabled || event.defaultPrevented) {
            return;
        }
        event.preventDefault();
        (event.target as HTMLElement).focus();
        window.addEventListener("mouseup", this.handleWindowMouseUp);
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("touchmove", this.handleMouseMove);
        window.addEventListener("touchend", this.handleWindowMouseUp);
        this.isDragging = true;
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
                ? sourceEvent.pageX - this.trackLeft
                : sourceEvent.pageY;

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
        window.removeEventListener("mouseup", this.handleWindowMouseUp);
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("touchmove", this.handleMouseMove);
        window.removeEventListener("touchend", this.handleWindowMouseUp);
    };

    private handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        if (!this.disabled && !this.readOnly) {
            this.setupTrackConstraints();
            (e.target as HTMLElement).focus();
            window.addEventListener("mouseup", this.handleWindowMouseUp);
            window.addEventListener("mousemove", this.handleMouseMove);

            const controlValue: number =
                this.orientation === Orientation.horizontal
                    ? e.pageX - this.trackLeft
                    : e.pageY;

            this.value = `${this.calculateNewValue(controlValue)}`;
        }
    };

    private convertToConstrainedValue = (value: number): number => {
        if (isNaN(value)) {
            value = this.min;
        }
        let constrainedValue: number = value - this.min;
        const remainderVal: number = constrainedValue % Number(this.step);
        constrainedValue =
            remainderVal >= Number(this.step) / 2
                ? constrainedValue - remainderVal + Number(this.step)
                : constrainedValue - remainderVal;
        return constrainedValue + this.min;
    };
}
