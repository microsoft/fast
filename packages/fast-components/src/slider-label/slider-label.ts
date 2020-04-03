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

    constructor() {
        super();
        this.getSliderConfiguration();
    }
    public connectedCallback(): void {
        super.connectedCallback();
        this.positionStyle = this.positionAsStyle();
        this.styleForOrientation();
    }

    private isSliderConfig(node: any): node is SliderConfiguration {
        return node.max !== undefined;
    }

    private getSliderConfiguration = (): void => {
        if (!this.isSliderConfig(this.parentNode)) {
            this.config = {
                min: 0,
                max: 0,
                direction: Direction.ltr,
                orientation: SliderOrientation.horizontal,
            };
        } else {
            this.config = <SliderConfiguration>this.parentNode;
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
        const direction: string = this.config.direction;
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
