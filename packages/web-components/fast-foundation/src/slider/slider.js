var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
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
export var SliderMode;
(function (SliderMode) {
    SliderMode["singleValue"] = "single-value";
})(SliderMode || (SliderMode = {}));
/**
 * A Slider Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#slider | ARIA slider }.
 *
 * @public
 */
export class Slider extends FormAssociatedSlider {
    constructor() {
        super(...arguments);
        /**
         * @internal
         */
        this.direction = Direction.ltr;
        /**
         * @internal
         */
        this.isDragging = false;
        /**
         * @internal
         */
        this.trackWidth = 0;
        /**
         * @internal
         */
        this.trackMinWidth = 0;
        /**
         * @internal
         */
        this.trackHeight = 0;
        /**
         * @internal
         */
        this.trackLeft = 0;
        /**
         * @internal
         */
        this.trackMinHeight = 0;
        /**
         * Custom function that generates a string for the component's "aria-valuetext" attribute based on the current value.
         *
         * @public
         */
        this.valueTextFormatter = () => null;
        /**
         * The minimum allowed value.
         *
         * @defaultValue - 0
         * @public
         * @remarks
         * HTML Attribute: min
         */
        this.min = 0; // Map to proxy element.
        /**
         * The maximum allowed value.
         *
         * @defaultValue - 10
         * @public
         * @remarks
         * HTML Attribute: max
         */
        this.max = 10; // Map to proxy element.
        /**
         * Value to increment or decrement via arrow keys, mouse click or drag.
         *
         * @public
         * @remarks
         * HTML Attribute: step
         */
        this.step = 1; // Map to proxy element.
        /**
         * The orientation of the slider.
         *
         * @public
         * @remarks
         * HTML Attribute: orientation
         */
        this.orientation = Orientation.horizontal;
        /**
         * The selection mode.
         *
         * @public
         * @remarks
         * HTML Attribute: mode
         */
        this.mode = SliderMode.singleValue;
        this.keypressHandler = e => {
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
        this.setupTrackConstraints = () => {
            const clientRect = this.track.getBoundingClientRect();
            this.trackWidth = this.track.clientWidth;
            this.trackMinWidth = this.track.clientLeft;
            this.trackHeight = clientRect.bottom;
            this.trackMinHeight = clientRect.top;
            this.trackLeft = this.getBoundingClientRect().left;
            if (this.trackWidth === 0) {
                this.trackWidth = 1;
            }
        };
        this.setupListeners = () => {
            this.addEventListener("keydown", this.keypressHandler);
            this.addEventListener("mousedown", this.handleMouseDown);
            this.thumb.addEventListener("mousedown", this.handleThumbMouseDown);
            this.thumb.addEventListener("touchstart", this.handleThumbMouseDown);
        };
        /**
         * @internal
         */
        this.initialValue = "";
        /**
         *  Handle mouse moves during a thumb drag operation
         */
        this.handleThumbMouseDown = event => {
            if (this.readOnly || this.disabled || event.defaultPrevented) {
                return;
            }
            event.preventDefault();
            event.target.focus();
            window.addEventListener("mouseup", this.handleWindowMouseUp);
            window.addEventListener("mousemove", this.handleMouseMove);
            window.addEventListener("touchmove", this.handleMouseMove);
            window.addEventListener("touchend", this.handleWindowMouseUp);
            this.isDragging = true;
        };
        /**
         *  Handle mouse moves during a thumb drag operation
         */
        this.handleMouseMove = e => {
            if (this.readOnly || this.disabled || e.defaultPrevented) {
                return;
            }
            // update the value based on current position
            const sourceEvent =
                window.TouchEvent && e instanceof TouchEvent ? e.touches[0] : e;
            const eventValue =
                this.orientation === Orientation.horizontal
                    ? sourceEvent.pageX - this.trackLeft
                    : sourceEvent.pageY;
            this.value = `${this.calculateNewValue(eventValue)}`;
        };
        this.calculateNewValue = rawValue => {
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
            const newValue = (this.max - this.min) * newPosition + this.min;
            return this.convertToConstrainedValue(newValue);
        };
        /**
         * Handle a window mouse up during a drag operation
         */
        this.handleWindowMouseUp = event => {
            this.stopDragging();
        };
        this.stopDragging = () => {
            this.isDragging = false;
            window.removeEventListener("mouseup", this.handleWindowMouseUp);
            window.removeEventListener("mousemove", this.handleMouseMove);
            window.removeEventListener("touchmove", this.handleMouseMove);
            window.removeEventListener("touchend", this.handleWindowMouseUp);
        };
        this.handleMouseDown = e => {
            e.preventDefault();
            if (!this.disabled && !this.readOnly) {
                this.setupTrackConstraints();
                e.target.focus();
                window.addEventListener("mouseup", this.handleWindowMouseUp);
                window.addEventListener("mousemove", this.handleMouseMove);
                const controlValue =
                    this.orientation === Orientation.horizontal
                        ? e.pageX - this.trackLeft
                        : e.pageY;
                this.value = `${this.calculateNewValue(controlValue)}`;
            }
        };
        this.convertToConstrainedValue = value => {
            if (isNaN(value)) {
                value = this.min;
            }
            /**
             * The following logic intends to overcome the issue with math in JavaScript with regards to floating point numbers.
             * This is needed as the `step` may be an integer but could also be a float. To accomplish this the step  is assumed to be a float
             * and is converted to an integer by determining the number of decimal places it represent, multiplying it until it is an
             * integer and then dividing it to get back to the correct number.
             */
            let constrainedValue = value - this.min;
            const roundedConstrainedValue = Math.round(constrainedValue / this.step);
            const remainderValue =
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
    readOnlyChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }
    /**
     * @internal
     */
    valueChanged(previous, next) {
        super.valueChanged(previous, next);
        if (this.$fastController.isConnected) {
            this.setThumbPositionForOrientation(this.direction);
        }
        this.$emit("change");
    }
    minChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.min = `${this.min}`;
        }
        this.validate();
    }
    maxChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.max = `${this.max}`;
        }
        this.validate();
    }
    stepChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.step = `${this.step}`;
        }
        this.updateStepMultiplier();
        this.validate();
    }
    orientationChanged() {
        if (this.$fastController.isConnected) {
            this.setThumbPositionForOrientation(this.direction);
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
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
    disconnectedCallback() {
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
    increment() {
        const newVal =
            this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                ? Number(this.value) + Number(this.step)
                : Number(this.value) - Number(this.step);
        const incrementedVal = this.convertToConstrainedValue(newVal);
        const incrementedValString =
            incrementedVal < Number(this.max) ? `${incrementedVal}` : `${this.max}`;
        this.value = incrementedValString;
    }
    /**
     * Decrement the value by the step
     *
     * @public
     */
    decrement() {
        const newVal =
            this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                ? Number(this.value) - Number(this.step)
                : Number(this.value) + Number(this.step);
        const decrementedVal = this.convertToConstrainedValue(newVal);
        const decrementedValString =
            decrementedVal > Number(this.min) ? `${decrementedVal}` : `${this.min}`;
        this.value = decrementedValString;
    }
    /**
     * Places the thumb based on the current value
     *
     * @public
     * @param direction - writing mode
     */
    setThumbPositionForOrientation(direction) {
        const newPct = convertPixelToPercent(
            Number(this.value),
            Number(this.min),
            Number(this.max),
            direction
        );
        const percentage = Math.round((1 - newPct) * 100);
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
    updateStepMultiplier() {
        const stepString = this.step + "";
        const decimalPlacesOfStep = !!(this.step % 1)
            ? stepString.length - stepString.indexOf(".") - 1
            : 0;
        this.stepMultiplier = Math.pow(10, decimalPlacesOfStep);
    }
    get midpoint() {
        return `${this.convertToConstrainedValue((this.max + this.min) / 2)}`;
    }
    setupDefaultValue() {
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
}
__decorate(
    [attr({ attribute: "readonly", mode: "boolean" })],
    Slider.prototype,
    "readOnly",
    void 0
);
__decorate([observable], Slider.prototype, "direction", void 0);
__decorate([observable], Slider.prototype, "isDragging", void 0);
__decorate([observable], Slider.prototype, "position", void 0);
__decorate([observable], Slider.prototype, "trackWidth", void 0);
__decorate([observable], Slider.prototype, "trackMinWidth", void 0);
__decorate([observable], Slider.prototype, "trackHeight", void 0);
__decorate([observable], Slider.prototype, "trackLeft", void 0);
__decorate([observable], Slider.prototype, "trackMinHeight", void 0);
__decorate([observable], Slider.prototype, "valueTextFormatter", void 0);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Slider.prototype,
    "min",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Slider.prototype,
    "max",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Slider.prototype,
    "step",
    void 0
);
__decorate([attr], Slider.prototype, "orientation", void 0);
__decorate([attr], Slider.prototype, "mode", void 0);
