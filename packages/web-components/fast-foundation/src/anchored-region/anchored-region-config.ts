import type {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "./anchored-region.options.js";

/**
 * A utility interface to store anchored region
 * configurations that correspond to various common flyout
 * positioning schemes
 *
 * @public
 */
export interface AnchoredRegionConfig {
    /**
     * Whether the region is positioned using css "position: fixed".
     * Otherwise the region uses "position: absolute".
     * Fixed placement allows the region to break out of parent containers,
     */
    readonly fixedPlacement?: boolean;

    /**
     * The auto-update setting of the component
     */
    readonly autoUpdateMode?: AutoUpdateMode;

    /**
     * Sets what logic the component uses to determine vertical placement.
     */
    readonly verticalPositioningMode?: AxisPositioningMode;

    /**
     * The default vertical position of the region relative to the anchor element
     */
    readonly verticalDefaultPosition?: VerticalPosition;

    /**
     * Whether the region overlaps the anchor on the vertical axis
     */
    readonly verticalInset?: boolean;

    /**
     * Defines how the height of the region is calculated
     */
    readonly verticalScaling?: AxisScalingMode;

    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     */
    readonly verticalThreshold?: number;

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the vertical axis
     */
    readonly verticalViewportLock?: boolean;

    /**
     * Sets what logic the component uses to determine horizontal placement.
     */
    readonly horizontalPositioningMode?: AxisPositioningMode;

    /**
     * The default horizontal position of the region relative to the anchor element
     */
    readonly horizontalDefaultPosition?: HorizontalPosition;

    /**
     *  hether the region overlaps the anchor on the horizontal axis
     */
    readonly horizontalInset?: boolean;

    /**
     * Defines how the width of the region is calculate
     */
    readonly horizontalScaling?: AxisScalingMode;

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the horizontal axis
     */
    readonly horizontalViewportLock?: boolean;

    /**
     * How short the space allocated to the default position has to be before the widest area
     * is selected for layout
     */
    readonly horizontalThreshold?: number;
}

/**
 * Building blocks - partial configs
 */

/**
 * A region that matches the size and position of the anchor horizontally
 */
const horizontalAnchorOverlay: AnchoredRegionConfig = {
    horizontalDefaultPosition: "center",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: false,
    horizontalScaling: "anchor",
};

/**
 * Exported configs
 */

/**
 * A region that always places itself above the anchor, has
 * a width to match the anchor, and is sized vertically by content
 *
 * @public
 */
export const FlyoutPosTop: AnchoredRegionConfig = {
    ...horizontalAnchorOverlay,
    verticalDefaultPosition: "top",
    verticalPositioningMode: "locktodefault",
    verticalInset: false,
    verticalScaling: "content",
};

/**
 * A region that always places itself below the anchor, has
 * a width to match the anchor, and is sized vertically by content
 *
 * @public
 */
export const FlyoutPosBottom: AnchoredRegionConfig = {
    ...horizontalAnchorOverlay,
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: false,
    verticalScaling: "content",
};

/**
 * A region that places itself above or below the anchor
 * based on available space, has a width to match the anchor,
 * and is sized vertically by content
 *
 * @public
 */
export const FlyoutPosTallest: AnchoredRegionConfig = {
    ...horizontalAnchorOverlay,
    verticalPositioningMode: "dynamic",
    verticalInset: false,
    verticalScaling: "content",
};

/**
 * A region that always places itself above the anchor, has
 * a width to match the anchor, and is sized vertically by available space
 *
 * @public
 */
export const FlyoutPosTopFill: AnchoredRegionConfig = {
    ...FlyoutPosTop,
    verticalScaling: "fill",
};

/**
 * A region that always places itself below the anchor, has
 * a width to match the anchor, and is sized vertically by available space
 *
 * @public
 */
export const FlyoutPosBottomFill: AnchoredRegionConfig = {
    ...FlyoutPosBottom,
    verticalScaling: "fill",
};

/**
 * A region that places itself above or below the anchor
 * based on available space, has a width to match the anchor,
 * and is sized vertically by available space
 *
 * @public
 */
export const FlyoutPosTallestFill: AnchoredRegionConfig = {
    ...FlyoutPosTallest,
    verticalScaling: "fill",
};
