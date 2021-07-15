import { Direction } from "@microsoft/fast-web-utilities";
import type {
    AnchoredRegion,
    AxisPositioningMode,
    AxisScalingMode,
} from "../anchored-region";
import { FoundationElement } from "../foundation-element";
import { TooltipPosition } from "./tooltip.options";
export { TooltipPosition };
/**
 * An Tooltip Custom HTML Element.
 *
 * @public
 */
export declare class Tooltip extends FoundationElement {
    private static DirectionAttributeName;
    /**
     * Whether the tooltip is visible or not.
     * If undefined tooltip is shown when anchor element is hovered
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: visible
     */
    visible: boolean;
    private visibleChanged;
    /**
     * The id of the element the tooltip is anchored to
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: anchor
     */
    anchor: string;
    private anchorChanged;
    /**
     * The delay in milliseconds before a tooltip is shown after a hover event
     *
     * @defaultValue - 300
     * @public
     * HTML Attribute: delay
     */
    delay: number;
    /**
     * Controls the placement of the tooltip relative to the anchor.
     * When the position is undefined the tooltip is placed above or below the anchor based on available space.
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: position
     */
    position: TooltipPosition;
    private positionChanged;
    /**
     * the html element currently being used as anchor.
     * Setting this directly overrides the anchor attribute.
     *
     * @public
     */
    anchorElement: HTMLElement | null;
    private anchorElementChanged;
    /**
     * The current viewport element instance
     *
     * @internal
     */
    viewportElement: HTMLElement | null;
    private viewportElementChanged;
    /**
     * @internal
     */
    verticalPositioningMode: AxisPositioningMode;
    /**
     * @internal
     */
    horizontalPositioningMode: AxisPositioningMode;
    /**
     * @internal
     */
    horizontalInset: string;
    /**
     * @internal
     */
    verticalInset: string;
    /**
     * @internal
     */
    horizontalScaling: AxisScalingMode;
    /**
     * @internal
     */
    verticalScaling: AxisScalingMode;
    /**
     * @internal
     */
    verticalDefaultPosition: string | undefined;
    /**
     * @internal
     */
    horizontalDefaultPosition: string | undefined;
    /**
     * @internal
     */
    tooltipVisible: boolean;
    /**
     * Track current direction to pass to the anchored region
     * updated when tooltip is shown
     *
     * @internal
     */
    currentDirection: Direction;
    /**
     * reference to the anchored region
     *
     * @internal
     */
    region: AnchoredRegion;
    /**
     * The timer that tracks delay time before the tooltip is shown on hover
     */
    private delayTimer;
    /**
     * Indicates whether the anchor is currently being hovered
     */
    private isAnchorHovered;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * invoked when the anchored region's position relative to the anchor changes
     *
     * @internal
     */
    handlePositionChange: (ev: Event) => void;
    /**
     * mouse enters anchor
     */
    private handleAnchorMouseOver;
    /**
     * mouse leaves anchor
     */
    private handleAnchorMouseOut;
    /**
     * starts the hover timer if not currently running
     */
    private startHoverTimer;
    /**
     * starts the hover delay timer
     */
    private startHover;
    /**
     * clears the hover delay
     */
    private clearDelayTimer;
    /**
     * updated the properties being passed to the anchored region
     */
    private updateLayout;
    /**
     *  Gets the anchor element by id
     */
    private getAnchor;
    /**
     * handles key down events to check for dismiss
     */
    private handleDocumentKeydown;
    /**
     * determines whether to show or hide the tooltip based on current state
     */
    private updateTooltipVisibility;
    /**
     * shows the tooltip
     */
    private showTooltip;
    /**
     * hides the tooltip
     */
    private hideTooltip;
    /**
     * updates the tooltip anchored region props after it has been
     * added to the DOM
     */
    private setRegionProps;
}
