import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";
import { SliderConfiguration, SliderOrientation } from "../slider";
import { convertPixelToPercent } from "../slider/slider-utilities";

const defaultConfig: SliderConfiguration = {
    min: 0,
    max: 0,
    direction: Direction.ltr,
    orientation: SliderOrientation.horizontal,
    disabled: false,
};

export class SliderLabel extends FASTElement {
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

    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean; // Map to proxy element
    private disabledChanged(): void {
        this.disabled
            ? this.classList.add("disabled")
            : this.classList.remove("disabled");
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.getSliderConfiguration();
        this.setStyleForOrientation();
        this.positionStyle = this.positionAsStyle();
    }

    private setStyleForOrientation = (): void => {
        if (this.config.orientation === SliderOrientation.horizontal) {
            this.classList.add("horizontal");
        } else {
            this.classList.add("vertical");
        }
    };

    private isSliderConfig(node: any): node is SliderConfiguration {
        return node.max !== undefined && node.min !== undefined;
    }

    private getSliderConfiguration = (): void => {
        if (!this.isSliderConfig(this.parentNode)) {
            this.config = defaultConfig;
        } else {
            const { min, max, direction, orientation, disabled } = this
                .parentNode as SliderConfiguration;
            if (disabled !== undefined) {
                this.disabled = disabled;
            }
            this.config = {
                min,
                max,
                direction: direction || Direction.ltr,
                orientation: orientation || SliderOrientation.horizontal,
                disabled: disabled || false,
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
