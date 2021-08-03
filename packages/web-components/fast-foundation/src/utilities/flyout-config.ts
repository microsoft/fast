import {
    AnchoredRegionConfig,
    ARConfigAbove,
    ARConfigBelow,
    ARConfigDropDownLeft,
    ARConfigDropDownRight,
    ARConfigDropDownWidest,
    ARConfigLeft,
    ARConfigRight,
    ARConfigTallest,
    ARConfigWidest,
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
export const FlyoutAbove: FlyoutConfig = {
    anchoredRegionConfig: ARConfigAbove,
};

/**
 * A flyout that always places itself below the anchor, has
 * a width to match the anchor, and is sized vertically by content
 */
export const FlyoutBelow: FlyoutConfig = {
    anchoredRegionConfig: ARConfigBelow,
};

/**
 * A flyout that always places itself to the left of the anchor, has
 * a height to match the anchor, and is sized horizontally by content
 */
export const FlyoutLeft: FlyoutConfig = {
    anchoredRegionConfig: ARConfigLeft,
};

/**
 * A flyout that always places itself to the right of the anchor, has
 * a height to match the anchor, and is sized horizontally by content
 */
export const FlyoutRight: FlyoutConfig = {
    anchoredRegionConfig: ARConfigRight,
};

/**
 * A flyout that places itself above or below the anchor
 * based on available space, has a width to match the anchor,
 * and is sized vertically by content
 */
export const FlyoutTallest: FlyoutConfig = {
    anchoredRegionConfig: ARConfigTallest,
};

/**
 * A flyout that places itself to the left or right of the anchor
 * based on available space, has a height to match the anchor,
 * and is sized horizontally by content
 */
export const FlyoutWidest: FlyoutConfig = {
    anchoredRegionConfig: ARConfigWidest,
};

/**
 * A flyout that always places itself to the left of the anchor,
 * has a height to match the content, is sized horizontally by content
 * and expands downwards from the top of the anchor
 */
export const FlyoutDropDownLeft: FlyoutConfig = {
    anchoredRegionConfig: ARConfigDropDownLeft,
};

/**
 * A flyout that always places itself to the right of the anchor,
 * has a height to match the content, is sized horizontally by content
 * and expands downwards from the top of the anchor
 */
export const FlyoutDropDownRight: FlyoutConfig = {
    anchoredRegionConfig: ARConfigDropDownRight,
};

/**
 * A flyout that places itself to the left or right of the anchor
 * based on available space, has a height to match the content,
 * is sized horizontally by content and expands downwards from the top
 * of the anchor
 */
export const FlyoutDropDownWidest: FlyoutConfig = {
    anchoredRegionConfig: ARConfigDropDownWidest,
};
