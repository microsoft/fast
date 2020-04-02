import { attr, FastElement, observable } from "@microsoft/fast-element";
import { FASTSlider } from "../slider";
import { SliderOrientation } from "../slider/slider";

export class SliderLabel extends FastElement {
    @observable
    public positionStyle: string;

    @observable
    public root: HTMLDivElement;

    @attr
    public max;

    @attr
    public position: string;

    @attr({ attribute: "hide-mark", mode: "boolean" })
    public hideMark: boolean = false;

    private sliderMax: number;
    private sliderMin: number;
    private sliderOrientation: SliderOrientation;

    public connectedCallback(): void {
        super.connectedCallback();
        this.setupSliderValues();
        this.positionStyle = this.positionAsStyle();
        this.styleForOrientation();
    }

    private setupSliderValues = (): void => {
        if (this.parentNode instanceof FASTSlider) {
            this.sliderMax = (this.parentNode as FASTSlider).max;
            this.sliderMin = (this.parentNode as FASTSlider).min;
            this.sliderOrientation = (this.parentNode as FASTSlider).orientation;
        } else {
            this.sliderMax = 0;
            this.sliderMin = 0;
            this.sliderOrientation = SliderOrientation.horizontal;
        }
    };

    private styleForOrientation = (): void => {
        if (this.sliderOrientation === SliderOrientation.horizontal) {
            this.root.classList.add("slider-label-horizontal");
        } else {
            this.root.classList.add("slider-label-vertical");
        }
    };

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
