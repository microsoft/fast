import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import type {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "./resize-observer";
import { Direction, eventResize, eventScroll } from "@microsoft/fast-web-utilities";

import { getDirection } from "../utilities";
import { IntersectionService } from "./intersection-service";
import type { ResizeObserverEntry } from "./resize-observer-entry";

// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861

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
export type AutoUpdateMode = "anchor" | "auto";

/**
 * @internal
 */
interface Dimension {
    height: number;
    width: number;
}

/**
 * describes the possible horizontal positions of the region relative
 * to its anchor
 *
 * @internal
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
 *
 * @internal
 */
type AnchoredRegionVerticalPositionLabel =
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
export class AnchoredRegion extends FASTElement {
    /**
     * The HTML ID of the anchor element this region is positioned relative to
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
     * The HTML ID of the viewport element this region is positioned relative to
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
     *
     *
     * @beta
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    @attr({ attribute: "auto-update-mode" })
    public autoUpdateMode: AutoUpdateMode = "anchor";
    private autoUpdateModeChanged(
        prevMode: AutoUpdateMode,
        newMode: AutoUpdateMode
    ): void {
        if (
            (this as FASTElement).$fastController.isConnected &&
            this.initialLayoutComplete
        ) {
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

    private viewportRect: ClientRect | DOMRect | undefined;
    private anchorRect: ClientRect | DOMRect | undefined;
    private regionRect: ClientRect | DOMRect | undefined;

    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset: number = 0;
    private baseVerticalOffset: number = 0;

    private pendingPositioningUpdate: boolean = false;
    private pendingLayoutUpdate: boolean = false;
    private pendingReset: boolean = false;
    private currentDirection: Direction = Direction.ltr;
    private regionVisible: boolean = false;

    // defines how big a difference in pixels there must be between states to
    // justify a layout update that affects the dom (prevents repeated sub-pixel corrections)
    private updateThreshold: number = 0.5;

    private static intersectionService: IntersectionService = new IntersectionService();

    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
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
        if (this.viewportRect === undefined || this.regionRect === undefined) {
            this.requestLayoutUpdate();
            return;
        }

        this.requestPositionUpdates();
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
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }
        this.style.top = "0";
        this.style.left = "0";
        this.requestReset();
    }

    /**
     * Request a layout update if there are currently no open requests
     */
    private requestLayoutUpdate(): void {
        if (this.pendingLayoutUpdate === false && this.pendingReset === false) {
            this.pendingLayoutUpdate = true;
            DOM.queueUpdate(() => this.updateLayout());
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
            DOM.queueUpdate(() => this.reset());
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

        this.verticalPosition = "undefined";
        this.horizontalPosition = "undefined";

        this.style.opacity = "0";
        this.style.pointerEvents = "none";

        this.updateRegionStyle();
    }

    /**
     * starts observers
     */
    private startObservers = (): void => {
        this.stopObservers();

        if (this.anchorElement === null) {
            return;
        }

        this.requestPositionUpdates();

        if (this.resizeDetector !== null) {
            this.resizeDetector.observe(this.anchorElement);
            this.resizeDetector.observe(this);
        }
    };

    /**
     * get position updates
     */
    private requestPositionUpdates = (): void => {
        if (this.anchorElement === null || this.pendingPositioningUpdate) {
            return;
        }
        AnchoredRegion.intersectionService.requestPosition(this, this.handleIntersection);
        AnchoredRegion.intersectionService.requestPosition(
            this.anchorElement,
            this.handleIntersection
        );
        if (this.viewportElement !== null) {
            AnchoredRegion.intersectionService.requestPosition(
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
            AnchoredRegion.intersectionService.cancelRequestPosition(
                this,
                this.handleIntersection
            );
            if (this.anchorElement !== null) {
                AnchoredRegion.intersectionService.cancelRequestPosition(
                    this.anchorElement,
                    this.handleIntersection
                );
            }
            if (this.viewportElement !== null) {
                AnchoredRegion.intersectionService.cancelRequestPosition(
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
        let regionEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this
        );
        let anchorEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.anchorElement
        );
        let viewportEntry: IntersectionObserverEntry | undefined = entries.find(
            x => x.target === this.viewportElement
        );

        if (
            regionEntry === undefined ||
            viewportEntry === undefined ||
            anchorEntry === undefined
        ) {
            return false;
        }

        // don't update the dom unless there is a significant difference in rect positions
        if (
            this.regionRect === undefined ||
            this.anchorRect === undefined ||
            this.viewportRect === undefined ||
            this.isRectDifferent(this.anchorRect, anchorEntry.boundingClientRect) ||
            this.isRectDifferent(this.viewportRect, viewportEntry.boundingClientRect) ||
            this.isRectDifferent(this.regionRect, regionEntry.boundingClientRect)
        ) {
            this.updateRegionOffset(
                anchorEntry.boundingClientRect,
                this.anchorRect,
                regionEntry.boundingClientRect,
                this.regionRect
            );

            this.regionRect = regionEntry.boundingClientRect;
            this.anchorRect = anchorEntry.boundingClientRect;
            this.viewportRect = viewportEntry.boundingClientRect;

            return true;
        }

        return false;
    };

    /**
     *  compare rects to see if there is enough change to justify a DOM update
     */
    private isRectDifferent = (
        rectA: DOMRect | ClientRect,
        rectB: DOMRect | ClientRect
    ): boolean => {
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
        if (!this.initialLayoutComplete) {
            return;
        }

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
                    : this.regionRect !== undefined
                    ? this.regionRect.width
                    : 0;

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
                    : this.regionRect !== undefined
                    ? this.regionRect.height
                    : 0;

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

        if (positionChanged) {
            // do a position check to ensure we're in the right spot
            // temporary until method for recalculating offsets on position changes improved
            this.requestPositionUpdates();

            // emit change event
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

        this.style.width = this.regionWidth;
        this.style.height = this.regionHeight;

        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px)`;
    };

    /**
     * Get horizontal positioning state based on desired position
     */
    private setHorizontalPosition = (
        desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel,
        nextPositionerDimension: Dimension
    ): void => {
        if (this.regionRect === undefined || this.anchorRect === undefined) {
            return;
        }

        let nextRegionWidth: number = 0;

        switch (this.horizontalScaling) {
            case "anchor":
                nextRegionWidth = this.anchorRect.width;
                this.regionWidth = `${nextRegionWidth}px`;
                break;

            case "fill":
                nextRegionWidth = nextPositionerDimension.width;
                this.regionWidth = `${nextRegionWidth}px`;
                break;

            case "content":
                nextRegionWidth = this.regionRect.width;
                this.regionWidth = "unset";
                break;
        }

        switch (desiredHorizontalPosition) {
            case "left":
                this.translateX = this.baseHorizontalOffset - nextRegionWidth;
                break;

            case "insetLeft":
                this.translateX = this.baseHorizontalOffset - nextRegionWidth;
                break;

            case "insetRight":
                this.translateX = this.baseHorizontalOffset;
                break;

            case "right":
                this.translateX = this.baseHorizontalOffset + this.anchorRect.width;
                break;
        }

        this.horizontalPosition = desiredHorizontalPosition;
    };

    /**
     * Get vertical positioning state based on desired position
     */
    private setVerticalPosition = (
        desiredVerticalPosition: AnchoredRegionVerticalPositionLabel,
        nextPositionerDimension: Dimension
    ): void => {
        if (this.regionRect === undefined || this.anchorRect === undefined) {
            return;
        }

        let nextRegionHeight: number = 0;

        switch (this.verticalScaling) {
            case "anchor":
                nextRegionHeight = this.anchorRect.height;
                this.regionHeight = `${nextRegionHeight}px`;
                break;

            case "fill":
                nextRegionHeight = nextPositionerDimension.height;
                this.regionHeight = `${nextRegionHeight}px`;
                break;

            case "content":
                nextRegionHeight = this.regionRect.height;
                this.regionHeight = "unset";
                break;
        }

        switch (desiredVerticalPosition) {
            case "top":
                this.translateY = this.baseVerticalOffset - nextRegionHeight;
                break;

            case "insetTop":
                this.translateY = this.baseVerticalOffset - nextRegionHeight;
                break;

            case "insetBottom":
                this.translateY = this.baseVerticalOffset;
                break;

            case "bottom":
                this.translateY = this.baseVerticalOffset + this.anchorRect.height;
                break;
        }

        this.verticalPosition = desiredVerticalPosition;
    };

    /**
     *  Update the offset values
     */
    private updateRegionOffset = (
        anchorRectNew: ClientRect | DOMRect,
        anchreRectOld: ClientRect | DOMRect | undefined,
        regionRectNew: ClientRect | DOMRect,
        regionRectOld: ClientRect | DOMRect | undefined
    ): void => {
        if (this.horizontalPositioningMode === "uncontrolled") {
            this.baseHorizontalOffset = anchorRectNew.left - regionRectNew.left;
        } else {
            const regionWidthDelta: number =
                regionRectOld !== undefined
                    ? regionRectNew.width - regionRectOld.width
                    : 0;
            const anchorWidthDelta: number =
                anchreRectOld !== undefined
                    ? anchreRectOld.width - anchorRectNew.width
                    : 0;
            switch (this.horizontalPosition) {
                case "undefined":
                    this.baseHorizontalOffset = anchorRectNew.left - regionRectNew.left;
                    break;
                case "left":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (anchorRectNew.left - regionRectNew.right + regionWidthDelta);
                    break;
                case "insetLeft":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (anchorRectNew.right - regionRectNew.right + regionWidthDelta);
                    break;
                case "insetRight":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (anchorRectNew.left - regionRectNew.left + anchorWidthDelta);
                    break;
                case "right":
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (anchorRectNew.right - regionRectNew.left + anchorWidthDelta);
                    break;
            }
        }

        if (this.verticalPositioningMode === "uncontrolled") {
            this.baseVerticalOffset = anchorRectNew.top - regionRectNew.top;
        } else {
            const regionHeightDelta: number =
                regionRectOld !== undefined
                    ? regionRectNew.height - regionRectOld.height
                    : 0;
            const anchorHeightDelta: number =
                anchreRectOld !== undefined
                    ? anchreRectOld.height - anchorRectNew.height
                    : 0;
            switch (this.verticalPosition) {
                case "undefined":
                    this.baseVerticalOffset = anchorRectNew.top - regionRectNew.top;
                    break;
                case "top":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (anchorRectNew.top - regionRectNew.bottom + regionHeightDelta);
                    break;
                case "insetTop":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (anchorRectNew.bottom - regionRectNew.bottom + regionHeightDelta);
                    break;
                case "insetBottom":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (anchorRectNew.top - regionRectNew.top + anchorHeightDelta);
                    break;
                case "bottom":
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (anchorRectNew.bottom - regionRectNew.top + anchorHeightDelta);
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
        if (this.viewportRect !== undefined && this.anchorRect !== undefined) {
            const spaceLeft: number = this.anchorRect.left - this.viewportRect.left;
            const spaceRight: number =
                this.viewportRect.right - (this.anchorRect.left + this.anchorRect.width);

            switch (positionOption) {
                case "left":
                    return spaceLeft;
                case "insetLeft":
                    return spaceLeft + this.anchorRect.width;
                case "insetRight":
                    return spaceRight + this.anchorRect.width;
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
        if (this.viewportRect !== undefined && this.anchorRect !== undefined) {
            const spaceAbove: number = this.anchorRect.top - this.viewportRect.top;
            const spaceBelow: number =
                this.viewportRect.bottom - (this.anchorRect.top + this.anchorRect.height);

            switch (positionOption) {
                case "top":
                    return spaceAbove;
                case "insetTop":
                    return spaceAbove + this.anchorRect.height;
                case "insetBottom":
                    return spaceBelow + this.anchorRect.height;
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
            height: this.regionRect !== undefined ? this.regionRect.height : 0,
            width: this.regionRect !== undefined ? this.regionRect.width : 0,
        };

        if (this.horizontalScaling === "fill") {
            newRegionDimension.width = this.getAvailableWidth(desiredHorizontalPosition);
        }

        if (this.verticalScaling === "fill") {
            newRegionDimension.height = this.getAvailableHeight(desiredVerticalPosition);
        }

        return newRegionDimension;
    };

    /**
     * starts event listeners that can trigger auto updating
     */
    private startAutoUpdateEventListeners = (): void => {
        window.addEventListener(eventResize, this.update);
        window.addEventListener(eventScroll, this.update, true);
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
