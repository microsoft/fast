import type {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "./anchored-region";

/**
 * A utility interface to facilitate passing around anchored region
 * configurations
 *
 * @public
 */
export interface AnchoredRegionConfig {
    /**
     *
     */
    fixedPlacement?: boolean;

    /**
     *
     */
    autoUpdateMode?: AutoUpdateMode;

    /**
     *
     */
    verticalPositioningMode: AxisPositioningMode;

    /**
     *
     */
    verticalDefaultPosition?: VerticalPosition;

    /**
     *
     */
    verticalInset: boolean;

    /**
     *
     */
    verticalScaling: AxisScalingMode;

    /**
     *
     */
    verticalThreshold?: number;

    /**
     *
     */
    horizontalPositioningMode: AxisPositioningMode;

    /**
     *
     */
    horizontalDefaultPosition?: HorizontalPosition;

    /**
     *
     */
    horizontalInset: boolean;

    /**
     *
     */
    horizontalScaling: AxisScalingMode;

    /**
     *
     */
    horizontalThreshold?: number;
}

/**
 * A flyout that always places itself below the anchor and has
 * a width to match the anchor
 */
export const flyoutBelow: AnchoredRegionConfig = {
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
 * A flyout that always places itself below the anchor, has
 * a width to match the anchor, and scales to span the space
 * between the anchor and the edge of the viewport
 */
export const flyoutBelowScaling: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: false,
    verticalScaling: "fill",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: true,
    horizontalScaling: "anchor",
};

/**
 * A flyout that always places itself above the anchor and has
 * a width to match the anchor
 */
export const flyoutAbove: AnchoredRegionConfig = {
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
 * A flyout that places itself above or below the anchor
 * based on available space.
 */
export const flyoutAboveOrBelow: AnchoredRegionConfig = {
    verticalPositioningMode: "dynamic",
    verticalInset: false,
    verticalScaling: "content",

    horizontalDefaultPosition: "right",
    horizontalPositioningMode: "locktodefault",
    horizontalInset: true,
    horizontalScaling: "anchor",
};

/**
 * A flyout that always places itself to the left of the anchor and has
 * a height to match the anchor
 */
export const flyoutLeft: AnchoredRegionConfig = {
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
 * A flyout that always places itself to the right of the anchor and has
 * a height to match the anchor
 */
export const flyoutRight: AnchoredRegionConfig = {
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
 * A flyout that always places itself to the right of the anchor and has
 * a height to match the anchor
 */
export const flyoutLeftOrRight: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "anchor",

    horizontalPositioningMode: "dynamic",
    horizontalInset: false,
    horizontalScaling: "content",
};

/**
 * A flyout that always places itself to the left of the anchor
 * drops down vertically
 */
export const dropDownLeft: AnchoredRegionConfig = {
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
 * A flyout that always places itself to the right of the anchor
 * drops down vertically
 */
export const dropDownRight: AnchoredRegionConfig = {
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
 * A flyout that places itself to the left or right of the anchor depending on space and
 * drops down vertically
 */
export const dropDownLeftOrRight: AnchoredRegionConfig = {
    verticalDefaultPosition: "bottom",
    verticalPositioningMode: "locktodefault",
    verticalInset: true,
    verticalScaling: "content",

    horizontalPositioningMode: "dynamic",
    horizontalInset: false,
    horizontalScaling: "content",
};
