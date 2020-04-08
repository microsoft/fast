import { attr, FastElement, observable } from "@microsoft/fast-element";
import { SliderConfiguration, SliderOrientation } from "../slider";
import { Direction } from "@microsoft/fast-web-utilities";
import { convertPixelToPercent } from "../slider/slider-utilities";

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
    public config: SliderConfiguration = {
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
        this.setStyleForOrientation();
        this.positionStyle = this.positionAsStyle();
    }

    private setStyleForOrientation = (): void => {
        if (this.config.orientation === SliderOrientation.horizontal) {
            this.classList.add("slider-label-horizontal");
        } else {
            this.classList.add("slider-label-vertical");
        }
    };

    private isSliderConfig(node: any): node is SliderConfiguration {
        return node.max !== undefined && node.min !== undefined;
    }

    private getSliderConfiguration = (): void => {
        if (!this.isSliderConfig(this.parentNode)) {
            this.config = defaultConfig;
        } else {
            const { min, max, direction, orientation } = this
                .parentNode as SliderConfiguration;
            this.config = {
                min,
                max,
                direction: direction || Direction.ltr,
                orientation: orientation || SliderOrientation.horizontal,
            };
        }
    };

    private positionAsStyle = (): any => {
        const direction: Direction = this.config.direction
            ? this.config.direction
            : Direction.ltr;

        const pct = convertPixelToPercent(
            Number(this.position),
            this.config.min,
            this.config.max
        );
        let rightNum: number = Math.round((1 - pct) * 100);
        let leftNum: number = Math.round(pct * 100);
        if (leftNum === Number.NaN && rightNum === Number.NaN) {
            rightNum = 50;
            leftNum = 50;
        }

        if (this.config.orientation === SliderOrientation.horizontal) {
            return direction === Direction.rtl
                ? `right: ${leftNum}%; left: ${rightNum}%;`
                : `left: ${leftNum}%; right: ${rightNum}%;`;
        } else {
            return `top: ${leftNum}%; bottom: ${rightNum}%;`;
        }
    };
}
