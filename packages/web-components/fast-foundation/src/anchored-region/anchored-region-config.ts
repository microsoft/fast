import type {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "./anchored-region";

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
    fixedPlacement?: boolean;

    /**
     * The auto-update setting of the component
     */
    autoUpdateMode?: AutoUpdateMode;

    /**
     * Sets what logic the component uses to determine vertical placement.
     */
    verticalPositioningMode: AxisPositioningMode;

    /**
     * The default vertical position of the region relative to the anchor element
     */
    verticalDefaultPosition?: VerticalPosition;

    /**
     * Whether the region overlaps the anchor on the vertical axis
     */
    verticalInset: boolean;

    /**
     * Defines how the height of the region is calculated
     */
    verticalScaling: AxisScalingMode;

    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     */
    verticalThreshold?: number;

    /**
     * Sets what logic the component uses to determine horizontal placement.
     */
    horizontalPositioningMode: AxisPositioningMode;

    /**
     * The default horizontal position of the region relative to the anchor element
     */
    horizontalDefaultPosition?: HorizontalPosition;

    /**
     *  hether the region overlaps the anchor on the horizontal axis
     */
    horizontalInset: boolean;

    /**
     * Defines how the width of the region is calculate
     */
    horizontalScaling: AxisScalingMode;

    /**
     * How short the space allocated to the default position has to be before the widest area
     * is selected for layout
     */
    horizontalThreshold?: number;
}

/**
 * A region that always places itself above the anchor, has
 * a width to match the anchor, and is sized vertically by content
 */
export const ARConfigAbove: AnchoredRegionConfig = {
    verticalDefaultPosition: "top",
    verticalPositioningMode: "locktodefault",
    verticalInset: false,
    verticalScaling: "content",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: true,
    horizontalScaling: "anchor",
};

/**
 * A region that always places itself below the anchor, has
 * a width to match the anchor, and is sized vertically by content
 */
export const ARConfigBelow: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: false,
    verticalScaling: "content",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: true,
    horizontalScaling: "anchor",
};

/**
 * A region that always places itself to the left of the anchor, has
 * a height to match the anchor, and is sized horizontally by content
 */
export const ARConfigLeft: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "anchor",

    horizontalDefaultPosition: "left",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: false,
    horizontalScaling: "content",
};

/**
 * A region that always places itself to the right of the anchor, has
 * a height to match the anchor, and is sized horizontally by content
 */
export const ARConfigRight: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "anchor",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: false,
    horizontalScaling: "content",
};

/**
 * A region that places itself above or below the anchor
 * based on available space, has a width to match the anchor,
 * and is sized vertically by content
 */
export const ARConfigTallest: AnchoredRegionConfig = {
    verticalPositioningMode: "dynamic",
    verticalInset: false,
    verticalScaling: "content",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: true,
    horizontalScaling: "anchor",
};

/**
 * A region that places itself to the left or right of the anchor
 * based on available space, has a height to match the anchor,
 * and is sized horizontally by content
 */
export const ARConfigWidest: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "anchor",

    horizontalPositioningMode: "dynamic",
    horizontalInset: false,
    horizontalScaling: "content",
};

/**
 * A region that always places itself to the left of the anchor,
 * has a height to match the content, is sized horizontally by content
 * and expands downwards from the top of the anchor
 */
export const ARConfigDropDownLeft: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "content",

    horizontalDefaultPosition: "left",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: false,
    horizontalScaling: "content",
};

/**
 * A region that always places itself to the right of the anchor,
 * has a height to match the content, is sized horizontally by content
 * and expands downwards from the top of the anchor
 */
export const ARConfigDropDownRight: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "content",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: false,
    horizontalScaling: "content",
};

/**
 * A region that places itself to the left or right of the anchor
 * based on available space, has a height to match the content,
 * is sized horizontally by content and expands downwards from the top
 * of the anchor
 */
export const ARConfigDropDownWidest: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "content",

    horizontalPositioningMode: "dynamic",
    horizontalInset: false,
    horizontalScaling: "content",
};
