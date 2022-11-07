import { attr, FASTElement, observable, Updates } from "@microsoft/fast-element";
import { Direction, eventResize, eventScroll } from "@microsoft/fast-web-utilities";
import { getDirection } from "../utilities/direction.js";
import { IntersectionService } from "../utilities/intersection-service.js";
import type {
    ResizeObserverClassDefinition,
    ResizeObserverEntry,
} from "../utilities/resize-observer.js";
import type {
    AnchoredRegionPositionLabel,
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
    Dimension,
    HorizontalPosition,
    VerticalPosition,
} from "./anchored-region.options.js";

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
        if (this.initialLayoutComplete) {
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
        if (this.initialLayoutComplete) {
            this.viewportElement = this.getViewport();
        }
    }

    /**
     * When true the virtual anchor is used
     *
     * @public
     * @remarks
     * HTML Attribute: use-virtual-anchor
     */
    @attr({ attribute: "use-virtual-anchor", mode: "boolean" })
    public useVirtualAnchor: boolean = false;
    protected useVirtualAnchorChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * Initial X coordinate when using virtual anchor
     *
     * @public
     * @remarks
     * HTML Attribute: virtual-anchor-x
     */
    @attr({ attribute: "virtual-anchor-x" })
    public virtualAnchorX: number = 0;
    protected virtualAnchorXChanged(): void {
        if (this.useVirtualAnchor) {
            this.updateForAttributeChange();
        }
    }

    /**
     * Initial y coordinate when using virtual anchor
     *
     * @public
     * @remarks
     * HTML Attribute: virtual-anchor-y
     */
    @attr({ attribute: "virtual-anchor-y" })
    public virtualAnchorY: number = 0;
    protected virtualAnchorYChanged(): void {
        if (this.useVirtualAnchor) {
            this.updateForAttributeChange();
        }
    }

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: virtual-anchor-width
     */
    @attr({ attribute: "virtual-anchor-width" })
    public virtualAnchorWidth: number = 0;
    protected virtualAnchorWidthChanged(): void {
        if (this.useVirtualAnchor) {
            this.updateForAttributeChange();
        }
    }

    /**
     *
     *
     * @public
     * @remarks
     * HTML Attribute: virtual-anchor-height
     */
    @attr({ attribute: "virtual-anchor-height" })
    public virtualAnchorHeight: number = 0;
    protected virtualAnchorHeightChanged(): void {
        if (this.useVirtualAnchor) {
            this.updateForAttributeChange();
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
        this.requestReset();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.requestReset();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        this.updateForAttributeChange();
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
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.initialize();
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
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            if (prevMode === "auto") {
                this.stopAutoUpdateEventListeners();
            }

            if (newMode === "auto") {
                this.startAutoUpdateEventListeners();
            }
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
        if (this.initialLayoutComplete) {
            this.stopObservers();
            this.startObservers();
            this.anchorRect = undefined;
            this.updateForAttributeChange();
        } else {
            this.requestReset();
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
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.initialize();
        }
    }

    /**
     * The virtual rect being used as anchor
     *
     * @internal
     */
    @observable
    public virtualAnchorRect: DOMRect = new DOMRect();

    /**
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    @observable
    public initialLayoutComplete: boolean = false;

    /**
     *
     *
     * @internal
     */
    @observable
    public viewportRect: DOMRect | undefined;

    /**
     *
     *
     * @internal
     */
    @observable
    public anchorRect: DOMRect | undefined;

    /**
     *
     *
     * @internal
     */
    @observable
    public regionRect: DOMRect | undefined;

    /**
     * indicates the current horizontal position of the region
     */
    public verticalPosition: AnchoredRegionPositionLabel | undefined;

    /**
     * indicates the current vertical position of the region
     */
    public horizontalPosition: AnchoredRegionPositionLabel | undefined;

    /**
     * values to be applied to the component's transform on render
     */
    protected translateX: number;
    protected translateY: number;

    /**
     * the span to be applied to the region on each axis
     */
    private regionWidth: string;
    private regionHeight: string;

    private resizeDetector: ResizeObserverClassDefinition | null = null;

    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset: number = 0;
    private baseVerticalOffset: number = 0;

    private pendingPositioningUpdate: boolean = false;
    private pendingReset: boolean = false;
    private currentDirection: Direction = Direction.ltr;
    private regionVisible: boolean = false;

    // indicates that a layout update should occur even if geometry has not changed
    // used to ensure some attribute changes are applied
    private forceUpdate: boolean = false;

    // defines how big a difference in pixels there must be between states to
    // justify a layout update that affects the dom (prevents repeated sub-pixel corrections)
    private updateThreshold: number = 0.5;

    private static intersectionService: IntersectionService = new IntersectionService();

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        if (!this.virtualAnchorRect) {
            this.virtualAnchorRect = new DOMRect(
                this.virtualAnchorX,
                this.virtualAnchorY,
                this.virtualAnchorHeight,
                this.virtualAnchorWidth
            );
        }
        if (this.autoUpdateMode === "auto") {
            this.startAutoUpdateEventListeners();
        }
        this.initialize();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.autoUpdateMode === "auto") {
            this.stopAutoUpdateEventListeners();
        }
        this.stopObservers();
        this.disconnectResizeDetector();
    }

    /**
     * @internal
     */
    public adoptedCallback() {
        this.initialize();
    }

    /**
     * update position
     */
    public update = (): void => {
        if (!this.pendingPositioningUpdate) {
            this.requestPositionUpdates();
        }
    };

    /**
     * destroys the instance's resize observer
     */
    private disconnectResizeDetector(): void {
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }

    /**
     * initializes the instance's resize observer
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector();
        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleResize
        );
    }

    /**
     * react to attribute changes that don't require a reset
     */
    private updateForAttributeChange(): void {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.forceUpdate = true;
            this.update();
        }
    }

    /**
     * fully initializes the component
     */
    private initialize(): void {
        this.initializeResizeDetector();
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }
        this.requestReset();
    }

    /**
     * Request a reset if there are currently no open requests
     */
    private requestReset(): void {
        if (this.$fastController.isConnected && this.pendingReset === false) {
            this.setInitialState();
            Updates.enqueue(() => this.reset());
            this.pendingReset = true;
        }
    }

    /**
     * sets the starting configuration for component internal values
     */
    private setInitialState(): void {
        this.initialLayoutComplete = false;
        this.regionVisible = false;
        this.translateX = 0;
        this.translateY = 0;

        this.baseHorizontalOffset = 0;
        this.baseVerticalOffset = 0;

        this.viewportRect = undefined;
        this.regionRect = undefined;
        this.anchorRect = undefined;

        this.verticalPosition = undefined;
        this.horizontalPosition = undefined;

        this.style.opacity = "0";
        this.style.pointerEvents = "none";

        this.forceUpdate = false;
        // don't set position if we're not doing active positioning on either axis
        if (
            this.horizontalPositioningMode !== "uncontrolled" &&
            this.verticalPositioningMode !== "uncontrolled"
        ) {
            this.style.position = this.fixedPlacement ? "fixed" : "absolute";
        }
        this.updatePositionClasses();

        this.updateRegionStyle();
    }

    /**
     * starts observers
     */
    private startObservers = (): void => {
        this.stopObservers();

        if (this.anchorElement === null && !this.useVirtualAnchor) {
            return;
        }

        this.requestPositionUpdates();

        if (this.resizeDetector !== null && this.anchorElement !== null) {
            this.resizeDetector.observe(this.anchorElement);
            this.resizeDetector.observe(this);
        }
    };

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (
            (this.anchorElement === null && !this.useVirtualAnchor) ||
            this.pendingPositioningUpdate
        ) {
            return;
        }
        FASTAnchoredRegion.intersectionService.requestPosition(
            this,
            this.handleIntersection
        );
        if (this.anchorElement !== null) {
            FASTAnchoredRegion.intersectionService.requestPosition(
                this.anchorElement,
                this.handleIntersection
            );
        }
        if (this.viewportElement !== null) {
            FASTAnchoredRegion.intersectionService.requestPosition(
                this.viewportElement,
                this.handleIntersection
            );
        }
        this.pendingPositioningUpdate = true;
    };

    /**
     * stops observers
     */
    private stopObservers = (): void => {
        if (this.pendingPositioningUpdate) {
            this.pendingPositioningUpdate = false;
            FASTAnchoredRegion.intersectionService.cancelRequestPosition(
                this,
                this.handleIntersection
            );
            if (this.anchorElement !== null) {
                FASTAnchoredRegion.intersectionService.cancelRequestPosition(
                    this.anchorElement,
                    this.handleIntersection
                );
            }
            if (this.viewportElement !== null) {
                FASTAnchoredRegion.intersectionService.cancelRequestPosition(
                    this.viewportElement,
                    this.handleIntersection
                );
            }
        }
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
        }
    };

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
        if (this.useVirtualAnchor) {
            return null;
        }
        const rootNode = this.getRootNode();

        if (rootNode instanceof ShadowRoot) {
            return rootNode.getElementById(this.anchor);
        }

        return document.getElementById(this.anchor);
    };

    /**
     *  Handle intersections
     */
    private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        if (!this.pendingPositioningUpdate) {
            return;
        }

        this.pendingPositioningUpdate = false;

        if (!this.applyIntersectionEntries(entries)) {
            return;
        }

        this.updateLayout();
    };

    /**
     *  iterate through intersection entries and apply data
     */
    private applyIntersectionEntries = (
        entries: IntersectionObserverEntry[]
    ): boolean => {
        const regionEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this
        );
        let anchorEntry: IntersectionObserverEntry | undefined = undefined;
        if (!this.useVirtualAnchor) {
            anchorEntry = entries.find(x => x.target === this.anchorElement);
        } else {
            this.virtualAnchorRect = new DOMRect(
                this.virtualAnchorX,
                this.virtualAnchorY,
                0,
                0
            );
        }
        const viewportEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.viewportElement
        );

        if (
            regionEntry === undefined ||
            viewportEntry === undefined ||
            (anchorEntry === undefined && !this.useVirtualAnchor)
        ) {
            return false;
        }

        let anchorRect: DOMRect = new DOMRect();
        if (!this.useVirtualAnchor && anchorEntry !== undefined) {
            anchorRect = anchorEntry.boundingClientRect;
        } else {
            anchorRect = this.virtualAnchorRect;
        }

        // don't update the dom unless there is a significant difference in rect positions
        if (
            !this.regionVisible ||
            this.forceUpdate ||
            this.regionRect === undefined ||
            this.anchorRect === undefined ||
            this.viewportRect === undefined ||
            this.isRectDifferent(this.anchorRect, anchorRect) ||
            this.isRectDifferent(this.viewportRect, viewportEntry.boundingClientRect) ||
            this.isRectDifferent(this.regionRect, regionEntry.boundingClientRect)
        ) {
            this.regionRect = regionEntry.boundingClientRect;
            this.anchorRect = anchorRect;
            if (this.viewportElement === document.documentElement) {
                this.viewportRect = new DOMRectReadOnly(
                    viewportEntry.boundingClientRect.x +
                        document.documentElement.scrollLeft,
                    viewportEntry.boundingClientRect.y +
                        document.documentElement.scrollTop,
                    viewportEntry.boundingClientRect.width,
                    viewportEntry.boundingClientRect.height
                );
            } else {
                this.viewportRect = viewportEntry.boundingClientRect;
            }

            this.updateRegionOffset();

            this.forceUpdate = false;

            return true;
        }

        return false;
    };

    /**
     *  Update the offset values
     */
    private updateRegionOffset = (): void => {
        if (this.anchorRect && this.regionRect) {
            this.baseHorizontalOffset =
                this.baseHorizontalOffset +
                (this.anchorRect.left - this.regionRect.left) +
                (this.translateX - this.baseHorizontalOffset);

            this.baseVerticalOffset =
                this.baseVerticalOffset +
                (this.anchorRect.top - this.regionRect.top) +
                (this.translateY - this.baseVerticalOffset);
        }
    };

    /**
     *  compare rects to see if there is enough change to justify a DOM update
     */
    private isRectDifferent = (rectA: DOMRect, rectB: DOMRect): boolean => {
        if (
            Math.abs(rectA.top - rectB.top) > this.updateThreshold ||
            Math.abs(rectA.right - rectB.right) > this.updateThreshold ||
            Math.abs(rectA.bottom - rectB.bottom) > this.updateThreshold ||
            Math.abs(rectA.left - rectB.left) > this.updateThreshold
        ) {
            return true;
        }
        return false;
    };

    /**
     *  Handle resize events
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        this.update();
    };

    /**
     * resets the component
     */
    private reset = (): void => {
        if (!this.pendingReset) {
            return;
        }

        this.pendingReset = false;
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }

        if (this.viewportElement === null) {
            this.viewportElement = this.getViewport();
        }

        this.currentDirection = getDirection(this);
        this.startObservers();
    };

    /**
     *  Recalculate layout related state values
     */
    private updateLayout = (): void => {
        let desiredVerticalPosition: AnchoredRegionPositionLabel | undefined = undefined;
        let desiredHorizontalPosition:
            | AnchoredRegionPositionLabel
            | undefined = undefined;

        if (this.horizontalPositioningMode !== "uncontrolled") {
            const horizontalOptions: AnchoredRegionPositionLabel[] = this.getPositioningOptions(
                this.horizontalInset
            );

            if (this.horizontalDefaultPosition === "center") {
                desiredHorizontalPosition = "center";
            } else if (this.horizontalDefaultPosition !== "unset") {
                let dirCorrectedHorizontalDefaultPosition: string = this
                    .horizontalDefaultPosition;

                if (
                    dirCorrectedHorizontalDefaultPosition === "start" ||
                    dirCorrectedHorizontalDefaultPosition === "end"
                ) {
                    // if direction changes we reset the layout
                    const newDirection: Direction = getDirection(this);
                    if (newDirection !== this.currentDirection) {
                        this.currentDirection = newDirection;
                        this.initialize();
                        return;
                    }

                    if (this.currentDirection === Direction.ltr) {
                        dirCorrectedHorizontalDefaultPosition =
                            dirCorrectedHorizontalDefaultPosition === "start"
                                ? "left"
                                : "right";
                    } else {
                        dirCorrectedHorizontalDefaultPosition =
                            dirCorrectedHorizontalDefaultPosition === "start"
                                ? "right"
                                : "left";
                    }
                }

                switch (dirCorrectedHorizontalDefaultPosition) {
                    case "left":
                        desiredHorizontalPosition = this.horizontalInset
                            ? "insetStart"
                            : "start";
                        break;

                    case "right":
                        desiredHorizontalPosition = this.horizontalInset
                            ? "insetEnd"
                            : "end";
                        break;
                }
            }

            const horizontalThreshold: number =
                this.horizontalThreshold !== undefined
                    ? this.horizontalThreshold
                    : this.regionRect !== undefined
                    ? this.regionRect.width
                    : 0;

            const anchorLeft: number =
                this.anchorRect !== undefined ? this.anchorRect.left : 0;
            const anchorRight: number =
                this.anchorRect !== undefined ? this.anchorRect.right : 0;
            const anchorWidth: number =
                this.anchorRect !== undefined ? this.anchorRect.width : 0;
            const viewportLeft: number =
                this.viewportRect !== undefined ? this.viewportRect.left : 0;
            const viewportRight: number =
                this.viewportRect !== undefined ? this.viewportRect.right : 0;

            if (
                desiredHorizontalPosition === undefined ||
                (!(this.horizontalPositioningMode === "locktodefault") &&
                    this.getAvailableSpace(
                        desiredHorizontalPosition,
                        anchorLeft,
                        anchorRight,
                        anchorWidth,
                        viewportLeft,
                        viewportRight
                    ) < horizontalThreshold)
            ) {
                desiredHorizontalPosition =
                    this.getAvailableSpace(
                        horizontalOptions[0],
                        anchorLeft,
                        anchorRight,
                        anchorWidth,
                        viewportLeft,
                        viewportRight
                    ) >
                    this.getAvailableSpace(
                        horizontalOptions[1],
                        anchorLeft,
                        anchorRight,
                        anchorWidth,
                        viewportLeft,
                        viewportRight
                    )
                        ? horizontalOptions[0]
                        : horizontalOptions[1];
            }
        }

        if (this.verticalPositioningMode !== "uncontrolled") {
            const verticalOptions: AnchoredRegionPositionLabel[] = this.getPositioningOptions(
                this.verticalInset
            );
            if (this.verticalDefaultPosition === "center") {
                desiredVerticalPosition = "center";
            } else if (this.verticalDefaultPosition !== "unset") {
                switch (this.verticalDefaultPosition) {
                    case "top":
                        desiredVerticalPosition = this.verticalInset
                            ? "insetStart"
                            : "start";
                        break;

                    case "bottom":
                        desiredVerticalPosition = this.verticalInset ? "insetEnd" : "end";
                        break;
                }
            }

            const verticalThreshold: number =
                this.verticalThreshold !== undefined
                    ? this.verticalThreshold
                    : this.regionRect !== undefined
                    ? this.regionRect.height
                    : 0;

            const anchorTop: number =
                this.anchorRect !== undefined ? this.anchorRect.top : 0;
            const anchorBottom: number =
                this.anchorRect !== undefined ? this.anchorRect.bottom : 0;
            const anchorHeight: number =
                this.anchorRect !== undefined ? this.anchorRect.height : 0;
            const viewportTop: number =
                this.viewportRect !== undefined ? this.viewportRect.top : 0;
            const viewportBottom: number =
                this.viewportRect !== undefined ? this.viewportRect.bottom : 0;

            if (
                desiredVerticalPosition === undefined ||
                (!(this.verticalPositioningMode === "locktodefault") &&
                    this.getAvailableSpace(
                        desiredVerticalPosition,
                        anchorTop,
                        anchorBottom,
                        anchorHeight,
                        viewportTop,
                        viewportBottom
                    ) < verticalThreshold)
            ) {
                desiredVerticalPosition =
                    this.getAvailableSpace(
                        verticalOptions[0],
                        anchorTop,
                        anchorBottom,
                        anchorHeight,
                        viewportTop,
                        viewportBottom
                    ) >
                    this.getAvailableSpace(
                        verticalOptions[1],
                        anchorTop,
                        anchorBottom,
                        anchorHeight,
                        viewportTop,
                        viewportBottom
                    )
                        ? verticalOptions[0]
                        : verticalOptions[1];
            }
        }

        const nextPositionerDimension: Dimension = this.getNextRegionDimension(
            desiredHorizontalPosition,
            desiredVerticalPosition
        );

        const previousTranslateX: number = this.translateX;
        const previousTranslateY: number = this.translateY;

        this.setHorizontalPosition(desiredHorizontalPosition, nextPositionerDimension);
        this.setVerticalPosition(desiredVerticalPosition, nextPositionerDimension);

        const positionChanged: boolean =
            this.horizontalPosition !== desiredHorizontalPosition ||
            this.verticalPosition !== desiredVerticalPosition ||
            previousTranslateX !== this.translateX ||
            previousTranslateY !== this.translateY;

        this.updateRegionStyle();

        if (!this.initialLayoutComplete) {
            this.initialLayoutComplete = true;
            this.requestPositionUpdates();
            return;
        }

        if (!this.regionVisible) {
            this.regionVisible = true;
            this.style.removeProperty("pointer-events");
            this.style.removeProperty("opacity");
            this.classList.toggle("loaded", true);
            this.$emit("loaded", this, { bubbles: false });
        }

        this.updatePositionClasses();

        if (positionChanged) {
            // emit change event
            this.$emit("positionchange", this, { bubbles: false });
        }
    };

    /**
     *  Updates the style string applied to the region element as well as the css classes attached
     *  to the root element
     */
    private updateRegionStyle = (): void => {
        this.style.width = this.regionWidth;
        this.style.height = this.regionHeight;
        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
    };

    /**
     *  Updates the css classes that reflect the current position of the element
     */
    private updatePositionClasses = (): void => {
        this.classList.toggle("top", this.verticalPosition === "start");
        this.classList.toggle("bottom", this.verticalPosition === "end");
        this.classList.toggle("inset-top", this.verticalPosition === "insetStart");
        this.classList.toggle("inset-bottom", this.verticalPosition === "insetEnd");
        this.classList.toggle("vertical-center", this.verticalPosition === "center");

        this.classList.toggle("left", this.horizontalPosition === "start");
        this.classList.toggle("right", this.horizontalPosition === "end");
        this.classList.toggle("inset-left", this.horizontalPosition === "insetStart");
        this.classList.toggle("inset-right", this.horizontalPosition === "insetEnd");
        this.classList.toggle("horizontal-center", this.horizontalPosition === "center");
    };

    /**
     * Get horizontal positioning state based on desired position
     */
    private setHorizontalPosition = (
        desiredHorizontalPosition: AnchoredRegionPositionLabel | undefined,
        nextPositionerDimension: Dimension
    ): void => {
        if (
            desiredHorizontalPosition === undefined ||
            this.regionRect === undefined ||
            this.anchorRect === undefined ||
            this.viewportRect === undefined
        ) {
            return;
        }

        let nextRegionWidth: number = 0;

        switch (this.horizontalScaling) {
            case "anchor":
            case "fill":
                nextRegionWidth = this.horizontalViewportLock
                    ? this.viewportRect.width
                    : nextPositionerDimension.width;
                this.regionWidth = `${nextRegionWidth}px`;
                break;

            case "content":
                nextRegionWidth = this.regionRect.width;
                this.regionWidth = "auto";
                break;
        }

        let sizeDelta: number = 0;
        let regionLeft: number = 0;
        let regionRight: number = 0;
        let newTranslateX: number = 0;

        switch (desiredHorizontalPosition) {
            case "start":
                newTranslateX = this.baseHorizontalOffset - nextRegionWidth;
                regionRight = this.anchorRect.left;
                regionLeft = regionRight - nextRegionWidth;
                break;

            case "insetStart":
                newTranslateX =
                    this.baseHorizontalOffset - nextRegionWidth + this.anchorRect.width;
                regionRight = this.anchorRect.right;
                regionLeft = regionRight - nextRegionWidth;
                break;

            case "insetEnd":
                newTranslateX = this.baseHorizontalOffset;
                regionLeft = this.anchorRect.left;
                regionRight = regionLeft + nextRegionWidth;
                break;

            case "end":
                newTranslateX = this.baseHorizontalOffset + this.anchorRect.width;
                regionLeft = this.anchorRect.right;
                regionRight = regionLeft + nextRegionWidth;
                break;

            case "center":
                sizeDelta = (this.anchorRect.width - nextRegionWidth) / 2;
                newTranslateX = this.baseHorizontalOffset + sizeDelta;
                regionLeft = this.anchorRect.left + sizeDelta;
                regionRight = regionLeft + nextRegionWidth;
                break;
        }

        if (this.horizontalViewportLock) {
            if (regionLeft < this.viewportRect.left) {
                newTranslateX = newTranslateX - (regionLeft - this.viewportRect.left);
            } else if (regionRight > this.viewportRect.right) {
                newTranslateX = newTranslateX - (regionRight - this.viewportRect.right);
            }
        }
        this.translateX = newTranslateX;
        this.horizontalPosition = desiredHorizontalPosition;
    };

    /**
     * Set vertical positioning state based on desired position
     */
    private setVerticalPosition = (
        desiredVerticalPosition: AnchoredRegionPositionLabel | undefined,
        nextPositionerDimension: Dimension
    ): void => {
        if (
            desiredVerticalPosition === undefined ||
            this.regionRect === undefined ||
            this.anchorRect === undefined ||
            this.viewportRect === undefined
        ) {
            return;
        }

        let nextRegionHeight: number = 0;

        switch (this.verticalScaling) {
            case "anchor":
            case "fill":
                nextRegionHeight = this.verticalViewportLock
                    ? this.viewportRect.height
                    : nextPositionerDimension.height;
                this.regionHeight = `${nextRegionHeight}px`;
                break;

            case "content":
                nextRegionHeight = this.regionRect.height;
                this.regionHeight = "auto";
                break;
        }

        let sizeDelta: number = 0;
        let regionTop: number = 0;
        let regionBottom: number = 0;
        let newTranslateY: number = 0;

        switch (desiredVerticalPosition) {
            case "start":
                newTranslateY = this.baseVerticalOffset - nextRegionHeight;
                regionBottom = this.anchorRect.top;
                regionTop = regionBottom - nextRegionHeight;
                break;

            case "insetStart":
                newTranslateY =
                    this.baseVerticalOffset - nextRegionHeight + this.anchorRect.height;
                regionBottom = this.anchorRect.bottom;
                regionTop = regionBottom - nextRegionHeight;
                break;

            case "insetEnd":
                newTranslateY = this.baseVerticalOffset;
                regionTop = this.anchorRect.top;
                regionBottom = regionTop + nextRegionHeight;
                break;

            case "end":
                newTranslateY = this.baseVerticalOffset + this.anchorRect.height;
                regionTop = this.anchorRect.bottom;
                regionBottom = regionTop + nextRegionHeight;
                break;

            case "center":
                sizeDelta = (this.anchorRect.height - nextRegionHeight) / 2;
                newTranslateY = this.baseVerticalOffset + sizeDelta;
                regionTop = this.anchorRect.top + sizeDelta;
                regionBottom = regionTop + nextRegionHeight;
        }

        if (this.verticalViewportLock) {
            if (regionTop < this.viewportRect.top) {
                newTranslateY = newTranslateY - (regionTop - this.viewportRect.top);
            } else if (regionBottom > this.viewportRect.bottom) {
                newTranslateY = newTranslateY - (regionBottom - this.viewportRect.bottom);
            }
        }

        this.translateY = newTranslateY;
        this.verticalPosition = desiredVerticalPosition;
    };

    /**
     *  Get available positions based on positioning mode
     */
    private getPositioningOptions = (inset: boolean): AnchoredRegionPositionLabel[] => {
        if (inset) {
            return ["insetStart", "insetEnd"];
        }
        return ["start", "end"];
    };

    /**
     *  Get the space available for a particular relative position
     */
    private getAvailableSpace = (
        positionOption: AnchoredRegionPositionLabel,
        anchorStart: number,
        anchorEnd: number,
        anchorSpan: number,
        viewportStart: number,
        viewportEnd: number
    ): number => {
        const spaceStart: number = anchorStart - viewportStart;
        const spaceEnd: number = viewportEnd - (anchorStart + anchorSpan);

        switch (positionOption) {
            case "start":
                return spaceStart;
            case "insetStart":
                return spaceStart + anchorSpan;
            case "insetEnd":
                return spaceEnd + anchorSpan;
            case "end":
                return spaceEnd;
            case "center":
                return Math.min(spaceStart, spaceEnd) * 2 + anchorSpan;
        }
    };

    /**
     * Get region dimensions
     */
    private getNextRegionDimension = (
        desiredHorizontalPosition: AnchoredRegionPositionLabel | undefined,
        desiredVerticalPosition: AnchoredRegionPositionLabel | undefined
    ): Dimension => {
        const newRegionDimension: Dimension = {
            height: this.regionRect !== undefined ? this.regionRect.height : 0,
            width: this.regionRect !== undefined ? this.regionRect.width : 0,
        };

        if (
            desiredHorizontalPosition !== undefined &&
            this.horizontalScaling === "fill"
        ) {
            newRegionDimension.width = this.getAvailableSpace(
                desiredHorizontalPosition,
                this.anchorRect !== undefined ? this.anchorRect.left : 0,
                this.anchorRect !== undefined ? this.anchorRect.right : 0,
                this.anchorRect !== undefined ? this.anchorRect.width : 0,
                this.viewportRect !== undefined ? this.viewportRect.left : 0,
                this.viewportRect !== undefined ? this.viewportRect.right : 0
            );
        } else if (this.horizontalScaling === "anchor") {
            newRegionDimension.width =
                this.anchorRect !== undefined ? this.anchorRect.width : 0;
        }

        if (desiredVerticalPosition !== undefined && this.verticalScaling === "fill") {
            newRegionDimension.height = this.getAvailableSpace(
                desiredVerticalPosition,
                this.anchorRect !== undefined ? this.anchorRect.top : 0,
                this.anchorRect !== undefined ? this.anchorRect.bottom : 0,
                this.anchorRect !== undefined ? this.anchorRect.height : 0,
                this.viewportRect !== undefined ? this.viewportRect.top : 0,
                this.viewportRect !== undefined ? this.viewportRect.bottom : 0
            );
        } else if (this.verticalScaling === "anchor") {
            newRegionDimension.height =
                this.anchorRect !== undefined ? this.anchorRect.height : 0;
        }

        return newRegionDimension;
    };

    /**
     * starts event listeners that can trigger auto updating
     */
    private startAutoUpdateEventListeners = (): void => {
        window.addEventListener(eventResize, this.update, { passive: true });
        window.addEventListener(eventScroll, this.update, {
            passive: true,
            capture: true,
        });
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.observe(this.viewportElement);
        }
    };

    /**
     * stops event listeners that can trigger auto updating
     */
    private stopAutoUpdateEventListeners = (): void => {
        window.removeEventListener(eventResize, this.update);
        window.removeEventListener(eventScroll, this.update);
        if (this.resizeDetector !== null && this.viewportElement !== null) {
            this.resizeDetector.unobserve(this.viewportElement);
        }
    };
}
