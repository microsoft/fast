import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";
import { getDirection } from "../utilities";

// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861
import {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "./resize-observer";
import { ResizeObserverEntry } from "./resize-observer-entry";

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
export type AxisPositioningMode = "uncontrolled" | "locktodefault" | "dynamic";

/**
 * Defines the scaling behavior of an anchored region on a particular axis
 *
 * @beta
 */
export type AxisScalingMode = "anchor" | "fill" | "content";

/**
 * Defines the horizontal positioning options for an anchored region
 *
 * @beta
 */
export type HorizontalPosition = "start" | "end" | "left" | "right" | "unset";

/**
 * Defines the vertical positioning options for an anchored region
 *
 * @beta
 */
export type VerticalPosition = "top" | "bottom" | "unset";

/**
 * used internally to track dimensions of the region
 */
interface Dimension {
    height: number;
    width: number;
}

/**
 * describes the possible horizontal positions of the region relative
 * to its anchor
 */
type AnchoredRegionHorizontalPositionLabel =
    | "left"
    | "insetLeft"
    | "insetRight"
    | "right"
    | "undefined";

/**
 * describes the possible vertical positions of the region relative
 * to its anchor
 */
type AnchoredRegionVerticalPositionLabel =
    | "top"
    | "insetTop"
    | "insetBottom"
    | "bottom"
    | "undefined";

/**
 * describes possilbe transform origin settings
 */
type Location = "top" | "left" | "right" | "bottom";

/**
 * An anchored region Custom HTML Element.
 *
 * @beta
 */
export class AnchoredRegion extends FASTElement {
    /**
     * The HTML id of the anchor element this region is positioned relative to
     *
     * @beta
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public anchor: string = "";
    private anchorChanged(): void {
        if (this.initialLayoutComplete) {
            this.anchorElement = this.getAnchor();
        }
    }

    /**
     * The HTML id of the viewport element this region is positioned relative to
     *
     * @beta
     * @remarks
     * HTML Attribute: anchor
     */
    @attr
    public viewport: string = "";
    private viewportChanged(): void {
        if (this.initialLayoutComplete) {
            this.viewportElement = this.getViewport();
        }
    }

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
    @attr({ attribute: "horizontal-positioning-mode" })
    public horizontalPositioningMode: AxisPositioningMode = "uncontrolled";
    private horizontalPositioningModeChanged(): void {
        this.requestReset();
    }

    /**
     * The default horizontal position of the region relative to the anchor element
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-default-position
     */
    @attr({ attribute: "horizontal-default-position" })
    public horizontalDefaultPosition: HorizontalPosition = "unset";
    private horizontalDefaultPositionChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * Whether the region overlaps the anchor on the horizontal axis
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-inset
     */
    @attr({ attribute: "horizontal-inset", mode: "boolean" })
    public horizontalInset: boolean = false;
    private horizontalInsetChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * How narrow the space allocated to the default position has to be before the widest area
     * is selected for layout
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-threshold
     */
    @attr({ attribute: "horizontal-threshold" })
    public horizontalThreshold: number;
    private horizontalThresholdChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * Defines how the width of the region is calculated
     *
     * @beta
     * @remarks
     * HTML Attribute: horizontal-scaling
     */
    @attr({ attribute: "horizontal-scaling" })
    public horizontalScaling: AxisScalingMode = "content";
    private horizontalScalingChanged(): void {
        this.updateForAttributeChange();
    }

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
    @attr({ attribute: "vertical-positioning-mode" })
    public verticalPositioningMode: AxisPositioningMode = "uncontrolled";
    private verticalPositioningModeChanged(): void {
        this.requestReset();
    }

    /**
     * The default vertical position of the region relative to the anchor element
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-default-position
     */
    @attr({ attribute: "vertical-default-position" })
    public verticalDefaultPosition: VerticalPosition = "unset";
    private verticalDefaultPositionChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * Whether the region overlaps the anchor on the vertical axis
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-inset
     */
    @attr({ attribute: "vertical-inset", mode: "boolean" })
    public verticalInset: boolean = false;
    private verticalInsetChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * How short the space allocated to the default position has to be before the tallest area
     * is selected for layout
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-threshold
     */
    @attr({ attribute: "vertical-threshold" })
    public verticalThreshold: number;
    private verticalThresholdChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * Defines how the height of the region is calculated
     *
     * @beta
     * @remarks
     * HTML Attribute: vertical-scaling
     */
    @attr({ attribute: "vertical-scaling" })
    public verticalScaling: AxisScalingMode = "content";
    private verticalScalingChanged(): void {
        this.updateForAttributeChange();
    }

    /**
     * Whether the region is positioned using css "position: fixed".
     * Otherwise the region uses "position: absolute".
     * Fixed placement allows the region to break out of parent containers,
     *
     * @beta
     * @remarks
     * HTML Attribute: fixed-placement
     */
    @attr({ attribute: "fixed-placement", mode: "boolean" })
    public fixedPlacement: boolean = false;
    private fixedPlacementChanged(): void {
        if (
            (this as FASTElement).$fastController.isConnected &&
            this.initialLayoutComplete
        ) {
            this.initialize();
        }
    }

    /**
     * The HTML element being used as the anchor
     *
     * @beta
     */
    @observable
    public anchorElement: HTMLElement | null = null;
    private anchorElementChanged(): void {
        this.requestReset();
    }

    /**
     * The HTML element being used as the viewport
     *
     * @beta
     */
    @observable
    public viewportElement: HTMLElement | null = null;
    private viewportElementChanged(): void {
        if (
            (this as FASTElement).$fastController.isConnected &&
            this.initialLayoutComplete
        ) {
            this.initialize();
        }
    }

    /**
     * indicates that an initial positioning pass on layout has completed
     *
     * @internal
     */
    @observable
    public initialLayoutComplete: boolean = false;

    /**
     * indicates the current horizontal position of the region
     */
    public verticalPosition: AnchoredRegionVerticalPositionLabel;

    /**
     * indicates the current vertical position of the region
     */
    public horizontalPosition: AnchoredRegionHorizontalPositionLabel;

    /**
     * values to be applied to the component's positioning attributes on render
     */
    private regionTop: string;
    private regionRight: string;
    private regionBottom: string;
    private regionLeft: string;

    /**
     * the span in pixels of the selected position on each axis
     */
    private regionWidth: string;
    private regionHeight: string;

    private xTransformOrigin: string;
    private yTransformOrigin: string;

    private intersectionDetector: IntersectionObserver | null = null;
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    private viewportRect: ClientRect | DOMRect | null;
    private regionDimension: Dimension;

    private anchorTop: number;
    private anchorRight: number;
    private anchorBottom: number;
    private anchorLeft: number;
    private anchorHeight: number;
    private anchorWidth: number;

    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset: number;
    private baseVerticalOffset: number;

    private pendingPositioningUpdate: boolean = false;
    private pendingLayoutUpdate: boolean = false;
    private pendingReset: boolean = false;
    private currentDirection: Direction = Direction.ltr;

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.initialize();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        this.disconnectResizeDetector();
        this.disconnectIntersectionDetector();
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
        if (this.viewportRect === null || this.regionDimension === null) {
            this.requestLayoutUpdate();
            return;
        }

        this.startIntersectionObserver();
    };

    /**
     * Public function to enable authors to update the layout based on changes in anchor offset without resorting
     * to a more epensive update call
     */
    public updateAnchorOffset = (
        horizontalOffsetDelta: number,
        verticalOffsetDelta: number
    ): void => {
        this.anchorLeft = this.anchorLeft + horizontalOffsetDelta;
        this.anchorRight = this.anchorRight + horizontalOffsetDelta;

        this.anchorTop = this.anchorTop + verticalOffsetDelta;
        this.anchorBottom = this.anchorBottom + verticalOffsetDelta;

        this.requestLayoutUpdate();
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
        if (
            (this as FASTElement).$fastController.isConnected &&
            this.initialLayoutComplete
        ) {
            this.update();
        }
    }

    /**
     * fully initializes the component
     */
    private initialize(): void {
        this.initializeResizeDetector();
        this.initializeIntersectionDetector();
        // this.setInitialState();
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }
        this.requestReset();
    }

    /**
     * Request a layout update if there are currently no open requests
     */
    private requestLayoutUpdate(): void {
        if (this.pendingLayoutUpdate === false && this.pendingReset === false) {
            this.pendingLayoutUpdate = true;
            DOM.queueUpdate(this.updateLayout);
        }
    }

    /**
     * Request a reset if there are currently no open requests
     */
    private requestReset(): void {
        if (
            (this as FASTElement).$fastController.isConnected &&
            this.pendingReset === false
        ) {
            this.pendingLayoutUpdate = false;
            this.setInitialState();
            DOM.queueUpdate(this.reset);
            this.pendingReset = true;
        }
    }

    /**
     * sets the starting configuration for component internal values
     */
    private setInitialState(): void {
        this.initialLayoutComplete = false;
        this.regionTop = "0";
        this.regionRight = "unset";
        this.regionBottom = "unset";
        this.regionLeft = "0";
        this.regionWidth = "fit-content";
        this.regionHeight = "fit-content";

        this.xTransformOrigin = "left";
        this.yTransformOrigin = "top";

        this.viewportRect = null;
        this.regionDimension = { height: 0, width: 0 };

        this.anchorTop = 0;
        this.anchorRight = 0;
        this.anchorBottom = 0;
        this.anchorLeft = 0;
        this.anchorHeight = 0;
        this.anchorWidth = 0;

        this.verticalPosition = "undefined";
        this.horizontalPosition = "undefined";

        this.baseHorizontalOffset = 0;
        this.baseVerticalOffset = 0;

        this.updateRegionStyle();
    }

    /**
     * initialize intersection detector
     */
    private initializeIntersectionDetector = (): void => {
        this.disconnectIntersectionDetector();
        this.intersectionDetector = new IntersectionObserver(this.handleIntersection, {
            root: null,
            rootMargin: "0px",
            threshold: [0, 1],
        });
    };

    /**
     * starts observers
     */
    private startObservers = (): void => {
        this.stopObservers();

        if (this.anchorElement === null) {
            return;
        }

        this.startIntersectionObserver();

        if (this.resizeDetector !== null) {
            this.resizeDetector.observe(this.anchorElement);
            this.resizeDetector.observe(this);
        }
    };

    /**
     * starts intersection observer
     */
    private startIntersectionObserver = (): void => {
        if (this.anchorElement === null || this.pendingPositioningUpdate) {
            return;
        }
        if (this.intersectionDetector !== null) {
            this.intersectionDetector.observe(this);
            this.intersectionDetector.observe(this.anchorElement);
            if (this.viewportElement !== null) {
                this.intersectionDetector.observe(this.viewportElement);
            }
        }
    };

    /**
     * stops intersection observer
     */
    private stopIntersectionObserver = (): void => {
        if (this.intersectionDetector !== null) {
            this.intersectionDetector.disconnect();
            this.pendingPositioningUpdate = false;
        }
    };

    /**
     * stops observers
     */
    private stopObservers = (): void => {
        this.stopIntersectionObserver();
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
        }
    };

    /**
     * disconnect intersection observer
     */
    private disconnectIntersectionDetector = (): void => {
        if (this.intersectionDetector === null) {
            return;
        }

        this.intersectionDetector.disconnect();
        this.intersectionDetector = null;
    };

    /**
     * Gets the viewport element by id, or defaults to document root
     */
    private getViewport = (): HTMLElement | null => {
        if (typeof this.viewport !== "string" || this.viewport === "") {
            return document.documentElement;
        }

        return document.getElementById(this.viewport);
    };

    /**
     *  Gets the anchor element by id
     */
    private getAnchor = (): HTMLElement | null => {
        return document.getElementById(this.anchor);
    };

    /**
     *  Handle intersections
     */
    private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
        this.stopIntersectionObserver();

        let regionRect: DOMRect | ClientRect | null = null;

        if (!this.initialLayoutComplete) {
            regionRect = this.applyIntersectionEntries(entries);
            if (regionRect !== null) {
                this.updateRegionOffset(regionRect);
            }
            this.requestLayoutUpdate();
        } else {
            this.applyIntersectionEntries(entries);
            this.requestLayoutUpdate();
        }
    };

    /**
     *  iterate through intersection entries and apply data
     */
    private applyIntersectionEntries = (
        entries: IntersectionObserverEntry[]
    ): DOMRect | ClientRect | null => {
        let regionRect: DOMRect | ClientRect | null = null;
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.target === this) {
                this.handleRegionIntersection(entry);
                regionRect = entry.boundingClientRect;
            } else if (entry.target === this.anchorElement) {
                this.handleAnchorIntersection(entry);
            } else {
                // its the viewport
                this.viewportRect = entry.boundingClientRect;
            }
        });
        return regionRect;
    };

    /**
     *  Update data based on anchor intersections
     */
    private handleAnchorIntersection = (anchorEntry: IntersectionObserverEntry): void => {
        this.anchorTop = anchorEntry.boundingClientRect.top;
        this.anchorRight = anchorEntry.boundingClientRect.right;
        this.anchorBottom = anchorEntry.boundingClientRect.bottom;
        this.anchorLeft = anchorEntry.boundingClientRect.left;
        this.anchorHeight = anchorEntry.boundingClientRect.height;
        this.anchorWidth = anchorEntry.boundingClientRect.width;
    };

    /**
     *  Update data based on positioner intersections
     */
    private handleRegionIntersection = (regionEntry: IntersectionObserverEntry): void => {
        const regionRect: ClientRect | DOMRect = regionEntry.boundingClientRect;
        this.regionDimension = {
            height: regionRect.height,
            width: regionRect.width,
        };
    };

    /**
     *  Handle resize events
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        entries.forEach((entry: ResizeObserverEntry) => {
            if (entry.target === this) {
                this.handleRegionResize(entry);
            } else {
                this.update();
            }
        });
    };

    /**
     *  Handle region resize events
     */
    private handleRegionResize = (entry: ResizeObserverEntry): void => {
        switch (this.horizontalScaling) {
            case "content":
                this.regionDimension.width = entry.contentRect.width;
                break;

            case "anchor":
                this.regionDimension.width = this.anchorWidth;
                break;
        }

        switch (this.verticalScaling) {
            case "content":
                this.regionDimension.height = entry.contentRect.height;
                break;

            case "anchor":
                this.regionDimension.height = this.anchorHeight;
                break;
        }

        this.requestLayoutUpdate();
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
        if (!this.pendingLayoutUpdate) {
            return;
        }

        this.pendingLayoutUpdate = false;

        let desiredVerticalPosition: AnchoredRegionVerticalPositionLabel = "undefined";
        let desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel =
            "undefined";

        if (this.horizontalPositioningMode !== "uncontrolled") {
            const horizontalOptions: AnchoredRegionHorizontalPositionLabel[] = this.getHorizontalPositioningOptions();

            if (this.horizontalDefaultPosition !== "unset") {
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
                            ? "insetLeft"
                            : "left";
                        break;

                    case "right":
                        desiredHorizontalPosition = this.horizontalInset
                            ? "insetRight"
                            : "right";
                        break;
                }
            }

            const horizontalThreshold: number =
                this.horizontalThreshold !== undefined
                    ? this.horizontalThreshold
                    : this.regionDimension.width;

            if (
                desiredHorizontalPosition === "undefined" ||
                (!(this.horizontalPositioningMode === "locktodefault") &&
                    this.getAvailableWidth(desiredHorizontalPosition) <
                        horizontalThreshold)
            ) {
                desiredHorizontalPosition =
                    this.getAvailableWidth(horizontalOptions[0]) >
                    this.getAvailableWidth(horizontalOptions[1])
                        ? horizontalOptions[0]
                        : horizontalOptions[1];
            }
        }

        if (this.verticalPositioningMode !== "uncontrolled") {
            const verticalOptions: AnchoredRegionVerticalPositionLabel[] = this.getVerticalPositioningOptions();
            if (this.verticalDefaultPosition !== "unset") {
                switch (this.verticalDefaultPosition) {
                    case "top":
                        desiredVerticalPosition = this.verticalInset ? "insetTop" : "top";
                        break;

                    case "bottom":
                        desiredVerticalPosition = this.verticalInset
                            ? "insetBottom"
                            : "bottom";
                        break;
                }
            }

            const verticalThreshold: number =
                this.verticalThreshold !== undefined
                    ? this.verticalThreshold
                    : this.regionDimension.height;

            if (
                desiredVerticalPosition === "undefined" ||
                (!(this.verticalPositioningMode === "locktodefault") &&
                    this.getAvailableHeight(desiredVerticalPosition) < verticalThreshold)
            ) {
                desiredVerticalPosition =
                    this.getAvailableHeight(verticalOptions[0]) >
                    this.getAvailableHeight(verticalOptions[1])
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
            DOM.queueUpdate(() => this.$emit("loaded", this, { bubbles: false }));
        }

        if (positionChanged) {
            this.$emit("positionchange", this, { bubbles: false });
        }
    };

    /**
     *  Updates the style string applied to the region element as well as the css classes attached
     *  to the root element
     */
    private updateRegionStyle = (): void => {
        this.classList.toggle("top", this.verticalPosition === "top");
        this.classList.toggle("bottom", this.verticalPosition === "bottom");
        this.classList.toggle("inset-top", this.verticalPosition === "insetTop");
        this.classList.toggle("inset-bottom", this.verticalPosition === "insetBottom");

        this.classList.toggle("left", this.horizontalPosition === "left");
        this.classList.toggle("right", this.horizontalPosition === "right");
        this.classList.toggle("inset-left", this.horizontalPosition === "insetLeft");
        this.classList.toggle("inset-right", this.horizontalPosition === "insetRight");

        this.style.position = this.fixedPlacement ? "fixed" : "absolute";
        this.style.transformOrigin = `${this.yTransformOrigin} ${this.xTransformOrigin}`;
        this.style.opacity = this.initialLayoutComplete ? "1" : "0";

        if (this.horizontalPositioningMode === "uncontrolled") {
            this.style.width = "unset";
            this.style.right = "unset";
            this.style.left = "unset";
        } else {
            this.style.width = this.regionWidth;
            this.style.right = this.regionRight;
            this.style.left = this.regionLeft;
        }

        if (this.verticalPositioningMode === "uncontrolled") {
            this.style.height = "unset";
            this.style.top = "unset";
            this.style.bottom = "unset";
        } else {
            this.style.height = this.regionHeight;
            this.style.top = this.regionTop;
            this.style.bottom = this.regionBottom;
        }
    };

    /**
     * Get horizontal positioning state based on desired position
     */
    private setHorizontalPosition = (
        desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel,
        nextPositionerDimension: Dimension
    ): void => {
        const layoutParentWidth =
            this.offsetParent !== null
                ? this.offsetParent.clientWidth
                : document.body.clientWidth;

        let right: number | null = null;
        let left: number | null = null;
        let xTransformOrigin: string = "left";

        switch (desiredHorizontalPosition) {
            case "left":
                xTransformOrigin = "right";
                right = layoutParentWidth - this.baseHorizontalOffset;
                break;

            case "insetLeft":
                xTransformOrigin = "right";
                right = layoutParentWidth - this.anchorWidth - this.baseHorizontalOffset;
                break;

            case "insetRight":
                xTransformOrigin = "left";
                left = this.baseHorizontalOffset;
                break;

            case "right":
                xTransformOrigin = "left";
                left = this.anchorWidth + this.baseHorizontalOffset;
                break;
        }

        this.xTransformOrigin = xTransformOrigin;
        this.regionRight = right === null ? "unset" : `${right}px`;
        this.regionLeft = left === null ? "unset" : `${left}px`;
        this.horizontalPosition = desiredHorizontalPosition;

        switch (this.horizontalScaling) {
            case "anchor":
                this.regionWidth = `${this.anchorWidth}px`;
                break;

            case "fill":
                this.regionWidth = `${nextPositionerDimension.width}px`;
                break;

            case "content":
                this.regionWidth = "fit-content";
                break;
        }
    };

    /**
     * Get vertical positioning state based on desired position
     */
    private setVerticalPosition = (
        desiredVerticalPosition: AnchoredRegionVerticalPositionLabel,
        nextPositionerDimension: Dimension
    ): void => {
        const layoutParentHeight =
            this.offsetParent !== null
                ? this.offsetParent.clientHeight
                : document.body.clientHeight;

        let top: number | null = null;
        let bottom: number | null = null;
        let yTransformOrigin: string = "top";

        switch (desiredVerticalPosition) {
            case "top":
                yTransformOrigin = "bottom";
                bottom = layoutParentHeight - this.baseVerticalOffset;
                break;

            case "insetTop":
                yTransformOrigin = "bottom";
                bottom = layoutParentHeight - this.baseVerticalOffset - this.anchorHeight;
                break;

            case "insetBottom":
                yTransformOrigin = "top";
                top = this.baseVerticalOffset;
                break;

            case "bottom":
                yTransformOrigin = "top";
                top = this.baseVerticalOffset + this.anchorHeight;
                break;
        }

        this.yTransformOrigin = yTransformOrigin;
        this.regionTop = top === null ? "unset" : `${top}px`;
        this.regionBottom = bottom === null ? "unset" : `${bottom}px`;
        this.verticalPosition = desiredVerticalPosition;

        switch (this.verticalScaling) {
            case "anchor":
                this.regionHeight = `${this.anchorHeight}px`;
                break;

            case "fill":
                this.regionHeight = `${nextPositionerDimension.height}px`;
                break;

            case "content":
                this.regionHeight = "fit-content";
                break;
        }
    };

    /**
     *  Update the offset values
     */
    private updateRegionOffset = (regionRect: DOMRect | ClientRect): void => {
        if (this.horizontalPositioningMode === "uncontrolled") {
            this.baseHorizontalOffset = this.anchorLeft - regionRect.left;
        } else {
            switch (this.horizontalPosition) {
                case "undefined":
                    this.baseHorizontalOffset = this.anchorLeft - regionRect.left;
                    break;
                case "left":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorLeft - regionRect.right);
                    break;
                case "insetLeft":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorRight - regionRect.right);
                    break;
                case "insetRight":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorLeft - regionRect.left);
                    break;
                case "right":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorRight - regionRect.left);
                    break;
            }
        }

        if (this.verticalPositioningMode === "uncontrolled") {
            this.baseVerticalOffset = this.anchorTop - regionRect.top;
        } else {
            switch (this.verticalPosition) {
                case "undefined":
                    this.baseVerticalOffset = this.anchorTop - regionRect.top;
                    break;
                case "top":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorTop - regionRect.bottom);
                    break;
                case "insetTop":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorBottom - regionRect.bottom);
                    break;
                case "insetBottom":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorTop - regionRect.top);
                    break;
                case "bottom":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorBottom - regionRect.top);
                    break;
            }
        }
    };

    /**
     *  Get available Horizontal positions based on positioning mode
     */
    private getHorizontalPositioningOptions = (): AnchoredRegionHorizontalPositionLabel[] => {
        if (this.horizontalInset) {
            return ["insetLeft", "insetRight"];
        }

        return ["left", "right"];
    };

    /**
     * Get available Vertical positions based on positioning mode
     */
    private getVerticalPositioningOptions = (): AnchoredRegionVerticalPositionLabel[] => {
        if (this.verticalInset) {
            return ["insetTop", "insetBottom"];
        }

        return ["top", "bottom"];
    };

    /**
     *  Get the width available for a particular horizontal position
     */
    private getAvailableWidth = (
        positionOption: AnchoredRegionHorizontalPositionLabel
    ): number => {
        if (this.viewportRect !== null) {
            const spaceLeft: number = this.anchorLeft - this.viewportRect.left;
            const spaceRight: number =
                this.viewportRect.right - (this.anchorLeft + this.anchorWidth);

            switch (positionOption) {
                case "left":
                    return spaceLeft;
                case "insetLeft":
                    return spaceLeft + this.anchorWidth;
                case "insetRight":
                    return spaceRight + this.anchorWidth;
                case "right":
                    return spaceRight;
            }
        }

        return 0;
    };

    /**
     *  Get the height available for a particular vertical position
     */
    private getAvailableHeight = (
        positionOption: AnchoredRegionVerticalPositionLabel
    ): number => {
        if (this.viewportRect !== null) {
            const spaceAbove: number = this.anchorTop - this.viewportRect.top;
            const spaceBelow: number =
                this.viewportRect.bottom - (this.anchorTop + this.anchorHeight);

            switch (positionOption) {
                case "top":
                    return spaceAbove;
                case "insetTop":
                    return spaceAbove + this.anchorHeight;
                case "insetBottom":
                    return spaceBelow + this.anchorHeight;
                case "bottom":
                    return spaceBelow;
            }
        }
        return 0;
    };

    /**
     * Get region dimensions
     */
    private getNextRegionDimension = (
        desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel,
        desiredVerticalPosition: AnchoredRegionVerticalPositionLabel
    ): Dimension => {
        const newRegionDimension: Dimension = {
            height: this.regionDimension.height,
            width: this.regionDimension.width,
        };

        if (this.horizontalScaling === "fill") {
            newRegionDimension.width = this.getAvailableWidth(desiredHorizontalPosition);
        }

        if (this.verticalScaling === "fill") {
            newRegionDimension.height = this.getAvailableHeight(desiredVerticalPosition);
        }

        return newRegionDimension;
    };
}
