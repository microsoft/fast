import {
    attr,
    FastElement,
    nullableNumberConverter,
    observable,
    Observable,
} from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated";
import {
    Direction,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
import { convertPixelToPercent } from "./slider-utilities";
import { SliderConfiguration, SliderMode, SliderOrientation } from "./index";

export class Slider extends FormAssociated<HTMLInputElement>
    implements SliderConfiguration {
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }

        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
        this.setAttribute("aria-readonly", this.readOnly.toString());
    }

    public root: HTMLDivElement;
    public track: HTMLDivElement;
    public thumb: HTMLDivElement;

    @observable
    public direction: Direction = Direction.ltr;

    @observable
    public isDragging: boolean = false;

    @observable
    public position: string;
    @observable
    public trackWidth: number = 0;
    @observable
    public trackMinWidth: number = 0;

    /**
     * The element's value to be included in form submission changed.
     */
    @attr
    public value: string; // Map to proxy element.
    private valueChanged(): void {
        if (Number(this.value) === Number.NaN) {
            this.value = "1";
        }

        if (this.proxy instanceof HTMLElement) {
            this.updateForm();
        }

        const percentage: number =
            this.direction !== Direction.rtl
                ? (1 - Number(this.value) / (Number(this.max) - Number(this.min))) * 100
                : (Number(this.value) / (Number(this.max) - Number(this.min))) * 100;

        if (this.orientation === SliderOrientation.horizontal) {
            this.position = this.isDragging
                ? `right: ${percentage}%; transition: all 0.1s ease;`
                : `right: ${percentage}%; transition: all 0.2s ease;`;
        } else {
            this.position = this.isDragging
                ? `bottom: ${percentage}%; transition: all 0.1s ease;`
                : `bottom: ${percentage}%; transition: all 0.2s ease;`;
        }

        this.$emit("change");
    }

    /**
     * Min allowed value default is 0
     */
    @attr({ converter: nullableNumberConverter })
    public min: number = 0; // Map to proxy element.
    private minChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.min = `${this.min}`;
        }
    }

    /**
     * Max allowed value default is 10
     */
    @attr({ converter: nullableNumberConverter })
    public max: number = 10; // Map to proxy element.
    private maxChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.max = `${this.max}`;
        }
    }

    /**
     * Value to increment or decrement via arrow keys, mouse click or drag
     */
    @attr({ converter: nullableNumberConverter })
    public step: number = 1; // Map to proxy element.
    private stepChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.step = `${this.step}`;
        }
    }

    /**
     * Orientation value, horizontal | vertical
     */
    @attr
    public orientation: SliderOrientation = SliderOrientation.horizontal;

    /**
     * mode value, default singleValue
     */
    @attr
    public mode: SliderMode = SliderMode.singleValue;

    protected proxy = document.createElement("input");

    constructor() {
        super();
        this.proxy.setAttribute("type", "range");
        this.direction = this.getDirection();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.updateForm();
        this.setupTrackConstraints();
        this.setupListeners();
        this.setupDefaultValue();
    }

    public disconnectedCallback(): void {
        this.removeEventListener("keydown", this.keypressHandler);
        this.removeEventListener("mousedown", this.clickHandler);
        this.thumb.removeEventListener("mousedown", this.handleThumbMouseDown);
    }

    protected keypressHandler = (e: KeyboardEvent) => {
        super.keypressHandler(e);
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
    };

    private getDirection = (): Direction => {
        const dirNode: HTMLElement | null = this.parentElement!.closest("[dir]");
        return dirNode !== null && dirNode.dir === "rtl" ? Direction.rtl : Direction.ltr;
    };

    private setupTrackConstraints = (): void => {
        this.trackWidth = this.track.clientWidth;
        this.trackMinWidth = this.track.clientLeft;
        console.log("clientHeight:", this.track.clientHeight);
        console.log(
            "this.track.getBoundingClientRect().height:",
            this.track.getBoundingClientRect().height
        );
        console.log(
            "this.track.getBoundingClientRect().bottom:",
            this.track.getBoundingClientRect().bottom
        );
        console.log("this.track.clientTop:", this.track.clientTop);
    };

    private setupListeners = (): void => {
        this.addEventListener("keydown", this.keypressHandler);
        this.addEventListener("mousedown", this.clickHandler);
        this.thumb.addEventListener("mousedown", this.handleThumbMouseDown);
    };

    private setupDefaultValue = (): void => {
        if (this.value === "") {
            this.value = `${this.convertToConstrainedValue((this.max - this.min) / 2)}`;
            this.updateForm();
        }
    };

    private updateForm = (): void => {
        this.setFormValue(this.value, this.value);
    };

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
        this.isDragging = true;
    };

    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleMouseMove = (e: MouseEvent): void => {
        if (this.readOnly || this.disabled || e.defaultPrevented) {
            return;
        }
        // update the value based on current position
        const eventValue: number =
            this.orientation === SliderOrientation.horizontal ? e.pageX : e.pageY;
        this.value = `${this.calculateNewValue(eventValue)}`;
        this.updateForm();
    };

    private calculateNewValue = (rawValue: number): number => {
        // update the value based on current position
        const newPosition = convertPixelToPercent(
            rawValue,
            this.trackMinWidth,
            this.trackWidth,
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
    };

    private clickHandler = (e: MouseEvent) => {
        if (!this.disabled && !this.readOnly) {
            this.trackWidth = this.track.clientWidth;
            if (this.trackWidth === 0) {
                this.trackWidth = 1;
            }
            e.preventDefault();
            (e.target as HTMLElement).focus();
            window.addEventListener("mouseup", this.handleWindowMouseUp);
            window.addEventListener("mousemove", this.handleMouseMove);

            const controlValue: number =
                this.orientation === SliderOrientation.horizontal ? e.pageX : e.pageY;
            this.value = `${this.calculateNewValue(controlValue)}`;
            this.updateForm();
        }
    };

    private convertToConstrainedValue = (value: number): number => {
        const remainderVal: number = value % Number(this.step);
        const constrainedVal: number =
            remainderVal >= Number(this.step) / 2
                ? value - remainderVal + Number(this.step)
                : value - remainderVal;

        if (constrainedVal < this.min || constrainedVal > this.max) {
            // TODO here until we figure out how this happens
            return Number(this.value);
        } else {
            return constrainedVal;
        }
    };

    private increment = (): void => {
        const newVal: number =
            this.direction !== Direction.rtl
                ? Number(this.value) + Number(this.step)
                : Number(this.value) - Number(this.step);
        const incrementedVal: number = this.convertToConstrainedValue(newVal);
        const incrementedValString: string =
            incrementedVal < Number(this.max) ? `${incrementedVal}` : `${this.max}`;
        this.value = incrementedValString;
        this.updateForm();
    };

    private decrement = (): void => {
        const newVal =
            this.direction !== Direction.rtl
                ? Number(this.value) - Number(this.step)
                : Number(this.value) + Number(this.step);
        const decrementedVal: number = this.convertToConstrainedValue(newVal);
        const decrementedValString: string =
            decrementedVal > Number(this.min) ? `${decrementedVal}` : `${this.min}`;
        this.value = decrementedValString;
        this.updateForm();
    };
}
