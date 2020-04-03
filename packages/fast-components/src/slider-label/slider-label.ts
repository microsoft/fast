import { attr, FastElement, observable } from "@microsoft/fast-element";
import { SliderOrientation, SliderConfiguration } from "../slider";
import { Direction } from "@microsoft/fast-web-utilities";

export class SliderLabel extends FastElement {
    @observable
    public positionStyle: string;

    public root: HTMLDivElement;

    @attr
    public position: string;
    private positionChanged(): void {
        this.positionStyle = this.positionAsStyle();
    }

    @attr({ attribute: "hide-mark", mode: "boolean" })
    public hideMark: boolean = false;
    private config: SliderConfiguration;

    public connectedCallback(): void {
        super.connectedCallback();
        this.getSliderConfiguration();
        this.positionStyle = this.positionAsStyle();
        this.styleForOrientation();
    }

    private getSliderConfiguration = (): void => {
        this.config = (this.parentNode as unknown) as SliderConfiguration;
        if ((<SliderConfiguration>(this.parentNode as unknown)).max === undefined) {
            this.config = {
                min: 0,
                max: 0,
                direction: Direction.ltr,
                orientation: SliderOrientation.horizontal,
            };
        }
    };

    private styleForOrientation = (): void => {
        if (this.config.orientation === SliderOrientation.horizontal) {
            this.root.classList.add("slider-label-horizontal");
        } else {
            this.root.classList.add("slider-label-vertical");
        }
    };

    private positionAsStyle = (): any => {
        const direction: string = "ltr"; //this.sliderDirection;
        const rightNum: number =
            ((this.config.max - this.config.min - Number(this.position)) /
                (this.config.max - this.config.min)) *
            100;
        const leftNum: number =
            (Number(this.position) / (this.config.min - this.config.min)) * 100;

        return direction === "rtl"
            ? `right: ${leftNum}%; left: ${rightNum}%;`
            : `left: ${leftNum}%; right: ${rightNum}%;`;
    };
}
