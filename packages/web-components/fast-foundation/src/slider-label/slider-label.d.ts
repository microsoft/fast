import { Direction, Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
/**
 * A label element intended to be used with the {@link @microsoft/fast-foundation#(Slider:class)} component.
 *
 * @public
 */
export declare class SliderLabel extends FoundationElement {
    /**
     * @internal
     */
    positionStyle: string;
    /**
     * @internal
     */
    root: HTMLDivElement;
    /**
     * The position of the label relative to the min and max value of the parent {@link @microsoft/fast-foundation#(Slider:class)}.
     *
     * @public
     * @remarks
     * HTML Attribute: position
     */
    position: string;
    private positionChanged;
    /**
     * Hides the tick mark.
     *
     * @public
     * @remarks
     * HTML Attribute: hide-mark
     */
    hideMark: boolean;
    /**
     * The disabled state of the label. This is generally controlled by the parent {@link @microsoft/fast-foundation#(Slider:class)}.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * @internal
     */
    sliderOrientation: Orientation;
    /**
     * @internal
     */
    protected sliderOrientationChanged(): void;
    /**
     * @internal
     */
    sliderMinPosition: number;
    /**
     * @internal
     */
    sliderMaxPosition: number;
    /**
     * @internal
     */
    sliderDirection: Direction;
    private notifier;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @internal
     */
    handleChange(source: any, propertyName: string): void;
    private isSliderConfig;
    private getSliderConfiguration;
    private positionAsStyle;
}
