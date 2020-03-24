import { attr, FastElement, observable } from "@microsoft/fast-element";
import { FASTSlider } from "../slider";
export function bool(value: string | boolean | null): boolean {
    return typeof value === "boolean" ? value : typeof value === "string";
}

/* tslint:disable:member-ordering */
export class SliderLabel extends FastElement {
    @observable
    public positionStyle: string;

    @attr
    public max;

    @attr
    public position: string;

    @attr
    public label: string;

    @attr({ attribute: "hide-mark" })
    public hideMark: boolean = false;

    private sliderMax: number;
    private sliderMin: number;
    private sliderWidth: number;
    private sliderMinimumPosition: number;

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.sliderMax = (this.parentNode as FASTSlider).max;
        this.sliderMin = (this.parentNode as FASTSlider).min;
        this.sliderMinimumPosition = Number(
            (this.parentNode as FASTSlider).fullTrackMinWidth
        );
        this.sliderWidth = Number((this.parentNode as FASTSlider).fullTrackWidth);
        this.positionStyle = this.positionAsStyle();
    }

    private positionAsStyle = (): any => {
        const direction: string = (this.parentNode as FASTSlider).direction;
        const rightNum: number =
            ((this.sliderMax - this.sliderMin - Number(this.position)) /
                (this.sliderMax - this.sliderMin)) *
            100;
        const leftNum: number =
            (Number(this.position) / (this.sliderMax - this.sliderMin)) * 100;

        return direction === "rtl"
            ? `right: ${leftNum}%; left: ${rightNum}%;`
            : `left: ${leftNum}%; right: ${rightNum}%;`;
    };
}
