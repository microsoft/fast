/**
 * The class name contract for the slider component
 */
export interface SliderClassNameContract {
    /**
     * The root of the slider component
     */
    slider?: string;

    /**
     * The layout panel of the slider component. Slider children end up in this container.
     */
    slider_layoutPanel?: string;

    /**
     * The fixed background track of the slider component
     * which determines click region and extent of the slider
     */
    slider_barTrack?: string;

    /**
     * The cosmetic background track of the slider component
     */
    slider_barBack?: string;

    /**
     * The cosmetic foreground bar of the slider component that tracks the thumb
     */
    slider_barFront?: string;

    /**
     * The horizontal orientation modifier
     */
    slider__orientationHorizontal?: string;

    /**
     * The vertical orientation modifier
     */
    slider__orientationVertical?: string;

    /**
     * The base thumb class
     */
    slider_thumb?: string;

    /**
     * The low value thumb
     */
    slider_thumb_upper?: string;

    /**
     * The high value thumb
     */
    slider_thumb_lower?: string;

    /**
     * The disabled modifier
     */
    slider__disabled?: string;

    /**
     * rtl modifier
     */
    slider__rtl?: string;

    /**
     * mode modifiers
     */
    slider__modeSingle?: string;
    slider__modeAdjustLower?: string;
    slider__modeAdjustUpper?: string;
    slider__modeAdjustBoth?: string;
}
