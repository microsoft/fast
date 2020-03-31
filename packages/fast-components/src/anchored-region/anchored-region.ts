import { attr, FastElement, observable, ref } from "@microsoft/fast-element";
import { isNil } from "lodash-es";
import { ResizeObserverClassDefinition } from "./resize-observer";
import { ContentRect } from "./resize-observer-entry";

export type AxisPositioningMode = "uncontrolled" | "locktodefault" | "dynamic";

export type HorizontalPosition = "start" | "end" | "left" | "right" | "unset";

export type VerticalPosition = "top" | "bottom" | "unset";

export declare const contentRect: (target: Element) => Readonly<ContentRect>;

export declare class ResizeObserverEntry {
    public readonly target: Element;
    public readonly contentRect: ContentRect;
    constructor(target: Element);
}

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

export class AnchoredRegion extends FastElement {
    @attr
    public anchor: string = "";
    private anchorChanged(): void {}

    @attr
    public viewport: string = "";
    private viewportChanged(): void {}

    @attr({ attribute: "horizontal-positioning-mode" })
    public horizontalPositioningMode: AxisPositioningMode = "uncontrolled";
    @attr({ attribute: "horizontal-default-position" })
    public horizontalDefaultPosition: HorizontalPosition = "unset";
    @attr({ attribute: "horizontal-inset" })
    public horizontalInset: boolean = false;
    @attr({ attribute: "horizontal-threshold" })
    public horizontalThreshold: string = "";
    @attr({ attribute: "horizontal-scaling" })
    public horizontalScaling: boolean = false;

    @attr({ attribute: "vertical-positioning-mode" })
    public verticalPositioningMode: AxisPositioningMode = "uncontrolled";
    @attr({ attribute: "vertical-default-position" })
    public verticalDefaultPosition: VerticalPosition = "unset";
    @attr({ attribute: "vertical-inset" })
    public verticalInset: boolean = false;
    @attr({ attribute: "vertical-threshold" })
    public verticalThreshold: string = "";
    @attr({ attribute: "vertical-scaling" })
    public verticalScaling: boolean = false;

    @observable
    public regionStyle: string = "";

    /**
     * indicates that an initial positioning pass on layout has completed
     */
    @observable
    public initialLayoutComplete: boolean;

    public anchorElement: HTMLElement | null;
    private anchorElementChanged(): void {}

    public viewportElement: HTMLElement | null;
    private viewportElementChanged(): void {}

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

    private collisionDetector: IntersectionObserver;
    private resizeDetector: ResizeObserverClassDefinition;

    private viewportRect: ClientRect | DOMRect | null;
    private positionerDimension: Dimension;

    private anchorTop: number;
    private anchorRight: number;
    private anchorBottom: number;
    private anchorLeft: number;
    private anchorHeight: number;
    private anchorWidth: number;

    private viewportScrollTop: number;
    private viewportScrollLeft: number;

    /**
     * the positions currently being applied to layout
     */
    currentVerticalPosition: AnchoredRegionVerticalPositionLabel;
    currentHorizontalPosition: AnchoredRegionHorizontalPositionLabel;

    /**
     * base offsets between the positioner's base position and the anchor's
     */
    private baseHorizontalOffset: number;
    private baseVerticalOffset: number;

    public region: HTMLDivElement;

    constructor() {
        super();
        this.setInitialState();
    }

    connectedCallback() {
        super.connectedCallback();

        if (isNil(this.viewportElement)) {
            this.viewportElement = this.getViewport();
        }

        if (isNil(this.anchorElement)) {
            this.anchorElement = this.getAnchor();
        }

        if (isNil(this.anchorElement) || isNil(this.viewportElement)) {
            return;
        }

        this.connectObservers();

        this.updateLayout();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.disconnectObservers();
    }

    adoptedCallback() {
        //do we need to handle this?
    }

    positionChanged() {
        this.classList.add();
        this.classList.remove();
        // this.dispatchEvent(
        //     new CustomEvent("changed", {
        //         bubbles: false,
        //         composed: true,
        //         detail: "current position",
        //     })
        // );
    }

