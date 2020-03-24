import { attr, observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated";
import {
    keyCodeArrowRight,
    keyCodeArrowLeft,
    keyCodeArrowDown,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
import { convertPixelToPercent } from "./slider-utilities";

export function bool(value: string | boolean | null): boolean {
    return typeof value === "boolean" ? value : typeof value === "string";
}

export class Slider extends FormAssociated<HTMLInputElement> {
    @attr({ attribute: "readonly" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }

        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
        this.setAttribute("aria-readonly", bool(this.readOnly).toString());
    }

    @observable
    public backgroundTrack: HTMLDivElement;

    @observable
    public thumb: HTMLDivElement;

    @observable
    public direction: string = "ltr";
    private directionChanged(): void {
        console.log("directionChanged called this.direction:", this.direction);
    }

    @observable
    public position: string;
    @observable
    public fullTrackWidth: number = 0;
    @observable
    public fullTrackMinWidth: number = 0;

    @attr
    public label: string;

    /**
     * The element's value to be included in form submission when checked.
     * Default to "" to reach parity with input[type="range"]
     */
    @attr
    public value: string = "0"; // Map to proxy element.
    private valueChanged(): void {
        if (Number(this.value) === Number.NaN) {
            this.value = "0";
        }

        if (this.proxy instanceof HTMLElement) {
            this.updateForm();
        }

        const percentage: number =
            this.direction !== "rtl"
                ? (1 - (Number(this.value) / this.max - this.min)) * 100
                : (Number(this.value) / this.max - this.min) * 100;

        this.position = `right: ${percentage}%`;
    }

    /**
     * The element's min value
     */
    @attr
    public min: number = 0; // Map to proxy element.
    private minChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.min = `${this.min}`;
        }
    }

    /**
     * The element's max value
     */
    @attr
    public max: number = 10; // Map to proxy element.
    private maxChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.max = `${this.max}`;
        }
    }

    /**
     * The element's max value
     */
    @attr
    public step: number = 1; // Map to proxy element.
    private stepChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.step = `${this.step}`;
        }
    }

    /**
     * Set to true when the component has constructed
     */
    private constructed: boolean = false;
    protected proxy = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", "range");
        this.setAttribute("role", "slider");
        this.setAttribute("tabindex", "0");
        const dirAttribute = this.parentElement!.attributes["dir"];
        this.direction = dirAttribute ? dirAttribute.value : "ltr";
        this.constructed = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.updateForm();
        this.fullTrackWidth = this.backgroundTrack.clientWidth;
        this.fullTrackMinWidth = this.backgroundTrack.getBoundingClientRect().left;
        this.addEventListener("keydown", this.keypressHandler);
        this.addEventListener("mousedown", this.clickHandler);
        this.thumb.addEventListener("mousedown", this.handleThumbMouseDown);
    }

    public disconnectedCallback(): void {
        this.removeEventListener("keydown", this.keypressHandler);
        this.removeEventListener("mousedown", this.clickHandler);
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

    private updateForm = (): void => {
        this.proxy.value = this.value;
    };

    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleThumbMouseDown = (event: MouseEvent): void => {
        if (bool(this.readOnly) || bool(this.disabled) || event.defaultPrevented) {
            return;
        }

        event.preventDefault();
        (event.target as HTMLElement).focus();
        window.addEventListener("mouseup", this.handleWindowMouseUp);
        window.addEventListener("mousemove", this.handleMouseMove);
    };

    /**
     *  Handle mouse moves during a thumb drag operation
     */
    private handleMouseMove = (e: MouseEvent): void => {
        if (bool(this.readOnly) || bool(this.disabled) || e.defaultPrevented) {
            return;
        }

        // update the value based on current position
        this.value = `${this.calculateNewValue(e.pageX)}`;
        console.log("e.pageX:", e.pageX);
        console.log("e.clientX:", e.clientX);
        console.log("\n***New Value is now:", this.value, "\n");
        this.updateForm();
    };

    private calculateNewValue = (rawValue: number): number => {
        // update the value based on current position
        const newPosition = convertPixelToPercent(
            rawValue,
            this.fullTrackMinWidth,
            this.fullTrackWidth,
            this.direction
        );
        console.log("in calculateNewValue newPosition:", newPosition);
        const newValue: number = (this.max - this.min) * newPosition + this.min;
        console.log("calculateNewValue newValue:", newValue);
        return this.convertToConstrainedValue(newValue);
    };

    /**
     * Handle a window mouse up during a drag operation
     */
    private handleWindowMouseUp = (event: MouseEvent): void => {
        this.stopDragging();
    };

    private stopDragging = (): void => {
        window.removeEventListener("mouseup", this.handleWindowMouseUp);
        window.removeEventListener("mousemove", this.handleMouseMove);
    };

    private clickHandler = (e: MouseEvent) => {
        if (!bool(this.disabled) && !bool(this.readOnly)) {
            let trackElement: any = this.shadowRoot!.querySelector(".background-track");
            this.fullTrackWidth = trackElement.clientWidth;
            if (this.fullTrackWidth === 0) {
                this.fullTrackWidth = 1;
            }
            this.fullTrackMinWidth = trackElement.getBoundingClientRect().left;

            e.preventDefault();
            (e.target as HTMLElement).focus();
            window.addEventListener("mouseup", this.handleWindowMouseUp);
            window.addEventListener("mousemove", this.handleMouseMove);

            this.value = `${this.calculateNewValue(e.pageX)}`;
            console.log("clickHandler newValue:", this.value);
            this.updateForm();
        }
    };

    private convertToConstrainedValue = (value: number): number => {
        const remainderVal: number = value % Number(this.step);
        return remainderVal >= Number(this.step) / 2
            ? value - remainderVal + Number(this.step)
            : value - remainderVal;
    };

    private increment = (): void => {
        const incrementedVal: number = this.convertToConstrainedValue(
            Number(this.value) + Number(this.step)
        );
        const incrementedValString: string =
            incrementedVal < Number(this.max) ? `${incrementedVal}` : `${this.max}`;
        this.value = incrementedValString;
        this.updateForm();
    };

    private decrement = (): void => {
        const decrementedVal: number = this.convertToConstrainedValue(
            Number(this.value) - Number(this.step)
        );
        const decrementedValString: string =
            decrementedVal > Number(this.min) ? `${decrementedVal}` : `${this.min}`;
        this.value = decrementedValString;
        this.updateForm();
    };
}
