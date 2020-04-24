import { attr, FASTElement, observable, Observable } from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";
import { SliderConfiguration, SliderOrientation } from "../slider";
import { convertPixelToPercent } from "../slider/slider-utilities";
import { FASTSlider } from "../slider";

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

    private config: SliderConfiguration = {
        min: 0,
        max: 0,
        direction: Direction.ltr,
        orientation: SliderOrientation.horizontal,
    };

    @attr({ mode: "boolean" })
    public disabled: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
        this.getSliderConfiguration();
        this.setStyleForOrientation();
        this.positionStyle = this.positionAsStyle();
        const notifier = Observable.getNotifier(this.parentNode as FASTSlider);
        const handler = {
            sliderLabel: this,
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            handleChange(source: any, propertyName: string) {
                if (
                    propertyName === "direction" ||
                    propertyName === "max" ||
                    propertyName === "min"
                ) {
                    this.sliderLabel.getSliderConfiguration();
                } else if (propertyName === "orientation") {
                    this.sliderLabel.getSliderConfiguration();
                    this.sliderLabel.setStyleForOrientation();
                }
                this.sliderLabel.positionStyle = this.sliderLabel.positionAsStyle();
            },
        };

        notifier.subscribe(handler, "orientation");
        notifier.subscribe(handler, "direction");
        notifier.subscribe(handler, "max");
        notifier.subscribe(handler, "min");
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
