import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";

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

export type AxisPositioningMode = "uncontrolled" | "locktodefault" | "dynamic";
export type AxisScalingMode = "anchor" | "fill" | "content";

export type HorizontalPosition = "start" | "end" | "left" | "right" | "unset";

export type VerticalPosition = "top" | "bottom" | "unset";
export interface Dimension {
    height: number;
    width: number;
}

enum AnchoredRegionHorizontalPositionLabel {
    left = "left",
    insetLeft = "insetLeft",
    insetRight = "insetRight",
    right = "right",
    undefined = "undefined",
}

enum AnchoredRegionVerticalPositionLabel {
    top = "top",
    insetTop = "insetTop",
    insetBottom = "insetBottom",
    bottom = "bottom",
    undefined = "undefined",
}

/**
 * location enum for transform origin settings
 */
enum Location {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom",
}

export class AnchoredRegion extends FASTElement {
    private static DirectionAttributeName: string = "dir";

    @attr
    public anchor: string = "";
    private anchorChanged(): void {
        if (this.initialLayoutComplete) {
            this.anchorElement = this.getAnchor();
        }
    }

    @attr
    public viewport: string = "";
    private viewportChanged(): void {
        if (this.initialLayoutComplete) {
            this.viewportElement = this.getViewport();
        }
    }

