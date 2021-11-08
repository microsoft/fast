import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";

/**
 * A gauge component to display a value in the context of its minimum and maximum values
 */
export class Gauge extends FoundationElement {
    /**
     * Value of the gauge
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public value: number = 0;

    /**
     * Updates the SVG graphics for the value and the displayed text
     * @param previous - the previous value
     * @param next - the next value
     * @internal
     */
    public valueChanged(previous, next) {
        if (this.hasInitialized) {
            this.setGaugeValue();
            this.animateText();
            this.titleDisplay = `${next} out of ${this.min ? `${this.min} to ` : ""}${
                this.max
            }${this.units || ""}`;
            // console.log(this.titleDisplay);
            this.$emit("change");
        }
    }

    /**
     * Minimum possible value
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public min: number = 0;

    /**
     * Maximum possible value
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public max: number = 100;

    /**
     * Title
     * @public
     */
    @attr
    public title: string;

    /**
     * Title text on hover
     * @private
     */
    @observable
    public titleDisplay: string;

    /**
     * Units of measurement
     * @public
     */
    @attr
    public units: string;

    /**
     * Displayed value
     * @internal
     */
    @observable
    public displayedText: string;

    /**
     * Label text for the gauge
     * @public
     */
    @attr
    public label: string;

    /**
     * Flag indicating that the gauge has loaded
     * @internal
     */
    @observable
    private hasInitialized: boolean = false;

    /**
     * The background SVG for the meter
     * @internal
     */
    public meterCircle: HTMLElement;

    /**
     * The value SVG for the gauge
     * @internal
     */
    public valueCircle: HTMLElement;

    /**
     * The face slot that contains the label and value text
     * @internal
     */
    public face: HTMLElement;

    /**
     * Initializes the gauge SVG and animations
     * @public
     */
    public connectedCallback() {
        super.connectedCallback();
        this.hasInitialized = true;
        this.valueChanged(this.min, this.value);
    }

    /**
     * Sets the gauge SVG styles
     * @internal
     */
    private setGaugeValue() {
        const fromStart = this.value - this.min;
        const range = this.max - this.min;
        const percentage = fromStart / range;
        const styles = window.getComputedStyle(this as any);
        const gaugeSize = parseInt(styles.getPropertyValue("--gauge-size")) || 360;
        const gaugeDirection =
            parseInt(styles.getPropertyValue("--gauge-direction")) ?? 1;
        const size = Math.floor(gaugeSize * percentage);
        let dash = `${size} ${360 - size}`;
        if (gaugeDirection == -1) {
            this.valueCircle.style.strokeDashoffset = `${gaugeSize}`;
        }
        setTimeout(() => {
            if (gaugeDirection == -1) {
                this.valueCircle.style.strokeDashoffset = `${size - gaugeSize}`;
            }
            this.valueCircle.style.strokeDasharray = `${dash}`;
        }, 1);
    }

    /**
     * Animates the value text
     * @param rate - Rate to increment, default is 1 or -1
     * @param time - Time between frames
     * @internal
     */
    private animateText(rate?, time?) {
        const current =
            this.displayedText === undefined ? this.min : parseFloat(this.displayedText);
        const incrementing = current < this.value;

        if (!rate || !time) {
            const styles = window.getComputedStyle(this.face);
            const getTime = str => parseFloat(str) * (str.indexOf("ms") >= 0 ? 1 : 1000);
            const duration = getTime(styles.getPropertyValue("transition-duration"));
            const delay = getTime(styles.getPropertyValue("transition-delay"));
            const valueChange = this.value - current;
            rate = valueChange;
            time = 0;
            if (Math.abs(valueChange) > duration) {
                rate = Math.round(valueChange / (duration * 60));
                time = duration / 60;
            } else if (Math.abs(valueChange) > 1) {
                rate = incrementing ? 1 : -1;
                time = Math.round(Math.abs(duration / valueChange));
            } else {
                this.displayedText = this.value.toString();
                return;
            }
            setTimeout(() => this.animateText(rate, time), delay);
        } else {
            let nextValue = current + rate;
            nextValue = Math[incrementing ? "min" : "max"](nextValue, this.value);
            this.displayedText = nextValue.toString();

            if (nextValue != this.value) {
                setTimeout(() => this.animateText(rate, time), time);
            }
        }
    }
}
