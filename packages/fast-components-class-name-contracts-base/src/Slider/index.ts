/**
 * The class name contract for the slider component
 */
export interface SliderClassNameContract {
    /**
     * The root of the slider component
     */
    slider?: string;

    /**
     * The layout region of the slider component. Slider children end up in this container.
     */
    slider_layoutRegion?: string;

    /**
     * The fixed background track of the slider component
     * which determines click region and extent of the slider
     */
    slider_track?: string;

    /**
     * The cosmetic background track of the slider component
     */
    slider_backgroundTrack?: string;

    /**
     * The cosmetic foreground bar of the slider component that tracks the thumb
     */
    slider_foregroundTrack?: string;

    /**
     * The horizontal orientation modifier
     */
    slider__horizontal?: string;

    /**
     * The vertical orientation modifier
     */
    slider__vertical?: string;

    /**
     * The base thumb class
     */
    slider_thumb?: string;

    /**
     * The high value thumb
     */
    slider_thumb__upperValue?: string;

    /**
     * The low value thumb
     */
    slider_thumb__lowerValue?: string;

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
