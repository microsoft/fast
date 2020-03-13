import { attr, FastElement, observable, Observable } from "@microsoft/fast-element";
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
    private positionChanged(): void {
        console.log("position changed:", this.position);
        //Prolly this is wrong
        //this.positionStyle = `right: ${this.position}%`;
    }

    @attr
    public label: string;

    @attr({ attribute: "show-mark" })
    public showMark: string;

    private sliderMax: number;
    private sliderMin: number;
    private sliderWidth: number;
    private sliderMinimumPosition: number;

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        console.log("fast-slider-label label:", this.label);
        console.log("parentNode:", this.parentNode);
        console.log(
            "parent.fullTrackWidth",
            (this.parentElement as FASTSlider).fullTrackWidth
        );
        console.log(
            "parent.getBoundingClientRect().left",
            (this.parentNode as FASTSlider).fullTrackMinWidth
        );
        this.sliderMax = (this.parentNode as FASTSlider).max;
        this.sliderMin = (this.parentNode as FASTSlider).min;
        this.sliderMinimumPosition = Number(
            (this.parentNode as FASTSlider).fullTrackMinWidth
        );
        this.sliderWidth = Number((this.parentNode as FASTSlider).fullTrackWidth);
        console.log("sliderMinimumPosition:", this.sliderMinimumPosition);
        console.log("sliderWidth:", this.sliderWidth);
        console.log("slider.max:", this.sliderMax);
        console.log("slider.min:", this.sliderMin);
        console.log("this.position:", this.position);
        const newPosition: number = this.convertPixelToPercent(Number(this.position));
        const newValue: number =
            (this.sliderMax - this.sliderMin) * newPosition + this.sliderMin;
        console.log("slider-label newValue:", newValue);
        console.log("positionStyle:", this.positionAsStyle());
        this.positionStyle = this.positionAsStyle();
    }

    private positionAsStyle = (): any => {
        const rightNum: number =
            ((this.sliderMax - this.sliderMin - Number(this.position)) /
                (this.sliderMax - this.sliderMin)) *
            100;
        const leftNum: number =
            (Number(this.position) / (this.sliderMax - this.sliderMin)) * 100;
        //`right: ${this.position}%`

        return `left: ${leftNum}%; right: ${rightNum}%;`;
    };

    private convertPixelToPercent = (pixelPos: number): number => {
        let pct: number = 0;
        pct = (pixelPos - this.sliderMinimumPosition) / this.sliderWidth;
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
        console.log("pct:", pct);
        return pct;
    };

    //     /**
    //  * Converts value to a percent of slider range
    //  */
    // private valueAsPercent = (value: number): number => {
    //     return (
    //         ((value - this.props.range.minValue) /
    //             (this.props.range.maxValue - this.props.range.minValue)) *
    //         100
    //     );
    // };

    // /**
    //  *  Converts a percent value to the equivalent value on the bar range
    //  */
    // private percentAsValue = (value: number): number => {
    //     return (
    //         ((this.props.range.maxValue - this.props.range.minValue) / 100) * value +
    //         this.props.range.minValue
    //     );
    // };

    public disconnectedCallback(): void {}
}
