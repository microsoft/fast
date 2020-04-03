import { attr, FastElement, observable } from "@microsoft/fast-element";
import { SliderOrientation, SliderConfiguration } from "../slider";
import { Direction } from "@microsoft/fast-web-utilities";

const defaultConfig: SliderConfiguration = {
    min: 0,
    max: 0,
    direction: Direction.ltr,
    orientation: SliderOrientation.horizontal,
};

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
    private config: SliderConfiguration = {
        min: 0,
        max: 0,
        direction: Direction.ltr,
        orientation: SliderOrientation.horizontal,
    };

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
        return node.max !== undefined && node.min !== undefined;
    }

    private getSliderConfiguration = (): void => {
        if (!this.isSliderConfig(this.parentNode)) {
            this.config = defaultConfig;
        } else {
            const { min, max, direction, orientation } = <SliderConfiguration>(
                this.parentNode
            );
            this.config = {
                min: min,
                max: max,
                direction: direction || Direction.ltr,
                orientation: orientation || SliderOrientation.horizontal,
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
        const direction: Direction = this.config.direction
            ? this.config.direction
            : Direction.ltr;
        const rightNum: number =
            ((this.config.max - this.config.min - Number(this.position)) /
                (this.config.max - this.config.min)) *
            100;
        const leftNum: number =
            (Number(this.position) / (this.config.min - this.config.min)) * 100;

        return direction === Direction.rtl
            ? `right: ${leftNum}%; left: ${rightNum}%;`
            : `left: ${leftNum}%; right: ${rightNum}%;`;
    };
}
