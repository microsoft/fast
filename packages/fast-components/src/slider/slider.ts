import { attr, observable } from "@microsoft/fast-element";
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
    public value: string = "5"; // Map to proxy element.
    private valueChanged(): void {
        if (Number(this.value) === Number.NaN) {
            this.value = "0";
        }

        if (this.proxy instanceof HTMLElement) {
            this.updateForm();
        }

        const percentage: number = (1 - (Number(this.value) / this.max - this.min)) * 100;
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
        this.updateForm();
        this.fullTrackWidth = this.backgroundTrack.clientWidth;
        this.fullTrackMinWidth = this.backgroundTrack.getBoundingClientRect().left;
        this.addEventListener("keydown", this.keypressHandler);
        this.addEventListener("mousedown", this.clickHandler);
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

    private clickHandler = (e: MouseEvent) => {
        if (!bool(this.disabled) && !bool(this.readOnly)) {
            let trackElement: any = this.shadowRoot!.querySelector(".background-track");
            this.fullTrackWidth = trackElement.clientWidth;
            if (this.fullTrackWidth === 0) {
                this.fullTrackWidth = 1;
            }
            this.fullTrackMinWidth = trackElement.getBoundingClientRect().left;
            const newPosition = this.convertPixelToPercent(e.pageX);
            const newValue: number = (this.max - this.min) * newPosition + this.min;
            this.value = `${newValue}`;
            this.updateForm();
        }
    };

    private increment = (): void => {
        const incrementedVal: number = Number(this.value) + Number(this.step);
        const incrementedValString: string =
            incrementedVal < Number(this.max) ? `${incrementedVal}` : `${this.max}`;
        this.value = incrementedValString;
        this.updateForm();
    };

    private decrement = (): void => {
        const decrementedVal: number = Number(this.value) - Number(this.step);
        const decrementedValString: string =
            decrementedVal > Number(this.min) ? `${decrementedVal}` : `${this.min}`;
        this.value = decrementedValString;
        this.updateForm();
    };

    /**
     * Converts a pixel coordinate on the track to a percent of the track's range
     */
    private convertPixelToPercent = (pixelPos: number): number => {
        let pct: number = 0;
        pct = (pixelPos - this.fullTrackMinWidth) / this.fullTrackWidth;
        if (pct < 0) {
            pct = 0;
        } else if (pct > 1) {
            pct = 1;
        }

        // if (
        //     this.state.direction === Direction.rtl &&
        //     this.props.orientation !== SliderOrientation.vertical
        // ) {
        //     pct = 1 - pct;
        // }

        return pct;
    };
}
