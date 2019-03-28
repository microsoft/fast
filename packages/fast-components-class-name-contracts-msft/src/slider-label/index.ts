import { SliderTrackItemClassNameContract as BaseSliderTrackItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the slider label component
 */
export interface SliderLabelClassNameContract
    extends BaseSliderTrackItemClassNameContract {
    /**
     * The root of the slider label component
     */
    sliderLabel?: string;

    /**
     * The label portion of the slider label component
     */
    sliderLabel_positioningPanel?: string;

    /**
     * The label portion of the slider label component
     */
    sliderLabel_label?: string;

    /**
     * The label position min modifier,
     * applied to positioning panel at min end of range
     */
    sliderLabel__positionMin: string;

    /**
     * The label position max modifier
     * applied to positioning panel at max end of range
     */
    sliderLabel__positionMax?: string;

    /**
     * The tick mark portion of the slider label component
     */
    sliderLabel_tickMark?: string;

    /**
     * The horizontal orientation modifier
     */
    sliderLabel__orientationHorizontal?: string;

    /**
     * The vertical orientation modifier
     */
    sliderLabel__orientationVertical?: string;

    /**
     * The rtl modifier
     */
    sliderLabel__rtl?: string;
}
