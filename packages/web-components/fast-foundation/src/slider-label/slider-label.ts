import {
    attr,
    FASTElement,
    Notifier,
    Observable,
    observable,
} from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";
import { SliderConfiguration, SliderOrientation } from "../slider/slider.options.js";
import { convertPixelToPercent } from "../slider/slider-utilities.js";

const defaultConfig: SliderConfiguration = {
    min: 0,
    max: 0,
    direction: Direction.ltr,
    orientation: SliderOrientation.horizontal,
    disabled: false,
};

/**
 * A label element intended to be used with the {@link @microsoft/fast-foundation#(FASTSlider:class)} component.
 *
 * @slot - The default slot for the label content
 * @csspart container - The element wrapping the label mark and text
 * @csspart mark - The element wrapping the mark
 * @csspart content - The element wrapping the label text
 *
 * @public
 */
export class FASTSliderLabel extends FASTElement {
    /**
     * @internal
     */
    @observable
    public positionStyle: string;

    /**
     * @internal
     */
    public container: HTMLDivElement;

    /**
     * The position of the label relative to the min and max value of the parent {@link @microsoft/fast-foundation#(FASTSlider:class)}.
     *
     * @public
     * @remarks
     * HTML Attribute: position
     */
    @attr
    public position: string;
    protected positionChanged(): void {
        this.positionStyle = this.positionAsStyle();
    }

    /**
     * Hides the tick mark.
     *
     * @public
     * @remarks
     * HTML Attribute: hide-mark
     */
    @attr({ attribute: "hide-mark", mode: "boolean" })
    public hideMark: boolean = false;

    /**
     * The disabled state of the label. This is generally controlled by the parent {@link @microsoft/fast-foundation#(FASTSlider:class)}.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean; // Map to proxy element

    /**
     * The orientation state of the label. This is generally controlled by the parent {@link @microsoft/fast-foundation#(FASTSlider:class)}.
     *
     * @public
     * @deprecated - will be removed in coming ALPHA version
     * @remarks
     * HTML Attribute: orientation
     */
    @attr
    public orientation: SliderOrientation = SliderOrientation.horizontal;

    /**
     * @internal
     */
    protected orientationChanged(): void {
        void 0;
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
                this.orientation = source.orientation;
                break;
            case "max":
                this.sliderMaxPosition = source.max;
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
            this.orientation = defaultConfig.orientation || SliderOrientation.horizontal;
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
            this.orientation = orientation || SliderOrientation.horizontal;
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
        if (Number.isNaN(leftNum) && Number.isNaN(rightNum)) {
            rightNum = 50;
            leftNum = 50;
        }

        if (this.orientation === SliderOrientation.horizontal) {
            return direction === Direction.rtl
                ? `right: ${leftNum}%; left: ${rightNum}%;`
                : `left: ${leftNum}%; right: ${rightNum}%;`;
        } else {
            return `top: ${rightNum}%; bottom: ${leftNum}%;`;
        }
    };
}
