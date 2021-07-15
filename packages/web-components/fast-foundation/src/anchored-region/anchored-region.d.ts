import { FoundationElement } from "../foundation-element";
import type { ConstructibleResizeObserver } from "./resize-observer";
declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }
}
/**
 * Defines the base behavior of an anchored region on a particular axis
 *
 * @beta
 */
export declare type AxisPositioningMode = "uncontrolled" | "locktodefault" | "dynamic";
/**
 * Defines the scaling behavior of an anchored region on a particular axis
 *
 * @beta
 */
export declare type AxisScalingMode = "anchor" | "fill" | "content";
/**
 * Defines the horizontal positioning options for an anchored region
 *
 * @beta
 */
export declare type HorizontalPosition = "start" | "end" | "left" | "right" | "unset";
/**
 * Defines the vertical positioning options for an anchored region
 *
 * @beta
 */
export declare type VerticalPosition = "top" | "bottom" | "unset";
/**
 * Defines if the component updates its position automatically. Calling update() always provokes an update.
 * anchor - the component only updates its position when the anchor resizes (default)
 * auto - the component updates its position when:
 * - update() is called
 * - the anchor resizes
 * - the window resizes
 * - the viewport resizes
 * - any scroll event in the document
 *
 * @beta
 */
export declare type AutoUpdateMode = "anchor" | "auto";
/**
 * describes the possible horizontal positions of the region relative
 * to its anchor
 *
 * @internal
 */
declare type AnchoredRegionHorizontalPositionLabel =
    | "left"
    | "insetLeft"
    | "insetRight"
    | "right"
    | "undefined";
/**
 * describes the possible vertical positions of the region relative
 * to its anchor
 *
 * @internal
 */
declare type AnchoredRegionVerticalPositionLabel =
    | "top"
    | "insetTop"
    | "insetBottom"
    | "bottom"
    | "undefined";
/**
 * An anchored region Custom HTML Element.
 *
 * @beta
 */