    @attr({ attribute: "horizontal-positioning-mode" })
    public horizontalPositioningMode: AxisPositioningMode = "uncontrolled";
    private horizontalPositioningModeChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "horizontal-default-position" })
    public horizontalDefaultPosition: HorizontalPosition = "unset";
    private horizontalDefaultPositionChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "horizontal-inset", mode: "boolean" })
    public horizontalInset: boolean = false;
    private horizontalInsetChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "horizontal-threshold" })
    public horizontalThreshold: string = "";
    private horizontalThresholdChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "horizontal-scaling" })
    public horizontalScaling: AxisScalingMode = "content";
    private horizontalScalingChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "vertical-positioning-mode" })
    public verticalPositioningMode: AxisPositioningMode = "uncontrolled";
    private verticalPositioningModeChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "vertical-default-position" })
    public verticalDefaultPosition: VerticalPosition = "unset";
    private verticalDefaultPositionChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "vertical-inset", mode: "boolean" })
    public verticalInset: boolean = false;
    private verticalInsetChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "vertical-threshold" })
    public verticalThreshold: string = "";
    private verticalThresholdChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "vertical-scaling" })
    public verticalScaling: AxisScalingMode = "content";
    private verticalScalingChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @attr({ attribute: "fixed-placement", mode: "boolean" })
    public fixedPlacement: boolean = false;
    private fixedPlacementChanged(): void {
        this.updateLayoutForAttributeChange();
    }

    @observable
    public regionStyle: string = "";

    /**
     * indicates that an initial positioning pass on layout has completed
     */
    @observable
    public initialLayoutComplete: boolean = false;

    @observable
    public anchorElement: HTMLElement | null = null;
    private anchorElementChanged(): void {
        if ((this as any).$fastController.isConnected && this.initialLayoutComplete) {
            this.reset();
        }
    }

    @observable
    public viewportElement: HTMLElement | null = null;
    private viewportElementChanged(): void {
        if ((this as any).$fastController.isConnected && this.initialLayoutComplete) {
            this.reset();
        }
    }

    /**
     * the positions currently being applied to layout
     */
    public verticalPosition: AnchoredRegionVerticalPositionLabel;
    public horizontalPosition: AnchoredRegionHorizontalPositionLabel;

    /**
     * values to be applied to the component's transform origin attribute on render
     */
    private transformOrigin: string;

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

    private collisionDetector: IntersectionObserver | null;
    private resizeDetector: ResizeObserverClassDefinition | null;

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

    /**
     * reference to the actual anchored container
     */
    public region: HTMLDivElement | null;

    private openRequestAnimationFrame: boolean = false;
    private currentDirection: Direction = Direction.ltr;
    private noCollisionMode = false;

    constructor() {
        super();
        this.setInitialState();
    }

    connectedCallback() {
        super.connectedCallback();

        this.currentDirection = this.getDirection();

        this.connectObservers();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.disconnectObservers();
        this.region = null;
    }

    public adoptedCallback() {
        this.reset();
    }

    /**
     * event thrown when the region's position changes
     */
    private updateLayoutForAttributeChange(): void {
        if (this.initialLayoutComplete) {
            this.requestLayoutUpdate();
        }
    }

    /**
     * resets the component
     */
    private reset = (): void => {
        // TODO: don't commpletely reset observers
        this.disconnectObservers();
        this.setInitialState();
        this.connectObservers();
        this.requestLayoutUpdate();
    };

    /**
     * sets the starting configuration for component internal values
     */
    private setInitialState = (): void => {
        this.initialLayoutComplete = false;
        this.noCollisionMode = false;
        this.transformOrigin = "top left";
        this.regionTop = "unset";
        this.regionRight = "unset";
        this.regionBottom = "unset";
        this.regionLeft = "unset";
        this.regionWidth = "fit-content";
        this.regionHeight = "fit-content";

        this.xTransformOrigin = Location.left;
        this.yTransformOrigin = Location.top;

        this.viewportRect = null;
        this.regionDimension = { height: 0, width: 0 };

        this.anchorTop = 0;
        this.anchorRight = 0;
        this.anchorBottom = 0;
        this.anchorLeft = 0;
        this.anchorHeight = 0;
        this.anchorWidth = 0;

        this.verticalPosition = AnchoredRegionVerticalPositionLabel.undefined;
        this.horizontalPosition = AnchoredRegionHorizontalPositionLabel.undefined;

        this.baseHorizontalOffset = 0;
        this.baseVerticalOffset = 0;

        this.regionStyle = "{position: absolute}";
    };

    /**
     * connects observers
     */
    private connectObservers = (): void => {
        if (this.viewportElement === null) {
            this.viewportElement = this.getViewport();
        }

        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }

        if (
            this.anchorElement === null ||
            this.viewportElement === null ||
            this.region === null ||
            this.region.offsetParent === null ||
            !this.viewportElement.contains(this.anchorElement)
        ) {
            return;
        }

        this.collisionDetector = new IntersectionObserver(this.handleCollision, {
            root: this.viewportElement,
            rootMargin: "0px",
            threshold: [0, 1],
        });

        this.collisionDetector.observe(this.region);
        this.collisionDetector.observe(this.anchorElement);

        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleResize
        );
        this.resizeDetector.observe(this.anchorElement);
        this.resizeDetector.observe(this.region);
    };

    /**
     * disconnect observers
     */
    private disconnectObservers = (): void => {
        this.disconnectResizeObserver();
        this.disconnecIntersectionObserver();
    };

    /**
     * disconnect resize observer
     */
    private disconnectResizeObserver = (): void => {
        if (this.resizeDetector === null) {
            return;
        }

        this.resizeDetector.disconnect();
        this.resizeDetector = null;
    };

    /**
     * disconnect intersection observer
     */
    private disconnecIntersectionObserver = (): void => {
        if (this.collisionDetector === null) {
            return;
        }

        this.collisionDetector.disconnect();
        this.collisionDetector = null;
    };

    /**
     * Gets the viewport element by id, or defaults to component parent
     */
    public getViewport = (): HTMLElement | null => {
        if (typeof this.viewport !== "string" || this.viewport === "") {
            return this.parentElement;
        }

        return document.getElementById(this.viewport);
    };

    /**
     *  Gets the anchor element by id
     */
    public getAnchor = (): HTMLElement | null => {
        return document.getElementById(this.anchor);
    };

    /**
     * Public function to enable authors to update the layout based on changes in anchor offset
     * allows "fill" regions to scale as parent viewports scroll, or to provoke positioning to change
     * without a collision with the viewport
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
     *  Confirms that there is a valid relationship between the viewport and the intersection entry
     *  ie. that the data is useful
     */
    private isValidIntersection = (entry: IntersectionObserverEntry): boolean => {
        return (
            entry.rootBounds !== null &&
            this.viewportElement !== null &&
            Math.round(entry.rootBounds.height) ===
                Math.round(this.viewportElement.clientHeight)
        );
    };

    /**
     *  Handle collisions
     */
    private handleCollision = (entries: IntersectionObserverEntry[]): void => {
        if (
            this.viewportElement === null ||
            this.region === null ||
            this.anchorElement === null
        ) {
            return;
        }

        let regionRect: DOMRect | ClientRect | null = null;

        if (!this.initialLayoutComplete) {
            if (entries.length !== 2) {
                return;
            }

            if (
                !this.isValidIntersection(entries[0]) ||
                !this.isValidIntersection(entries[1])
            ) {
                this.noCollisionMode = true;
                this.disconnecIntersectionObserver();
                regionRect = this.region.getBoundingClientRect();
                this.regionDimension = {
                    height: regionRect.height,
                    width: regionRect.width,
                };

                this.viewportRect = this.viewportElement.getBoundingClientRect();

                const anchorRect: DOMRect = this.anchorElement.getBoundingClientRect();
                this.anchorTop = anchorRect.top;
                this.anchorRight = anchorRect.right;
                this.anchorBottom = anchorRect.bottom;
                this.anchorLeft = anchorRect.left;
                this.anchorHeight = anchorRect.height;
                this.anchorWidth = anchorRect.width;
            } else {
                regionRect = this.applyCollisionEntries(entries);
            }

            if (regionRect !== null) {
                this.updateRegionOffset(regionRect);
            }

            this.requestLayoutUpdate();
        } else {
            if (!this.noCollisionMode) {
                this.applyCollisionEntries(entries);
                this.requestLayoutUpdate();
            }
        }
    };

    /**
     *  iterate through intersection entries and apply data
     */
    private applyCollisionEntries = (
        entries: IntersectionObserverEntry[]
    ): DOMRect | ClientRect | null => {
        let regionRect: DOMRect | ClientRect | null = null;
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.target === this.region) {
                this.handleRegionCollision(entry, entries.length === 1);
                regionRect = entry.boundingClientRect;
            } else {
                this.handleAnchorCollision(entry);
            }
        });
        return regionRect;
    };

    /**
     *  Update data based on anchor collisions
     */
    private handleAnchorCollision = (anchorEntry: IntersectionObserverEntry): void => {
        this.viewportRect = anchorEntry.rootBounds;
        this.anchorTop = anchorEntry.boundingClientRect.top;
        this.anchorRight = anchorEntry.boundingClientRect.right;
        this.anchorBottom = anchorEntry.boundingClientRect.bottom;
        this.anchorLeft = anchorEntry.boundingClientRect.left;
        this.anchorHeight = anchorEntry.boundingClientRect.height;
        this.anchorWidth = anchorEntry.boundingClientRect.width;
    };

    /**
     *  Update data based on positioner collisions
     */
    private handleRegionCollision = (
        regionEntry: IntersectionObserverEntry,
        shouldDeriveAnchorPosition: boolean
    ): void => {
        this.viewportRect = regionEntry.rootBounds;
        const regionRect: ClientRect | DOMRect = regionEntry.boundingClientRect;
        this.regionDimension = {
            height: regionRect.height,
            width: regionRect.width,
        };

        if (shouldDeriveAnchorPosition) {
            switch (this.verticalPosition) {
                case AnchoredRegionVerticalPositionLabel.top:
                    this.anchorTop = regionRect.bottom;
                    this.anchorBottom = this.anchorTop + this.anchorHeight;
                    break;

                case AnchoredRegionVerticalPositionLabel.insetTop:
                    this.anchorBottom = regionRect.bottom;
                    this.anchorTop = this.anchorBottom - this.anchorHeight;
                    break;

                case AnchoredRegionVerticalPositionLabel.insetBottom:
                    this.anchorTop = regionRect.top;
                    this.anchorBottom = this.anchorTop + this.anchorHeight;
                    break;

                case AnchoredRegionVerticalPositionLabel.bottom:
                    this.anchorBottom = regionRect.top;
                    this.anchorTop = this.anchorBottom - this.anchorHeight;
                    break;
            }

            switch (this.horizontalPosition) {
                case AnchoredRegionHorizontalPositionLabel.left:
                    this.anchorLeft = regionRect.right;
                    this.anchorRight = this.anchorLeft + this.anchorWidth;
                    break;

                case AnchoredRegionHorizontalPositionLabel.insetLeft:
                    this.anchorRight = regionRect.right;
                    this.anchorLeft = this.anchorRight - this.anchorWidth;
                    break;

                case AnchoredRegionHorizontalPositionLabel.insetRight:
                    this.anchorLeft = regionRect.left;
                    this.anchorRight = this.anchorLeft + this.anchorWidth;
                    break;

                case AnchoredRegionHorizontalPositionLabel.right:
                    this.anchorRight = regionRect.left;
                    this.anchorLeft = this.anchorRight - this.anchorWidth;
                    break;
            }
        }
    };

    /**
     *  Handle resize events
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        entries.forEach((entry: ResizeObserverEntry) => {
            if (entry.target === this.region) {
                this.handleRegionResize(entry);
            } else {
                this.handleAnchorResize(entry);
            }
        });

        this.requestLayoutUpdate();
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
    };

    /**
     *  Handle anchor resize events
     */
    private handleAnchorResize = (entry: ResizeObserverEntry): void => {
        this.anchorHeight = entry.contentRect.height;
        this.anchorWidth = entry.contentRect.width;

        if (
            this.verticalPosition === AnchoredRegionVerticalPositionLabel.top ||
            this.verticalPosition === AnchoredRegionVerticalPositionLabel.insetTop
        ) {
            this.anchorBottom = this.anchorTop + this.anchorHeight;
        } else {
            this.anchorTop = this.anchorBottom - this.anchorHeight;
        }

        if (
            this.horizontalPosition === AnchoredRegionHorizontalPositionLabel.left ||
            this.horizontalPosition === AnchoredRegionHorizontalPositionLabel.insetLeft
        ) {
            this.anchorRight = this.anchorLeft + this.anchorWidth;
        } else {
            this.anchorLeft = this.anchorRight - this.anchorWidth;
        }
    };

    /**
     * Request's an animation frame if there are currently no open animation frame requests
     */
    private requestLayoutUpdate = (): void => {
        if (this.openRequestAnimationFrame === false) {
            this.openRequestAnimationFrame = true;
            DOM.queueUpdate(this.updateLayout);
        }
    };

    /**
     *  Recalculate layout related state values
     */
    private updateLayout = (): void => {
        this.openRequestAnimationFrame = false;

        if (this.viewportRect === null || this.regionDimension === null) {
            return;
        }

        // if direction changes we need to reset the layout
        const newDirection: Direction = this.getDirection();
        if (newDirection !== this.currentDirection) {
            this.currentDirection = newDirection;
            this.reset();
            return;
        }

        let desiredVerticalPosition: AnchoredRegionVerticalPositionLabel =
            AnchoredRegionVerticalPositionLabel.undefined;
        let desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel =
            AnchoredRegionHorizontalPositionLabel.undefined;

        if (this.horizontalPositioningMode !== "uncontrolled") {
            const horizontalOptions: AnchoredRegionHorizontalPositionLabel[] = this.getHorizontalPositioningOptions();

            if (this.horizontalDefaultPosition !== "unset") {
                let dirCorrectedHorizontalDefaultPosition: string = this
                    .horizontalDefaultPosition;

                if (
                    dirCorrectedHorizontalDefaultPosition === "start" ||
                    dirCorrectedHorizontalDefaultPosition === "end"
                ) {
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
                            ? AnchoredRegionHorizontalPositionLabel.insetLeft
                            : AnchoredRegionHorizontalPositionLabel.left;
                        break;

                    case "right":
                        desiredHorizontalPosition = this.horizontalInset
                            ? AnchoredRegionHorizontalPositionLabel.insetRight
                            : AnchoredRegionHorizontalPositionLabel.right;
                        break;
                }
            }

            const horizontalThreshold: number =
                this.horizontalThreshold !== undefined
                    ? Number(this.horizontalThreshold)
                    : this.regionDimension.width;

            if (
                desiredHorizontalPosition ===
                    AnchoredRegionHorizontalPositionLabel.undefined ||
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
                        desiredVerticalPosition = this.verticalInset
                            ? AnchoredRegionVerticalPositionLabel.insetTop
                            : AnchoredRegionVerticalPositionLabel.top;
                        break;

                    case "bottom":
                        desiredVerticalPosition = this.verticalInset
                            ? AnchoredRegionVerticalPositionLabel.insetBottom
                            : AnchoredRegionVerticalPositionLabel.bottom;
                        break;
                }
            }

            const verticalThreshold: number =
                this.verticalThreshold !== undefined
                    ? Number(this.verticalThreshold)
                    : this.regionDimension.height;

            if (
                desiredVerticalPosition ===
                    AnchoredRegionVerticalPositionLabel.undefined ||
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
        this.transformOrigin = `${this.yTransformOrigin} ${this.xTransformOrigin}`;

        this.updateRegionStyle();

        this.initialLayoutComplete = true;

        if (positionChanged) {
            this.$emit("change");
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

        this.regionStyle = `
            position: ${this.fixedPlacement ? "fixed" : "absolute"};
            height: ${this.regionHeight};
            width: ${this.regionWidth};
            top: ${this.regionTop};
            right: ${this.regionRight}; 
            bottom: ${this.regionBottom};
            left: ${this.regionLeft}; 
            transform-origin: ${this.transformOrigin};
            opacity: ${this.initialLayoutComplete ? 1 : 0}
        `;
    };

    /**
     * Get horizontal positioning state based on desired position
     */
    private setHorizontalPosition = (
        desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel,
        nextPositionerDimension: Dimension
    ): void => {
        let right: number | null = null;
        let left: number | null = null;
        let xTransformOrigin: string = Location.left;

        switch (desiredHorizontalPosition) {
            case AnchoredRegionHorizontalPositionLabel.left:
                xTransformOrigin = Location.right;
                right = -this.baseHorizontalOffset;
                break;

            case AnchoredRegionHorizontalPositionLabel.insetLeft:
                xTransformOrigin = Location.right;
                right = -this.anchorWidth - this.baseHorizontalOffset;
                break;

            case AnchoredRegionHorizontalPositionLabel.insetRight:
                xTransformOrigin = Location.left;
                left = this.baseHorizontalOffset;
                break;

            case AnchoredRegionHorizontalPositionLabel.right:
                xTransformOrigin = Location.left;
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
        let top: number | null = null;
        let bottom: number | null = null;
        let yTransformOrigin: string = Location.top;

        switch (desiredVerticalPosition) {
            case AnchoredRegionVerticalPositionLabel.top:
                yTransformOrigin = Location.bottom;
                bottom = this.anchorHeight - this.baseVerticalOffset;
                break;

            case AnchoredRegionVerticalPositionLabel.insetTop:
                yTransformOrigin = Location.bottom;
                bottom = -this.baseVerticalOffset;
                break;

            case AnchoredRegionVerticalPositionLabel.insetBottom:
                yTransformOrigin = Location.top;
                top = this.baseVerticalOffset - this.anchorHeight;
                break;

            case AnchoredRegionVerticalPositionLabel.bottom:
                yTransformOrigin = Location.top;
                top = this.baseVerticalOffset;
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
                case AnchoredRegionHorizontalPositionLabel.undefined:
                    this.baseHorizontalOffset = this.anchorLeft - regionRect.left;
                    break;
                case AnchoredRegionHorizontalPositionLabel.left:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorLeft - regionRect.right);
                    break;
                case AnchoredRegionHorizontalPositionLabel.insetLeft:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorRight - regionRect.right);
                    break;
                case AnchoredRegionHorizontalPositionLabel.insetRight:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorLeft - regionRect.left);
                    break;
                case AnchoredRegionHorizontalPositionLabel.right:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset + (this.anchorRight - regionRect.left);
                    break;
            }
        }

        if (this.verticalPositioningMode === "uncontrolled") {
            this.baseVerticalOffset = this.anchorBottom - regionRect.top;
        } else {
            switch (this.verticalPosition) {
                case AnchoredRegionVerticalPositionLabel.undefined:
                    this.baseVerticalOffset = this.anchorBottom - regionRect.top;
                    break;
                case AnchoredRegionVerticalPositionLabel.top:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorTop - regionRect.bottom);
                    break;
                case AnchoredRegionVerticalPositionLabel.insetTop:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorBottom - regionRect.bottom);
                    break;
                case AnchoredRegionVerticalPositionLabel.insetBottom:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorTop - regionRect.top);
                    break;
                case AnchoredRegionVerticalPositionLabel.bottom:
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
            return [
                AnchoredRegionHorizontalPositionLabel.insetLeft,
                AnchoredRegionHorizontalPositionLabel.insetRight,
            ];
        }

        return [
            AnchoredRegionHorizontalPositionLabel.left,
            AnchoredRegionHorizontalPositionLabel.right,
        ];
    };

    /**
     * Get available Vertical positions based on positioning mode
     */
    private getVerticalPositioningOptions = (): AnchoredRegionVerticalPositionLabel[] => {
        if (this.verticalInset) {
            return [
                AnchoredRegionVerticalPositionLabel.insetTop,
                AnchoredRegionVerticalPositionLabel.insetBottom,
            ];
        }

        return [
            AnchoredRegionVerticalPositionLabel.top,
            AnchoredRegionVerticalPositionLabel.bottom,
        ];
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
                case AnchoredRegionHorizontalPositionLabel.left:
                    return spaceLeft;
                case AnchoredRegionHorizontalPositionLabel.insetLeft:
                    return spaceLeft + this.anchorWidth;
                case AnchoredRegionHorizontalPositionLabel.insetRight:
                    return spaceRight + this.anchorWidth;
                case AnchoredRegionHorizontalPositionLabel.right:
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
                case AnchoredRegionVerticalPositionLabel.top:
                    return spaceAbove;
                case AnchoredRegionVerticalPositionLabel.insetTop:
                    return spaceAbove + this.anchorHeight;
                case AnchoredRegionVerticalPositionLabel.insetBottom:
                    return spaceBelow + this.anchorHeight;
                case AnchoredRegionVerticalPositionLabel.bottom:
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

    /**
     *  gets the current direction
     */
    private getDirection = (): Direction => {
        if (this.viewportElement === null) {
            return Direction.ltr;
        }

        const closest: Element | null = this.viewportElement.closest(
            `[${AnchoredRegion.DirectionAttributeName}]`
        );

        return closest === null ||
            closest.getAttribute(AnchoredRegion.DirectionAttributeName) === Direction.ltr
            ? Direction.ltr
            : Direction.rtl;
    };
}