    private setInitialState = (): void => {
        this.initialLayoutComplete = false;
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
        this.positionerDimension = { height: 0, width: 0 };

        this.anchorTop = 0;
        this.anchorRight = 0;
        this.anchorBottom = 0;
        this.anchorLeft = 0;
        this.anchorHeight = 0;
        this.anchorWidth = 0;

        this.viewportScrollTop = 0;
        this.viewportScrollLeft = 0;

        this.currentVerticalPosition = AnchoredRegionVerticalPositionLabel.undefined;
        this.currentHorizontalPosition = AnchoredRegionHorizontalPositionLabel.undefined;

        this.baseHorizontalOffset = 0;
        this.baseVerticalOffset = 0;
    };

    private connectObservers = (): void => {
        if (isNil(this.anchorElement) || isNil(this.viewportElement)) {
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

        this.viewportElement.addEventListener("scroll", this.handleScroll);
    };

    private disconnectObservers = (): void => {
        this.collisionDetector.disconnect();
        this.resizeDetector.disconnect();

        if (this.viewportElement !== null) {
            this.viewportElement.removeEventListener("scroll", this.handleScroll);
        }
    };

    /**
     * Gets the viewport element
     */
    private getViewport = (): HTMLElement | null => {
        if (isNil(this.viewport)) {
            return this.region.parentElement;
        }

        return document.getElementById(this.viewport);
    };

    /**
     *  Gets the anchor element
     */
    private getAnchor = (): HTMLElement | null => {
        return document.getElementById(this.anchor);
    };

    /**
     *  Handle collisions
     */
    private handleCollision = (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
    ): void => {
        let positionerRect: DOMRect | ClientRect | null = null;
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.target === this.region) {
                this.handlePositionerCollision(entry, entries.length === 1);
                positionerRect = entry.boundingClientRect;
            } else {
                this.handleAnchorCollision(entry);
            }
        });

        if (!isNil(this.viewportElement)) {
            this.viewportScrollTop = this.viewportElement.scrollTop;
            this.viewportScrollLeft = this.viewportElement.scrollLeft;
        }
        if (entries.length === 2 && positionerRect !== null) {
            this.updatePositionerOffset(positionerRect);
        }
        this.updateLayout();
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
    private handlePositionerCollision = (
        positionerEntry: IntersectionObserverEntry,
        shouldDeriveAnchorPosition: boolean
    ): void => {
        this.viewportRect = positionerEntry.rootBounds;
        const positionerRect: ClientRect | DOMRect = positionerEntry.boundingClientRect;
        this.positionerDimension = {
            height: positionerRect.height,
            width: positionerRect.width,
        };

        if (shouldDeriveAnchorPosition) {
            switch (this.currentVerticalPosition) {
                case AnchoredRegionVerticalPositionLabel.top:
                    this.anchorTop = positionerRect.bottom;
                    this.anchorBottom = this.anchorTop + this.anchorHeight;
                    break;

                case AnchoredRegionVerticalPositionLabel.insetTop:
                    this.anchorBottom = positionerRect.bottom;
                    this.anchorTop = this.anchorBottom - this.anchorHeight;
                    break;

                case AnchoredRegionVerticalPositionLabel.insetBottom:
                    this.anchorTop = positionerRect.top;
                    this.anchorBottom = this.anchorTop + this.anchorHeight;
                    break;

                case AnchoredRegionVerticalPositionLabel.bottom:
                    this.anchorBottom = positionerRect.top;
                    this.anchorTop = this.anchorBottom - this.anchorHeight;
                    break;
            }

            switch (this.currentHorizontalPosition) {
                case AnchoredRegionHorizontalPositionLabel.left:
                    this.anchorLeft = positionerRect.right;
                    this.anchorRight = this.anchorLeft + this.anchorWidth;
                    break;

                case AnchoredRegionHorizontalPositionLabel.insetLeft:
                    this.anchorRight = positionerRect.right;
                    this.anchorLeft = this.anchorRight - this.anchorWidth;
                    break;

                case AnchoredRegionHorizontalPositionLabel.insetRight:
                    this.anchorLeft = positionerRect.left;
                    this.anchorRight = this.anchorLeft + this.anchorWidth;
                    break;

                case AnchoredRegionHorizontalPositionLabel.right:
                    this.anchorRight = positionerRect.left;
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

        this.updateLayout();
    };

    /**
     *  Handle region resize events
     */
    private handleRegionResize = (entry: ResizeObserverEntry): void => {
        if (!this.horizontalScaling) {
            this.positionerDimension.width = entry.contentRect.width;
        }

        if (!this.verticalScaling) {
            this.positionerDimension.height = entry.contentRect.height;
        }
    };

    /**
     *  Handle anchor resize events
     */
    private handleAnchorResize = (entry: ResizeObserverEntry): void => {
        this.anchorHeight = entry.contentRect.height;
        this.anchorWidth = entry.contentRect.width;

        if (
            this.currentVerticalPosition === AnchoredRegionVerticalPositionLabel.top ||
            this.currentVerticalPosition === AnchoredRegionVerticalPositionLabel.insetTop
        ) {
            this.anchorBottom = this.anchorTop + this.anchorHeight;
        } else {
            this.anchorTop = this.anchorBottom - this.anchorHeight;
        }

        if (
            this.currentHorizontalPosition ===
                AnchoredRegionHorizontalPositionLabel.left ||
            this.currentHorizontalPosition ===
                AnchoredRegionHorizontalPositionLabel.insetLeft
        ) {
            this.anchorRight = this.anchorLeft + this.anchorWidth;
        } else {
            this.anchorLeft = this.anchorRight - this.anchorWidth;
        }
    };

    /**
     *  Handle scroll events
     */
    private handleScroll = (): void => {
        this.updateLayout();
    };

    /**
     *  Recalculate layout related state values
     */
    private updateLayout = (): void => {
        if (isNil(this.viewportRect) || isNil(this.positionerDimension)) {
            return;
        }

        this.updateForScrolling();

        let desiredVerticalPosition: AnchoredRegionVerticalPositionLabel =
            AnchoredRegionVerticalPositionLabel.undefined;
        let desiredHorizontalPosition: AnchoredRegionHorizontalPositionLabel =
            AnchoredRegionHorizontalPositionLabel.undefined;

        if (this.horizontalPositioningMode !== "uncontrolled") {
            const horizontalOptions: AnchoredRegionHorizontalPositionLabel[] = this.getHorizontalPositioningOptions();
            if (this.horizontalDefaultPosition !== "unset") {
                switch (this.horizontalDefaultPosition) {
                    // todo: rtl support for start/end
                    case "left":
                    case "start":
                        desiredHorizontalPosition = this.horizontalInset
                            ? AnchoredRegionHorizontalPositionLabel.insetLeft
                            : AnchoredRegionHorizontalPositionLabel.left;
                        break;

                    case "right":
                    case "end":
                        desiredHorizontalPosition = this.horizontalInset
                            ? AnchoredRegionHorizontalPositionLabel.insetRight
                            : AnchoredRegionHorizontalPositionLabel.right;
                        break;
                }
            }

            const horizontalThreshold: number =
                this.horizontalThreshold !== undefined
                    ? Number(this.horizontalThreshold)
                    : this.positionerDimension.width;

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
                    : this.positionerDimension.height;

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

        this.setHorizontalPosition(desiredHorizontalPosition, nextPositionerDimension);
        this.setVerticalPosition(desiredVerticalPosition, nextPositionerDimension);
        this.transformOrigin = `${this.yTransformOrigin} ${this.xTransformOrigin}`;

        this.updateRegionStyle();

        this.initialLayoutComplete = true;
    };

    /**
     *
     */
    private updateRegionStyle = (): void => {
        this.regionStyle = `
            height: ${this.regionHeight};
            width: ${this.regionWidth};
            top: ${this.regionTop};
            right: ${this.regionRight}; 
            bottom: ${this.regionBottom};
            left: ${this.regionLeft}; 
            transform-origin: ${this.transformOrigin};
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
                right = nextPositionerDimension.width - this.baseHorizontalOffset;
                break;

            case AnchoredRegionHorizontalPositionLabel.insetLeft:
                xTransformOrigin = Location.right;
                right =
                    nextPositionerDimension.width -
                    this.anchorWidth -
                    this.baseHorizontalOffset;
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
        this.regionRight = right === null ? "unset" : `${Math.floor(right).toString()}px`;
        this.regionLeft = left === null ? "unset" : `${Math.floor(left).toString()}px`;
        this.currentHorizontalPosition = desiredHorizontalPosition;
        this.regionWidth = this.horizontalScaling
            ? `${Math.floor(nextPositionerDimension.width)}px`
            : "fit-content";
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
                bottom =
                    nextPositionerDimension.height +
                    this.anchorHeight -
                    this.baseVerticalOffset;
                break;

            case AnchoredRegionVerticalPositionLabel.insetTop:
                yTransformOrigin = Location.bottom;
                bottom = nextPositionerDimension.height - this.baseVerticalOffset;
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
        this.regionTop = top === null ? "unset" : `${Math.floor(top).toString()}px`;
        this.regionBottom =
            bottom === null ? "unset" : `${Math.floor(bottom).toString()}px`;
        this.currentVerticalPosition = desiredVerticalPosition;
        this.regionHeight = this.verticalScaling
            ? `${Math.floor(nextPositionerDimension.height)}px`
            : "fit-content";
    };

    /**
     *  Update the offset values
     */
    private updatePositionerOffset = (positionerRect: DOMRect | ClientRect): void => {
        if (this.horizontalPositioningMode === "uncontrolled") {
            this.baseHorizontalOffset = this.anchorLeft - positionerRect.left;
        } else {
            switch (this.currentHorizontalPosition) {
                case AnchoredRegionHorizontalPositionLabel.undefined:
                    this.baseHorizontalOffset = this.anchorLeft - positionerRect.left;
                    break;
                case AnchoredRegionHorizontalPositionLabel.left:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (this.anchorLeft - positionerRect.right);
                    break;
                case AnchoredRegionHorizontalPositionLabel.insetLeft:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (this.anchorRight - positionerRect.right);
                    break;
                case AnchoredRegionHorizontalPositionLabel.insetRight:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (this.anchorLeft - positionerRect.left);
                    break;
                case AnchoredRegionHorizontalPositionLabel.right:
                    this.baseHorizontalOffset =
                        this.baseHorizontalOffset +
                        (this.anchorRight - positionerRect.left);
                    break;
            }
        }

        if (this.verticalPositioningMode === "uncontrolled") {
            this.baseVerticalOffset = this.anchorBottom - positionerRect.top;
        } else {
            switch (this.currentVerticalPosition) {
                case AnchoredRegionVerticalPositionLabel.undefined:
                    this.baseVerticalOffset = this.anchorBottom - positionerRect.top;
                    break;
                case AnchoredRegionVerticalPositionLabel.top:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (this.anchorTop - positionerRect.bottom);
                    break;
                case AnchoredRegionVerticalPositionLabel.insetTop:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (this.anchorBottom - positionerRect.bottom);
                    break;
                case AnchoredRegionVerticalPositionLabel.insetBottom:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset + (this.anchorTop - positionerRect.top);
                    break;
                case AnchoredRegionVerticalPositionLabel.bottom:
                    this.baseVerticalOffset =
                        this.baseVerticalOffset +
                        (this.anchorBottom - positionerRect.top);
                    break;
            }
        }
    };

    /**
     * Check for scroll changes in viewport and adjust position data
     */
    private updateForScrolling = (): void => {
        if (isNil(this.viewportElement) || isNaN(this.viewportElement.scrollTop)) {
            return;
        }
        const scrollTop: number = this.viewportElement.scrollTop;
        const scrollLeft: number = this.viewportElement.scrollLeft;
        if (this.viewportScrollTop !== scrollTop) {
            const verticalScrollDelta: number = this.viewportScrollTop - scrollTop;
            this.viewportScrollTop = scrollTop;
            this.anchorTop = this.anchorTop + verticalScrollDelta;
            this.anchorBottom = this.anchorBottom + verticalScrollDelta;
        }
        if (this.viewportScrollLeft !== scrollLeft) {
            const horizontalScrollDelta: number = this.viewportScrollLeft - scrollLeft;
            this.viewportScrollLeft = scrollLeft;
            this.anchorLeft = this.anchorLeft + horizontalScrollDelta;
            this.anchorRight = this.anchorRight + horizontalScrollDelta;
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
        if (!isNil(this.viewportRect)) {
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
        if (!isNil(this.viewportRect)) {
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
        const newPositionerDimension: Dimension = {
            height: this.positionerDimension.height,
            width: this.positionerDimension.width,
        };

        if (this.horizontalScaling) {
            newPositionerDimension.width = this.getAvailableWidth(
                desiredHorizontalPosition
            );
        }

        if (this.verticalScaling) {
            newPositionerDimension.height = this.getAvailableHeight(
                desiredVerticalPosition
            );
        }

        return newPositionerDimension;
    };
}