export declare class AnchoredRegion extends FoundationElement {
    /**
     * The HTML ID of the anchor element this region is positioned relative to
     *
     * @beta
     * @remarks
     * HTML Attribute: anchor
     */
    anchor: string;
    private anchorChanged;
    /**
     * The HTML ID of the viewport element this region is positioned relative to
     *
     * @beta
     * @remarks
     * HTML Attribute: anchor
     */
    viewport: string;
    private viewportChanged;
    /**
     * Sets what logic the component uses to determine horizontal placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the horizontal axis
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-positioning-mode
     */
    horizontalPositioningMode: AxisPositioningMode;
    private horizontalPositioningModeChanged;
    /**
     * The default horizontal position of the region relative to the anchor element
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-default-position
     */
    horizontalDefaultPosition: HorizontalPosition;
    private horizontalDefaultPositionChanged;
    /**
     * Whether the region overlaps the anchor on the horizontal axis
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-inset
     */
    horizontalInset: boolean;
    private horizontalInsetChanged;
    /**
     * How narrow the space allocated to the default position has to be before the widest area
     * is selected for layout
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-threshold
     */
    horizontalThreshold: number;
    private horizontalThresholdChanged;
    /**
     * Defines how the width of the region is calculated
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-scaling
     */
    horizontalScaling: AxisScalingMode;
    private horizontalScalingChanged;
    /**
     * Sets what logic the component uses to determine vertical placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the vertical axis
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-positioning-mode
     */
    verticalPositioningMode: AxisPositioningMode;
    private verticalPositioningModeChanged;
    /**
     * The default vertical position of the region relative to the anchor element
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-default-position
     */
    verticalDefaultPosition: VerticalPosition;
    private verticalDefaultPositionChanged;
    /**
     * Whether the region overlaps the anchor on the vertical axis
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-inset
     */
    verticalInset: boolean;
    private verticalInsetChanged;
    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-threshold
     */
    verticalThreshold: number;
    private verticalThresholdChanged;
    /**
     * Defines how the height of the region is calculated
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-scaling
     */
    verticalScaling: AxisScalingMode;
    private verticalScalingChanged;
    /**
     * Whether the region is positioned using css "position: fixed".
     * Otherwise the region uses "position: absolute".
     * Fixed placement allows the region to break out of parent containers,
     *
     * @beta
     * @remarks
     * HTML Attribute: fixed-placement
     */
    fixedPlacement: boolean;
    private fixedPlacementChanged;
    /**
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    autoUpdateMode: AutoUpdateMode;
    private autoUpdateModeChanged;
    /**
     * The HTML element being used as the anchor
     *
     * @beta
     */
    anchorElement: HTMLElement | null;
    private anchorElementChanged;
    /**
     * The HTML element being used as the viewport
     *
     * @beta
     */
    viewportElement: HTMLElement | null;
    private viewportElementChanged;
    /**
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    initialLayoutComplete: boolean;
    /**
     * indicates the current horizontal position of the region
     */
    verticalPosition: AnchoredRegionVerticalPositionLabel;
    /**
     * indicates the current vertical position of the region
     */
    horizontalPosition: AnchoredRegionHorizontalPositionLabel;
    /**
     * values to be applied to the component's positioning attributes on render
     */
    private regionTop;
    private regionRight;
    private regionBottom;
    private regionLeft;
    /**
     * the span in pixels of the selected position on each axis
     */
    private regionWidth;
    private regionHeight;
    private containingBlockWidth;
    private containingBlockHeight;
    private xTransformOrigin;
    private yTransformOrigin;
    private resizeDetector;
    private viewportRect;
    private anchorRect;
    private regionRect;
    private regionDimension;
    private anchorTop;
    private anchorRight;
    private anchorBottom;
    private anchorLeft;
    private anchorHeight;
    private anchorWidth;
    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset;
    private baseVerticalOffset;
    private pendingPositioningUpdate;
    private pendingLayoutUpdate;
    private pendingReset;
    private currentDirection;
    private regionVisible;
    private updateThreshold;
    private static intersectionService;
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
    adoptedCallback(): void;
    /**
     * update position
     */
    update: () => void;
    /**
     * Public function to enable authors to update the layout based on changes in anchor offset without resorting
     * to a more epensive update call
     */
    updateAnchorOffset: (
        horizontalOffsetDelta: number,
        verticalOffsetDelta: number
    ) => void;
    /**
     * destroys the instance's resize observer
     */
    private disconnectResizeDetector;
    /**
     * initializes the instance's resize observer
     */
    private initializeResizeDetector;
    /**
     * react to attribute changes that don't require a reset
     */
    private updateForAttributeChange;
    /**
     * fully initializes the component
     */
    private initialize;
    /**
     * Request a layout update if there are currently no open requests
     */
    private requestLayoutUpdate;
    /**
     * Request a reset if there are currently no open requests
     */
    private requestReset;
    /**
     * sets the starting configuration for component internal values
     */
    private setInitialState;
    /**
     * starts observers
     */
    private startObservers;
    /**
     * get position updates
     */
    private requestPositionUpdates;
    /**
     * stops observers
     */
    private stopObservers;
    /**
     * Gets the viewport element by id, or defaults to document root
     */
    private getViewport;
    /**
     *  Gets the anchor element by id
     */
    private getAnchor;
    /**
     *  Handle intersections
     */
    private handleIntersection;
    /**
     *  iterate through intersection entries and apply data
     */
    private applyIntersectionEntries;
    /**
     *  compare rects to see if there is enough change to justify a DOM update
     */
    private isRectDifferent;
    /**
     *  Update data based on anchor intersections
     */
    private handleAnchorIntersection;
    /**
     *  Update data based on positioner intersections
     */
    private handleRegionIntersection;
    /**
     *  Handle resize events
     */
    private handleResize;
    /**
     * resets the component
     */
    private reset;
    /**
     *  Recalculate layout related state values
     */
    private updateLayout;
    /**
     *  Updates the style string applied to the region element as well as the css classes attached
     *  to the root element
     */
    private updateRegionStyle;
    /**
     * Get horizontal positioning state based on desired position
     */
    private setHorizontalPosition;
    /**
     * Get vertical positioning state based on desired position
     */
    private setVerticalPosition;
    /**
     *  Update the offset values
     */
    private updateRegionOffset;
    /**
     *  Get available Horizontal positions based on positioning mode
     */
    private getHorizontalPositioningOptions;
    /**
     * Get available Vertical positions based on positioning mode
     */
    private getVerticalPositioningOptions;
    /**
     *  Get the width available for a particular horizontal position
     */
    private getAvailableWidth;
    /**
     *  Get the height available for a particular vertical position
     */
    private getAvailableHeight;
    /**
     * Get region dimensions
     */
    private getNextRegionDimension;
    /**
     * starts event listeners that can trigger auto updating
     */
    private startAutoUpdateEventListeners;
    /**
     * stops event listeners that can trigger auto updating
     */
    private stopAutoUpdateEventListeners;
}
export {};
