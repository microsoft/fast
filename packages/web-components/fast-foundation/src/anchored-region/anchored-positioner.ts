import { observable, Updates } from "@microsoft/fast-element";
import {
    Direction,
    eventMouseMove,
    eventResize,
    eventScroll,
} from "@microsoft/fast-web-utilities";
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
 * Anchored positioner class
 *
 * @fires loaded - Fires a custom 'loaded' event when the region is loaded and visible
 * @fires positionchange - Fires a custom 'positionchange' event when the position has changed
 *
 * @public
 */
export class AnchoredPositioner {
    /**
     * When true current point anchor is updated with mouse moves
     *
     * @public
     * @remarks
     */
    @observable
    public mouseTracking: boolean = false;
    protected mouseTrackingChanged(): void {
        if (this.mouseTracking) {
            window.addEventListener(eventMouseMove, this.handleMouseMove);
        } else {
            window.removeEventListener(eventMouseMove, this.handleMouseMove);
        }
        this.updateForPropChange();
    }

    /**
     * When true the point anchor coordinate is used as anchor
     *
     * @public
     * @remarks
     * HTML Attribute: use-point-anchor
     */
    @observable
    public usePointAnchor: boolean = false;
    protected usePointAnchorChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Initial X coordinate when using point anchor
     *
     * @public
     * @remarks
     */
    @observable
    public pointAnchorX: number = 0;
    protected pointAnchorXChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Initial y coordinate when using point anchor
     *
     * @public
     * @remarks
     */
    @observable
    public pointAnchorY: number = 0;
    protected pointAnchorYChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Sets what logic the component uses to determine horizontal placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the horizontal axis
     *
     * @public
     * @remarks
     */
    @observable
    public horizontalPositioningMode: AxisPositioningMode = "uncontrolled";
    protected horizontalPositioningModeChanged(): void {
        if (!this.initialLayoutComplete) {
            return;
        }
        this.requestReset();
    }

    /**
     * The default horizontal position of the region relative to the anchor element
     *
     * @public
     * @remarks
     */
    @observable
    public horizontalDefaultPosition: HorizontalPosition = "unset";
    protected horizontalDefaultPositionChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the horizontal axis
     *
     * @public
     * @remarks
     */
    @observable
    public horizontalViewportLock: boolean = false;
    protected horizontalViewportLockChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Whether the region overlaps the anchor on the horizontal axis
     *
     * @public
     * @remarks
     */
    @observable
    public horizontalInset: boolean = false;
    protected horizontalInsetChanged(): void {
        this.updateForPropChange();
    }

    /**
     * How narrow the space allocated to the default position has to be before the widest area
     * is selected for layout
     *
     * @public
     * @remarks
     */
    @observable
    public horizontalThreshold: number;
    protected horizontalThresholdChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Defines how the width of the region is calculated
     *
     * @public
     * @remarks
     */
    @observable
    public horizontalScaling: AxisScalingMode = "content";
    protected horizontalScalingChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Sets what logic the component uses to determine vertical placement.
     * 'locktodefault' forces the default position
     * 'dynamic' decides placement based on available space
     * 'uncontrolled' does not control placement on the vertical axis
     *
     * @public
     * @remarks
     */
    @observable
    public verticalPositioningMode: AxisPositioningMode = "uncontrolled";
    protected verticalPositioningModeChanged(): void {
        if (!this.initialLayoutComplete) {
            return;
        }
        this.requestReset();
    }

    /**
     * The default vertical position of the region relative to the anchor element
     *
     * @public
     * @remarks
     */
    @observable
    public verticalDefaultPosition: VerticalPosition = "unset";
    protected verticalDefaultPositionChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Whether the region remains in the viewport (ie. detaches from the anchor) on the vertical axis
     *
     * @public
     * @remarks
     */
    @observable
    public verticalViewportLock: boolean = false;
    protected verticalViewportLockChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Whether the region overlaps the anchor on the vertical axis
     *
     * @public
     * @remarks
     */
    @observable
    public verticalInset: boolean = false;
    protected verticalInsetChanged(): void {
        this.updateForPropChange();
    }

    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     *
     * @public
     * @remarks
     */
    @observable
    public verticalThreshold: number;
    protected verticalThresholdChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Defines how the height of the region is calculated
     *
     * @public
     * @remarks
     */
    @observable
    public verticalScaling: AxisScalingMode = "content";
    protected verticalScalingChanged(): void {
        this.updateForPropChange();
    }

