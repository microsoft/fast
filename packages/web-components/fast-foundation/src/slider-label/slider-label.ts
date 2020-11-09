import {
    attr,
    css,
    FASTElement,
    Notifier,
    Observable,
    observable,
} from "@microsoft/fast-element";
import { Direction, Orientation } from "@microsoft/fast-web-utilities";
import { convertPixelToPercent } from "../slider/slider-utilities";
import { SliderConfiguration } from "../slider/index";

const defaultConfig: SliderConfiguration = {
    min: 0,
    max: 0,
    direction: Direction.ltr,
    orientation: Orientation.horizontal,
    disabled: false,
};

const heightNumber =
    "(var(--base-height-multiplier) + var(--density)) * var(--design-unit)";

/**
 * A label element intended to be used with the {@link @microsoft/fast-foundation#Slider} component.
 *
 * @public
 */
export class SliderLabel extends FASTElement {
    protected horizontalStyles = css`
        :host {
            align-self: start;
            grid-row: 2;
            margin-top: -2px;
            height: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
            width: auto;
        }
        .container {
            grid-template-rows: auto auto;
            grid-template-columns: 0;
        }
    `;

    protected verticalStyles = css`
        :host {
            justify-self: start;
            grid-column: 2;
            margin-left: 2px;
            height: auto;
            width: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        }
        .container {
            grid-template-columns: auto auto;
            grid-template-rows: 0;
            min-width: calc(var(--thumb-size) * 1px);
            height: calc(var(--thumb-size) * 1px);
        }
        .mark {
            transform: rotate(90deg);
            align-self: center;
        }
        .label {
            margin-left: calc((var(--design-unit) / 2) * 2px);
            align-self: center;
        }
    `;
    /**
     * @internal
     */
    @observable
    public positionStyle: string;

    /**
     * @internal
     */
    public root: HTMLDivElement;

    /**
     * The position of the label relative to the min and max value of the parent {@link @microsoft/fast-foundation#Slider}.
     * @public
     * HTML Attribute: position
     */
    @attr
    public position: string;
    private positionChanged(): void {
        this.positionStyle = this.positionAsStyle();
    }

    /**
     * Hides the tick mark.
     *
     * @public
     * HTML Attribute: hide-mark
     */
    @attr({ attribute: "hide-mark", mode: "boolean" })
    public hideMark: boolean = false;

    /**
     * The disabled state of the label. This is generally controlled by the parent {@link @microsoft/fast-foundation#Slider}.
     *
     * @public
     * HTML Attribute: disabled
     */
    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean; // Map to proxy element

    /**
     * @internal
     */
    @observable
    public sliderOrientation: Orientation;
    private sliderOrientationChanged(): void {
        if (this.sliderOrientation === Orientation.horizontal) {
            this.$fastController.addStyles(this.horizontalStyles);
            this.$fastController.removeStyles(this.verticalStyles);
        } else {
            this.$fastController.addStyles(this.verticalStyles);
            this.$fastController.removeStyles(this.horizontalStyles);
        }
    }

    /**
     * @internal
     */
    @observable
    public sliderMinPosition: number;

    /**
     * @internal
     */
    @observable
    public sliderMaxPosition: number;

    /**
     * @internal
     */
    @observable
    public sliderDirection: Direction = Direction.ltr;

    private notifier: Notifier;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.getSliderConfiguration();
        this.positionStyle = this.positionAsStyle();
        this.notifier = Observable.getNotifier(this.parentNode);
        this.notifier.subscribe(this, "orientation");
        this.notifier.subscribe(this, "direction");
        this.notifier.subscribe(this, "max");
        this.notifier.subscribe(this, "min");
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.notifier.unsubscribe(this, "orientation");
        this.notifier.unsubscribe(this, "direction");
        this.notifier.unsubscribe(this, "max");
        this.notifier.unsubscribe(this, "min");
    }

    /**
     * @internal
     */
    public handleChange(source: any, propertyName: string) {
        switch (propertyName) {
            case "direction":
                this.sliderDirection = source.direction;
                break;
            case "orientation":
                this.sliderOrientation = source.orientation;
                break;
            case "max":
                this.sliderMinPosition = source.max;
                break;
            case "min":
                this.sliderMinPosition = source.min;
                break;
            default:
                break;
        }
        this.positionStyle = this.positionAsStyle();
    }

    private isSliderConfig(node: any): node is SliderConfiguration {
        return node.max !== undefined && node.min !== undefined;
    }

    private getSliderConfiguration = (): void => {
        if (!this.isSliderConfig(this.parentNode)) {
            this.sliderDirection = defaultConfig.direction || Direction.ltr;
            this.sliderOrientation = defaultConfig.orientation || Orientation.horizontal;
            this.sliderMaxPosition = defaultConfig.max;
            this.sliderMinPosition = defaultConfig.min;
        } else {
            const parentSlider: SliderConfiguration | null = this
                .parentNode as SliderConfiguration;
            const { min, max, direction, orientation, disabled } = parentSlider;
            if (disabled !== undefined) {
                this.disabled = disabled;
            }
            this.sliderDirection = direction || Direction.ltr;
            this.sliderOrientation = orientation || Orientation.horizontal;
            this.sliderMaxPosition = max;
            this.sliderMinPosition = min;
        }
    };

    private positionAsStyle = (): any => {
        const direction: Direction = this.sliderDirection
            ? this.sliderDirection
            : Direction.ltr;

        const pct = convertPixelToPercent(
            Number(this.position),
            Number(this.sliderMinPosition),
            Number(this.sliderMaxPosition)
        );
        let rightNum: number = Math.round((1 - pct) * 100);
        let leftNum: number = Math.round(pct * 100);
        if (leftNum === Number.NaN && rightNum === Number.NaN) {
            rightNum = 50;
            leftNum = 50;
        }

        if (this.sliderOrientation === Orientation.horizontal) {
            return direction === Direction.rtl
                ? `right: ${leftNum}%; left: ${rightNum}%;`
                : `left: ${leftNum}%; right: ${rightNum}%;`;
        } else {
            return `top: ${leftNum}%; bottom: ${rightNum}%;`;
        }
    };
}
