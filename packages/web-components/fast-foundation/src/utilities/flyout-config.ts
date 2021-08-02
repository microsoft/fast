import {
    Above as AnchoredRegionAbove,
    Below as AnchoredRegionBelow,
    AnchoredRegionConfig,
    DropDownLeft as AnchoredRegionDropDownLeft,
    DropDownRight as AnchoredRegionDropDownRight,
    DropDownWidest as AnchoredRegionDropDownWidest,
    Left as AnchoredRegionLeft,
    Right as AnchoredRegionRight,
    Tallest as AnchoredRegionTallest,
    Widest as AnchoredRegionWidest,
} from "../anchored-region/anchored-region-config";

/**
 * A utility interface to describe common flyout positioning behaviors.
 * Initially this will be limited to anchored-region configuration but
 * can be expanded or switched to other flyout positioning mechanisms
 * (such as the native html/css mechanism being proposed)
 *
 * @public
 */
export interface FlyoutConfig {
    /**
     * A utility interface to describe common flyout positioning choicees
     */
    anchoredRegionConfig?: AnchoredRegionConfig;
}

/**
 * A flyout that always places itself above the anchor, has
 * a width to match the anchor, and is sized vertically by content
 */
export const Above: FlyoutConfig = {
    anchoredRegionConfig: AnchoredRegionAbove,
};

/**
 * A flyout that always places itself below the anchor, has
 * a width to match the anchor, and is sized vertically by content
 */
export const Below: FlyoutConfig = {
    anchoredRegionConfig: AnchoredRegionBelow,
};

/**
 * A flyout that always places itself to the left of the anchor, has
 * a height to match the anchor, and is sized horizontally by content
 */
export const Left: FlyoutConfig = {
    anchoredRegionConfig: AnchoredRegionLeft,
};

/**
 * A flyout that always places itself to the right of the anchor, has
 * a height to match the anchor, and is sized horizontally by content
 */
export const Right: FlyoutConfig = {
    anchoredRegionConfig: AnchoredRegionRight,
};

/**
 * A flyout that places itself above or below the anchor
 * based on available space, has a width to match the anchor,
 * and is sized vertically by content
 */
export const Tallest: FlyoutConfig = {
    anchoredRegionConfig: AnchoredRegionTallest,
};

/**
 * A flyout that places itself to the left or right of the anchor
 * based on available space, has a height to match the anchor,
 * and is sized horizontally by content
 */
export const Widest: FlyoutConfig = {
    anchoredRegionConfig: AnchoredRegionWidest,
};