    /**
     * Whether the region is positioned using css "position: fixed".
     * Otherwise the region uses "position: absolute".
     * Fixed placement allows the region to break out of parent containers,
     *
     * @public
     * @remarks
     */
    @observable
    public fixedPlacement: boolean = false;
    protected fixedPlacementChanged(): void {
        if (!this.initialLayoutComplete) {
            return;
        }
        this.initialize();
    }

    /**
     * Defines what triggers the anchored region to revaluate positioning
     *
     * @public
     * @remarks
     */
    @observable
    public autoUpdateMode: AutoUpdateMode = "anchor";
    protected autoUpdateModeChanged(
        prevMode: AutoUpdateMode,
        newMode: AutoUpdateMode
    ): void {
        if (!this.initialLayoutComplete) {
            return;
        }
        if (prevMode === "auto") {
            this.stopAutoUpdateEventListeners();
        }

        if (newMode === "auto") {
            this.startAutoUpdateEventListeners();
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
        if (!this.initialLayoutComplete) {
            return;
        }
        this.requestReset();
    }

    /**
     * The HTML element being used as the viewport
     *
     * @public
     */
    @observable
    public viewportElement: HTMLElement | null = null;
    protected viewportElementChanged(): void {
        if (!this.initialLayoutComplete) {
            return;
        }
        this.initialize();
    }

    /**
     * The HTML element being positioned
     *
     * @public
     */
    @observable
    public regionElement: HTMLElement | null = null;
    protected regionElementChanged(): void {
        if (!this.initialLayoutComplete) {
            return;
        }
        this.initialize();
    }

    /**
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    @observable
    public initialLayoutComplete: boolean = false;

    /**
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    @observable
    public regionVisible: boolean = false;

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
    private translateX: number;
    private translateY: number;

    /**
     * the span to be applied to the region on each axis
     */
    private regionWidth: string;
    private regionHeight: string;

    private resizeDetector: ResizeObserverClassDefinition | null = null;

    private viewportRect: DOMRect | undefined;
    private anchorRect: DOMRect | undefined;
    private regionRect: DOMRect | undefined;
    private pointAnchorRect: DOMRect = new DOMRect();

    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset: number = 0;
    private baseVerticalOffset: number = 0;

    private pendingPositioningUpdate: boolean = false;
    private pendingReset: boolean = false;
    private currentDirection: Direction = Direction.ltr;

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
    connect() {
        this.pointAnchorRect = new DOMRect(this.pointAnchorX, this.pointAnchorY, 1, 1);
        if (this.autoUpdateMode === "auto") {
            this.startAutoUpdateEventListeners();
        }
        this.initialize();
    }

    /**
     * @internal
     */
    public disconnect(): void {
        if (this.autoUpdateMode === "auto") {
            this.stopAutoUpdateEventListeners();
        }
        this.stopObservers();
        this.disconnectResizeDetector();
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
    private updateForPropChange(): void {
        if (this.initialLayoutComplete) {
            this.forceUpdate = true;
            this.update();
        }
    }

    /**
     * fully initializes the component
     */
    public initialize(): void {
        this.initializeResizeDetector();
        this.requestReset();
    }

    /**
     * Request a reset if there are currently no open requests
     */
    private requestReset(): void {
        if (this.pendingReset === false) {
            this.setInitialState();
            Updates.enqueue(() => this.reset());
            this.pendingReset = true;
        }
    }

    /**
     * sets the starting configuration for component internal values
     */
    private setInitialState(): void {
        if (!this.regionElement) {
            return;
        }
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

        this.regionElement.style.opacity = "0";
        this.regionElement.style.pointerEvents = "none";

        this.forceUpdate = false;

        this.regionElement.style.position = this.fixedPlacement ? "fixed" : "absolute";
        this.updatePositionClasses();

        this.updateRegionStyle();
    }

    /**
     * starts observers
     */
    private startObservers = (): void => {
        this.stopObservers();

        if (this.anchorElement === null && !this.usePointAnchor) {
            return;
        }

        this.requestPositionUpdates();

        if (
            this.resizeDetector !== null &&
            this.anchorElement !== null &&
            this.regionElement !== null
        ) {
            this.resizeDetector.observe(this.anchorElement);
            this.resizeDetector.observe(this.regionElement);
        }
    };

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (
            (this.anchorElement === null && !this.usePointAnchor) ||
            this.regionElement === null ||
            this.pendingPositioningUpdate
        ) {
            return;
        }
        AnchoredPositioner.intersectionService.requestPosition(
            this.regionElement,
            this.handleIntersection
        );
        if (this.anchorElement !== null) {
            AnchoredPositioner.intersectionService.requestPosition(
                this.anchorElement,
                this.handleIntersection
            );
        }
        if (this.viewportElement !== null) {
            AnchoredPositioner.intersectionService.requestPosition(
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
        if (this.pendingPositioningUpdate && this.regionElement !== null) {
            this.pendingPositioningUpdate = false;
            AnchoredPositioner.intersectionService.cancelRequestPosition(
                this.regionElement,
                this.handleIntersection
            );
            if (this.anchorElement !== null) {
                AnchoredPositioner.intersectionService.cancelRequestPosition(
                    this.anchorElement,
                    this.handleIntersection
                );
            }
            if (this.viewportElement !== null) {
                AnchoredPositioner.intersectionService.cancelRequestPosition(
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
            x => x.target === this.regionElement
        );
        let anchorEntry: IntersectionObserverEntry | undefined = undefined;
        if (!this.usePointAnchor) {
            anchorEntry = entries.find(x => x.target === this.anchorElement);
        } else {
            this.pointAnchorRect = new DOMRect(
                this.pointAnchorX,
                this.pointAnchorY,
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
            (anchorEntry === undefined && !this.usePointAnchor)
        ) {
            return false;
        }

        let anchorRect: DOMRect = new DOMRect();
        if (!this.usePointAnchor && anchorEntry !== undefined) {
            anchorRect = anchorEntry.boundingClientRect;
        } else {
            anchorRect = this.pointAnchorRect;
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
        if (!this.pendingReset || this.regionElement === null) {
            return;
        }

        this.pendingReset = false;
        this.currentDirection = getDirection(this.regionElement);
        this.startObservers();
    };

    /**
     *  Recalculate layout related state values
     */
    private updateLayout = (): void => {
        if (!this.regionElement) {
            return;
        }
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
                    const newDirection: Direction = getDirection(this.regionElement);
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

        const positionChanged: boolean =
            this.horizontalPosition !== desiredHorizontalPosition ||
            this.verticalPosition !== desiredVerticalPosition;

        this.setHorizontalPosition(desiredHorizontalPosition, nextPositionerDimension);
        this.setVerticalPosition(desiredVerticalPosition, nextPositionerDimension);

        this.updateRegionStyle();

        if (!this.initialLayoutComplete) {
            this.initialLayoutComplete = true;
            this.requestPositionUpdates();
            return;
        }

        if (!this.regionVisible) {
            this.regionVisible = true;
            this.regionElement.style.removeProperty("pointer-events");
            this.regionElement.style.removeProperty("opacity");
            this.regionElement.classList.toggle("loaded", true);
            //this.regionElement.$emit("loaded", this, { bubbles: false });
        }

        this.updatePositionClasses();

        if (positionChanged) {
            // emit change event
            //this.$emit("positionchange", this, { bubbles: false });
        }
    };

    /**
     *  Updates the style string applied to the region element as well as the css classes attached
     *  to the root element
     */
    private updateRegionStyle = (): void => {
        if (!this.regionElement) {
            return;
        }
        this.regionElement.style.width = this.regionWidth;
        this.regionElement.style.height = this.regionHeight;
        this.regionElement.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
    };

    /**
     *  Updates the css classes that reflect the current position of the element
     */
    private updatePositionClasses = (): void => {
        if (!this.regionElement) {
            return;
        }
        this.regionElement.classList.toggle("top", this.verticalPosition === "start");
        this.regionElement.classList.toggle("bottom", this.verticalPosition === "end");
        this.regionElement.classList.toggle(
            "inset-top",
            this.verticalPosition === "insetStart"
        );
        this.regionElement.classList.toggle(
            "inset-bottom",
            this.verticalPosition === "insetEnd"
        );
        this.regionElement.classList.toggle(
            "vertical-center",
            this.verticalPosition === "center"
        );

        this.regionElement.classList.toggle("left", this.horizontalPosition === "start");
        this.regionElement.classList.toggle("right", this.horizontalPosition === "end");
        this.regionElement.classList.toggle(
            "inset-left",
            this.horizontalPosition === "insetStart"
        );
        this.regionElement.classList.toggle(
            "inset-right",
            this.horizontalPosition === "insetEnd"
        );
        this.regionElement.classList.toggle(
            "horizontal-center",
            this.horizontalPosition === "center"
        );
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
                this.regionWidth = "unset";
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
                this.regionHeight = "unset";
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

    /**
     * handles mouse move events when in mouse tracking mode
     */
    private handleMouseMove = (e: MouseEvent): void => {
        this.pointAnchorX = e.pageX;
        this.pointAnchorY = e.pageY;
        this.update();
    };
}
