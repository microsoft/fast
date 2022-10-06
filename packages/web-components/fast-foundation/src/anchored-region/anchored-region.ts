import { attr, FASTElement, observable, Updates } from "@microsoft/fast-element";
import { inject } from "@microsoft/fast-element/di";

import type {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    HorizontalPosition,
    VerticalPosition,
} from "./anchored-region.options.js";
import { AnchoredPositioner } from "./anchored-positioner.js";

/**
 * An anchored region Custom HTML Element.
 *
 * @slot - The default slot for the content
 * @fires loaded - Fires a custom 'loaded' event when the region is loaded and visible
 * @fires positionchange - Fires a custom 'positionchange' event when the position has changed
 *
 * @public
 */
export class FASTAnchoredRegion extends FASTElement {
    @inject(AnchoredPositioner) positioner!: AnchoredPositioner;

    /**
     * The HTML ID of the anchor element this region is positioned relative to
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public anchor: string = "";
    protected anchorChanged(): void {
        if (this.$fastController.isConnected) {
            this.anchorElement = this.getAnchor();
        }
    }

    /**
     * The HTML ID of the viewport element this region is positioned relative to
     *
     * @public
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public viewport: string = "";
    protected viewportChanged(): void {
        if (this.$fastController.isConnected) {
            this.viewportElement = this.getViewport();
        }
    }

    /**
     * When true current point anchor is updated with mouse moves
     *
     * @public
     * @remarks
     * HTML Attribute: mouse-tracking
     */
    @attr({ attribute: "mouse-tracking", mode: "boolean" })
    public mouseTracking: boolean = false;
    protected mouseTrackingChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.mouseTracking = this.mouseTracking;
        }
    }

    /**
     * When true the point anchor coordinate is used as anchor
     *
     * @public
     * @remarks
     * HTML Attribute: use-point-anchor
     */
    @attr({ attribute: "use-point-anchor", mode: "boolean" })
    public usePointAnchor: boolean = false;
    protected usePointAnchorChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.usePointAnchor = this.usePointAnchor;
        }
    }

    /**
     * Initial X coordinate when using point anchor
     *
     * @public
     * @remarks
     * HTML Attribute: point-anchor-x
     */
    @attr({ attribute: "point-anchor-x" })
    public pointAnchorX: number = 0;
    protected pointAnchorXChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.pointAnchorX = this.pointAnchorX;
        }
    }

    /**
     * Initial y coordinate when using point anchor
     *
     * @public
     * @remarks
     * HTML Attribute: point-anchor-y
     */
    @attr({ attribute: "point-anchor-y" })
    public pointAnchorY: number = 0;
    protected pointAnchorYChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.pointAnchorY = this.pointAnchorY;
        }
    }

    /**
     * Sets what logic the component uses to determine horizontal placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the horizontal axis
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-positioning-mode
     */
    @attr({ attribute: "horizontal-positioning-mode" })
    public horizontalPositioningMode: AxisPositioningMode = "uncontrolled";
    protected horizontalPositioningModeChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.horizontalPositioningMode = this.horizontalPositioningMode;
        }
    }

    /**
     * The default horizontal position of the region relative to the anchor element
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-default-position
     */
    @attr({ attribute: "horizontal-default-position" })
    public horizontalDefaultPosition: HorizontalPosition = "unset";
    protected horizontalDefaultPositionChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.horizontalDefaultPosition = this.horizontalDefaultPosition;
        }
    }

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the horizontal axis
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-viewport-lock
     */
    @attr({ attribute: "horizontal-viewport-lock", mode: "boolean" })
    public horizontalViewportLock: boolean = false;
    protected horizontalViewportLockChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.horizontalViewportLock = this.horizontalViewportLock;
        }
    }

    /**
     * Whether the region overlaps the anchor on the horizontal axis
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-inset
     */
    @attr({ attribute: "horizontal-inset", mode: "boolean" })
    public horizontalInset: boolean = false;
    protected horizontalInsetChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.horizontalInset = this.horizontalInset;
        }
    }

    /**
     * How narrow the space allocated to the default position has to be before the widest area
     * is selected for layout
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-threshold
     */
    @attr({ attribute: "horizontal-threshold" })
    public horizontalThreshold: number;
    protected horizontalThresholdChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.horizontalThreshold = this.horizontalThreshold;
        }
    }

    /**
     * Defines how the width of the region is calculated
     *
     * @public
     * @remarks
     * HTML Attribute: horizontal-scaling
     */
    @attr({ attribute: "horizontal-scaling" })
    public horizontalScaling: AxisScalingMode = "content";
    protected horizontalScalingChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.horizontalScaling = this.horizontalScaling;
        }
    }

    /**
     * Sets what logic the component uses to determine vertical placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the vertical axis
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-positioning-mode
     */
    @attr({ attribute: "vertical-positioning-mode" })
    public verticalPositioningMode: AxisPositioningMode = "uncontrolled";
    protected verticalPositioningModeChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.verticalPositioningMode = this.verticalPositioningMode;
        }
    }

    /**
     * The default vertical position of the region relative to the anchor element
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-default-position
     */
    @attr({ attribute: "vertical-default-position" })
    public verticalDefaultPosition: VerticalPosition = "unset";
    protected verticalDefaultPositionChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.verticalDefaultPosition = this.verticalDefaultPosition;
        }
    }

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the vertical axis
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-viewport-lock
     */
    @attr({ attribute: "vertical-viewport-lock", mode: "boolean" })
    public verticalViewportLock: boolean = false;
    protected verticalViewportLockChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.verticalViewportLock = this.verticalViewportLock;
        }
    }

    /**
     * Whether the region overlaps the anchor on the vertical axis
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-inset
     */
    @attr({ attribute: "vertical-inset", mode: "boolean" })
    public verticalInset: boolean = false;
    protected verticalInsetChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.verticalInset = this.verticalInset;
        }
    }

    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-threshold
     */
    @attr({ attribute: "vertical-threshold" })
    public verticalThreshold: number;
    protected verticalThresholdChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.verticalThreshold = this.verticalThreshold;
        }
    }

    /**
     * Defines how the height of the region is calculated
     *
     * @public
     * @remarks
     * HTML Attribute: vertical-scaling
     */
    @attr({ attribute: "vertical-scaling" })
    public verticalScaling: AxisScalingMode = "content";
    protected verticalScalingChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.verticalScaling = this.verticalScaling;
        }
    }

    /**
     * Whether the region is positioned using css "position: fixed".
     * Otherwise the region uses "position: absolute".
     * Fixed placement allows the region to break out of parent containers,
     *
     * @public
     * @remarks
     * HTML Attribute: fixed-placement
     */
    @attr({ attribute: "fixed-placement", mode: "boolean" })
    public fixedPlacement: boolean = false;
    protected fixedPlacementChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.fixedPlacement = this.fixedPlacement;
        }
    }

    /**
     * Defines what triggers the anchored region to revaluate positioning
     *
     * @public
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    @attr({ attribute: "auto-update-mode" })
    public autoUpdateMode: AutoUpdateMode = "anchor";
    protected autoUpdateModeChanged(
        prevMode: AutoUpdateMode,
        newMode: AutoUpdateMode
    ): void {
        if (this.$fastController.isConnected) {
            this.positioner.autoUpdateMode = this.autoUpdateMode;
        }
    }

    /**
     * The HTML element being used as the anchor
     *
     * @public
     */
    @observable
    public anchorElement: HTMLElement | null = null;
    protected anchorElementChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.anchorElement = this.anchorElement;
        }
    }

    /**
     * The HTML element being used as the viewport
     *
     * @public
     */
    @observable
    public viewportElement: HTMLElement | null = null;
    protected viewportElementChanged(): void {
        if (this.$fastController.isConnected) {
            this.positioner.viewportElement = this.viewportElement;
        }
    }

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.viewportElement = this.getViewport();
        this.anchorElement = this.getAnchor();
        this.positioner.mouseTracking = this.mouseTracking;
        this.positioner.usePointAnchor = this.usePointAnchor;
        this.positioner.pointAnchorX = this.pointAnchorX;
        this.positioner.pointAnchorY = this.pointAnchorY;
        this.positioner.horizontalPositioningMode = this.horizontalPositioningMode;
        this.positioner.horizontalDefaultPosition = this.horizontalDefaultPosition;
        this.positioner.horizontalViewportLock = this.horizontalViewportLock;
        this.positioner.horizontalInset = this.horizontalInset;
        this.positioner.horizontalThreshold = this.horizontalThreshold;
        this.positioner.horizontalScaling = this.horizontalScaling;
        this.positioner.verticalPositioningMode = this.verticalPositioningMode;
        this.positioner.verticalDefaultPosition = this.verticalDefaultPosition;
        this.positioner.verticalViewportLock = this.verticalViewportLock;
        this.positioner.verticalInset = this.verticalInset;
        this.positioner.verticalThreshold = this.verticalThreshold;
        this.positioner.verticalScaling = this.verticalScaling;
        this.positioner.fixedPlacement = this.fixedPlacement;
        this.positioner.autoUpdateMode = this.autoUpdateMode;
        this.positioner.anchorElement = this.anchorElement;
        this.positioner.viewportElement = this.viewportElement;
        this.positioner.regionElement = this;
        this.positioner.initialize();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        this.positioner.disconnect();
        super.disconnectedCallback();
    }

    /**
     * @internal
     */
    public adoptedCallback() {
        this.positioner.initialize();
    }

    /**
     * Gets the viewport element by id, or defaults to document root
     */
    private getViewport = (): HTMLElement | null => {
        if (typeof this.viewport !== "string" || this.viewport === "") {
            return document.documentElement;
        }

        const rootNode = this.getRootNode();

        if (rootNode instanceof ShadowRoot) {
            return rootNode.getElementById(this.viewport);
        }

        return document.getElementById(this.viewport);
    };

    /**
     *  Gets the anchor element by id
     */
    private getAnchor = (): HTMLElement | null => {
        if (this.usePointAnchor) {
            return null;
        }
        const rootNode = this.getRootNode();

        if (rootNode instanceof ShadowRoot) {
            return rootNode.getElementById(this.anchor);
        }

        return document.getElementById(this.anchor);
    };
}
