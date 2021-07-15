var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, Observable, observable } from "@microsoft/fast-element";
import { Direction, Orientation } from "@microsoft/fast-web-utilities";
import { convertPixelToPercent } from "../slider/slider-utilities";
import { FoundationElement } from "../foundation-element";
const defaultConfig = {
    min: 0,
    max: 0,
    direction: Direction.ltr,
    orientation: Orientation.horizontal,
    disabled: false,
};
/**
 * A label element intended to be used with the {@link @microsoft/fast-foundation#(Slider:class)} component.
 *
 * @public
 */
export class SliderLabel extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * Hides the tick mark.
         *
         * @public
         * @remarks
         * HTML Attribute: hide-mark
         */
        this.hideMark = false;
        /**
         * @internal
         */
        this.sliderDirection = Direction.ltr;
        this.getSliderConfiguration = () => {
            if (!this.isSliderConfig(this.parentNode)) {
                this.sliderDirection = defaultConfig.direction || Direction.ltr;
                this.sliderOrientation =
                    defaultConfig.orientation || Orientation.horizontal;
                this.sliderMaxPosition = defaultConfig.max;
                this.sliderMinPosition = defaultConfig.min;
            } else {
                const parentSlider = this.parentNode;
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
        this.positionAsStyle = () => {
            const direction = this.sliderDirection ? this.sliderDirection : Direction.ltr;
            const pct = convertPixelToPercent(
                Number(this.position),
                Number(this.sliderMinPosition),
                Number(this.sliderMaxPosition)
            );
            let rightNum = Math.round((1 - pct) * 100);
            let leftNum = Math.round(pct * 100);
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
    positionChanged() {
        this.positionStyle = this.positionAsStyle();
    }
    /**
     * @internal
     */
    sliderOrientationChanged() {
        void 0;
    }
    /**
     * @internal
     */
    connectedCallback() {
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
    disconnectedCallback() {
        super.disconnectedCallback();
        this.notifier.unsubscribe(this, "orientation");
        this.notifier.unsubscribe(this, "direction");
        this.notifier.unsubscribe(this, "max");
        this.notifier.unsubscribe(this, "min");
    }
    /**
     * @internal
     */
    handleChange(source, propertyName) {
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
    isSliderConfig(node) {
        return node.max !== undefined && node.min !== undefined;
    }
}
__decorate([observable], SliderLabel.prototype, "positionStyle", void 0);
__decorate([attr], SliderLabel.prototype, "position", void 0);
__decorate(
    [attr({ attribute: "hide-mark", mode: "boolean" })],
    SliderLabel.prototype,
    "hideMark",
    void 0
);
__decorate(
    [attr({ attribute: "disabled", mode: "boolean" })],
    SliderLabel.prototype,
    "disabled",
    void 0
);
__decorate([observable], SliderLabel.prototype, "sliderOrientation", void 0);
__decorate([observable], SliderLabel.prototype, "sliderMinPosition", void 0);
__decorate([observable], SliderLabel.prototype, "sliderMaxPosition", void 0);
__decorate([observable], SliderLabel.prototype, "sliderDirection", void 0);
