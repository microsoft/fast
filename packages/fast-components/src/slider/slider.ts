import { attr, FastElement, observable, Observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated";
import {
    keyCodeArrowRight,
    keyCodeArrowLeft,
    keyCodeArrowDown,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
//import { bool } from "../utilities";

export function bool(value: string | boolean | null): boolean {
    return typeof value === "boolean" ? value : typeof value === "string";
}

/* tslint:disable:member-ordering */
export class Slider extends FormAssociated<HTMLInputElement> {
    @attr({ attribute: "readonly" })
    public readOnly: boolean; // Map to proxy element
    @observable
    public backgroundTrack: HTMLDivElement;
    @observable
    public position: string;
    private positionOnSlider: number = 0;

    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }

        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
        this.setAttribute("aria-readonly", bool(this.readOnly).toString());
    }

    @attr
    public label: string;

    /**
     * The element's value to be included in form submission when checked.
     * Default to "" to reach parity with input[type="range"]
     */
    @attr
    public value: string = "5"; // Map to proxy element.
    private valueChanged(): void {
        if (Number(this.value) === Number.NaN) {
            this.value = "0";
        }

        console.log("\n***** value changed this.value:", this.value);
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }

        const percentage: number = (1 - (Number(this.value) / this.max - this.min)) * 100;
        console.log("percentage:", percentage);
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

        this.constructed = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        //this.updateForm();

        this.addEventListener("keypress", this.keypressHandler);
        this.addEventListener("click", this.clickHandler);
    }

    public disconnectedCallback(): void {
        this.removeEventListener("keypress", this.keypressHandler);
        this.removeEventListener("click", this.clickHandler);
    }

    protected keypressHandler = (e: KeyboardEvent) => {
        super.keypressHandler(e);

        console.log("keypressHandler happened e:", e);
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

    private clickHandler = (e: MouseEvent) => {
        console.log("clickedHandler e:", e);
        if (!bool(this.disabled) && !bool(this.readOnly)) {
            if (e.clientX > this.positionOnSlider) {
                this.increment();
            } else {
                this.decrement();
            }
            console.log("e.movementX:", e.movementX);
            console.log("e.clientX:", e.clientX);
            console.log("this.positionOnSlider:", this.positionOnSlider);
            this.positionOnSlider = e.clientX;
        }

        // console.log("track ref element this.track.slot:", this.crimsonTide.slot);
        // console.log("this.track.clientWidth:", this.crimsonTide.clientWidth);
        // console.log("this.track.style.left", this.crimsonTide.style.left);
    };

    private increment = (): void => {
        console.log("incrementing the slider value value:", this.value);

        if (Number(this.value) + Number(this.step) < Number(this.max)) {
            this.value = `${Number(this.value) + 1}`;
            this.proxy.value = `${Number(this.value) + 1}`;
        }
    };

    private decrement = (): void => {
        if (Number(this.value) - this.step > this.min) {
            this.value = `${Number(this.value) - this.step}`;
            this.proxy.value = `${Number(this.value) - this.step}`;
        }
    };
}
