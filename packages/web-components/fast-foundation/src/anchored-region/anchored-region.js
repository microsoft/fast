var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { attr, DOM, observable } from "@microsoft/fast-element";
import { Direction, eventResize, eventScroll } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
import { getDirection } from "../utilities";
import { IntersectionService } from "./intersection-service";
/**
 * An anchored region Custom HTML Element.
 *
 * @beta
 */
export class AnchoredRegion extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The HTML ID of the anchor element this region is positioned relative to
         *
         * @beta
         * @remarks
         * HTML Attribute: anchor
         */
        this.anchor = "";
        /**
         * The HTML ID of the viewport element this region is positioned relative to
         *
         * @beta
         * @remarks
         * HTML Attribute: anchor
         */
        this.viewport = "";
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
        this.horizontalPositioningMode = "uncontrolled";
        /**
         * The default horizontal position of the region relative to the anchor element
         *
         * @beta
         * @remarks
         * HTML Attribute: horizontal-default-position
         */
        this.horizontalDefaultPosition = "unset";
        /**
         * Whether the region overlaps the anchor on the horizontal axis
         *
         * @beta
         * @remarks
         * HTML Attribute: horizontal-inset
         */
        this.horizontalInset = false;
        /**
         * Defines how the width of the region is calculated
         *
         * @beta
         * @remarks
         * HTML Attribute: horizontal-scaling
         */
        this.horizontalScaling = "content";
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
        this.verticalPositioningMode = "uncontrolled";
        /**
         * The default vertical position of the region relative to the anchor element
         *
         * @beta
         * @remarks
         * HTML Attribute: vertical-default-position
         */
        this.verticalDefaultPosition = "unset";
        /**
         * Whether the region overlaps the anchor on the vertical axis
         *
         * @beta
         * @remarks
         * HTML Attribute: vertical-inset
         */
        this.verticalInset = false;
        /**
         * Defines how the height of the region is calculated
         *
         * @beta
         * @remarks
         * HTML Attribute: vertical-scaling
         */
        this.verticalScaling = "content";
        /**
         * Whether the region is positioned using css "position: fixed".
         * Otherwise the region uses "position: absolute".
         * Fixed placement allows the region to break out of parent containers,
         *
         * @beta
         * @remarks
         * HTML Attribute: fixed-placement
         */
        this.fixedPlacement = false;
        /**
         *
         *
         * @beta
         * @remarks
         * HTML Attribute: auto-update-mode
         */
        this.autoUpdateMode = "anchor";
        /**
         * The HTML element being used as the anchor
         *
         * @beta
         */
        this.anchorElement = null;
        /**
         * The HTML element being used as the viewport
         *
         * @beta
         */
        this.viewportElement = null;
        /**
         * indicates that an initial positioning pass on layout has completed
         *
         * @internal
         */
        this.initialLayoutComplete = false;
        this.resizeDetector = null;
        this.pendingPositioningUpdate = false;
        this.pendingLayoutUpdate = false;
        this.pendingReset = false;
        this.currentDirection = Direction.ltr;
        this.regionVisible = false;
        // defines how big a difference in pixels there must be between states to
        // justify a layout update that affects the dom (prevents repeated sub-pixel corrections)
        this.updateThreshold = 0.5;
        /**
         * update position
         */
        this.update = () => {
            if (this.viewportRect === null || this.regionDimension === null) {
                this.requestLayoutUpdate();
                return;
            }
            this.requestPositionUpdates();
        };
        /**
         * Public function to enable authors to update the layout based on changes in anchor offset without resorting
         * to a more epensive update call
         */
        this.updateAnchorOffset = (horizontalOffsetDelta, verticalOffsetDelta) => {
            this.anchorLeft = this.anchorLeft + horizontalOffsetDelta;
            this.anchorRight = this.anchorRight + horizontalOffsetDelta;
            this.anchorTop = this.anchorTop + verticalOffsetDelta;
            this.anchorBottom = this.anchorBottom + verticalOffsetDelta;
            this.updateLayout();
        };
        /**
         * starts observers
         */
        this.startObservers = () => {
            this.stopObservers();
            if (this.anchorElement === null) {
                return;
            }
            this.requestPositionUpdates();
            if (this.resizeDetector !== null) {
                this.resizeDetector.observe(this.anchorElement);
            }
        };
        /**
         * get position updates
         */
        this.requestPositionUpdates = () => {
            if (this.anchorElement === null || this.pendingPositioningUpdate) {
                return;
            }
            AnchoredRegion.intersectionService.requestPosition(
                this,
                this.handleIntersection
            );
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
        this.stopObservers = () => {
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
        this.getViewport = () => {
            if (typeof this.viewport !== "string" || this.viewport === "") {
                return document.documentElement;
            }
            return document.getElementById(this.viewport);
        };
        /**
         *  Gets the anchor element by id
         */
        this.getAnchor = () => {
            return document.getElementById(this.anchor);
        };
        /**
         *  Handle intersections
         */
        this.handleIntersection = entries => {
            if (!this.pendingPositioningUpdate) {
                return;
            }
            this.pendingPositioningUpdate = false;
            if (!this.applyIntersectionEntries(entries) || this.regionRect === null) {
                return;
            }
            if (!this.initialLayoutComplete) {
                this.containingBlockHeight = this.regionRect.height;
                this.containingBlockWidth = this.regionRect.width;
            }
            this.updateRegionOffset(this.regionRect);
            this.updateLayout();
        };
        /**
         *  iterate through intersection entries and apply data
         */
        this.applyIntersectionEntries = entries => {
            const regionEntry = entries.find(x => x.target === this);
            const anchorEntry = entries.find(x => x.target === this.anchorElement);
            const viewportEntry = entries.find(x => x.target === this.viewportElement);
            if (
                regionEntry === undefined ||
                viewportEntry === undefined ||
                anchorEntry === undefined
            ) {
                return false;
            }
            // don't update the dom unless there is a significant difference in rect positions
            if (
                this.regionRect === null ||
                this.anchorRect === null ||
                this.viewportRect === null ||
                this.isRectDifferent(this.anchorRect, anchorEntry.boundingClientRect) ||
                this.isRectDifferent(
                    this.viewportRect,
                    viewportEntry.boundingClientRect
                ) ||
                this.isRectDifferent(this.regionRect, regionEntry.boundingClientRect)
            ) {
                this.regionRect = regionEntry.boundingClientRect;
                this.anchorRect = anchorEntry.boundingClientRect;
                this.viewportRect = viewportEntry.boundingClientRect;
                this.handleRegionIntersection(regionEntry);
                this.handleAnchorIntersection(anchorEntry);
                return true;
            }
            return false;
        };
        /**
         *  compare rects to see if there is enough change to justify a DOM update
         */
        this.isRectDifferent = (rectA, rectB) => {
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
         *  Update data based on anchor intersections
         */
        this.handleAnchorIntersection = anchorEntry => {
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
        this.handleRegionIntersection = regionEntry => {
            const regionRect = regionEntry.boundingClientRect;
            this.regionDimension = {
                height: regionRect.height,
                width: regionRect.width,
            };
        };
        /**
         *  Handle resize events
         */
        this.handleResize = entries => {
            if (!this.initialLayoutComplete) {
                return;
            }
            this.update();
        };
        /**
         * resets the component
         */
        this.reset = () => {
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
        this.updateLayout = () => {
            this.pendingLayoutUpdate = false;
            let desiredVerticalPosition = "undefined";
            let desiredHorizontalPosition = "undefined";
            if (this.horizontalPositioningMode !== "uncontrolled") {
                const horizontalOptions = this.getHorizontalPositioningOptions();
                if (this.horizontalDefaultPosition !== "unset") {
                    let dirCorrectedHorizontalDefaultPosition = this
                        .horizontalDefaultPosition;
                    if (
                        dirCorrectedHorizontalDefaultPosition === "start" ||
                        dirCorrectedHorizontalDefaultPosition === "end"
                    ) {
                        // if direction changes we reset the layout
                        const newDirection = getDirection(this);
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
                const horizontalThreshold =
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
                const verticalOptions = this.getVerticalPositioningOptions();
                if (this.verticalDefaultPosition !== "unset") {
                    switch (this.verticalDefaultPosition) {
                        case "top":
                            desiredVerticalPosition = this.verticalInset
                                ? "insetTop"
                                : "top";
                            break;
                        case "bottom":
                            desiredVerticalPosition = this.verticalInset
                                ? "insetBottom"
                                : "bottom";
                            break;
                    }
                }
                const verticalThreshold =
                    this.verticalThreshold !== undefined
                        ? this.verticalThreshold
                        : this.regionDimension.height;
                if (
                    desiredVerticalPosition === "undefined" ||
                    (!(this.verticalPositioningMode === "locktodefault") &&
                        this.getAvailableHeight(desiredVerticalPosition) <
                            verticalThreshold)
                ) {
                    desiredVerticalPosition =
                        this.getAvailableHeight(verticalOptions[0]) >
                        this.getAvailableHeight(verticalOptions[1])
                            ? verticalOptions[0]
                            : verticalOptions[1];
                }
            }
            const nextPositionerDimension = this.getNextRegionDimension(
                desiredHorizontalPosition,
                desiredVerticalPosition
            );
            const positionChanged =
                this.horizontalPosition !== desiredHorizontalPosition ||
                this.verticalPosition !== desiredVerticalPosition;
            this.setHorizontalPosition(
                desiredHorizontalPosition,
                nextPositionerDimension
            );
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
        this.updateRegionStyle = () => {
            this.classList.toggle("top", this.verticalPosition === "top");
            this.classList.toggle("bottom", this.verticalPosition === "bottom");
            this.classList.toggle("inset-top", this.verticalPosition === "insetTop");
            this.classList.toggle(
                "inset-bottom",
                this.verticalPosition === "insetBottom"
            );
            this.classList.toggle("left", this.horizontalPosition === "left");
            this.classList.toggle("right", this.horizontalPosition === "right");
            this.classList.toggle("inset-left", this.horizontalPosition === "insetLeft");
            this.classList.toggle(
                "inset-right",
                this.horizontalPosition === "insetRight"
            );
            this.style.position = this.fixedPlacement ? "fixed" : "absolute";
            this.style.transformOrigin = `${this.yTransformOrigin} ${this.xTransformOrigin}`;
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
        this.setHorizontalPosition = (
            desiredHorizontalPosition,
            nextPositionerDimension
        ) => {
            let right = null;
            let left = null;
            let xTransformOrigin = "left";
            switch (desiredHorizontalPosition) {
                case "left":
                    xTransformOrigin = "right";
                    right = this.containingBlockWidth - this.baseHorizontalOffset;
                    break;
                case "insetLeft":
                    xTransformOrigin = "right";
                    right =
                        this.containingBlockWidth -
                        this.anchorWidth -
                        this.baseHorizontalOffset;
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
                    this.regionWidth = "unset";
                    break;
            }
        };
        /**
         * Get vertical positioning state based on desired position
         */
        this.setVerticalPosition = (desiredVerticalPosition, nextPositionerDimension) => {
            let top = null;
            let bottom = null;
            let yTransformOrigin = "top";
            switch (desiredVerticalPosition) {
                case "top":
                    yTransformOrigin = "bottom";
                    bottom = this.containingBlockHeight - this.baseVerticalOffset;
                    break;
                case "insetTop":
                    yTransformOrigin = "bottom";
                    bottom =
                        this.containingBlockHeight -
                        this.baseVerticalOffset -
                        this.anchorHeight;
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
                    this.regionHeight = "unset";
                    break;
            }
        };
        /**
         *  Update the offset values
         */
        this.updateRegionOffset = regionRect => {
            if (this.horizontalPositioningMode === "uncontrolled") {
                this.baseHorizontalOffset = this.anchorLeft - regionRect.left;
            } else {
                switch (this.horizontalPosition) {
                    case "undefined":
                        this.baseHorizontalOffset = this.anchorLeft - regionRect.left;
                        break;
                    case "left":
                        this.baseHorizontalOffset =
                            this.baseHorizontalOffset +
                            (this.anchorLeft - regionRect.right);
                        break;
                    case "insetLeft":
                        this.baseHorizontalOffset =
                            this.baseHorizontalOffset +
                            (this.anchorRight - regionRect.right);
                        break;
                    case "insetRight":
                        this.baseHorizontalOffset =
                            this.baseHorizontalOffset +
                            (this.anchorLeft - regionRect.left);
                        break;
                    case "right":
                        this.baseHorizontalOffset =
                            this.baseHorizontalOffset +
                            (this.anchorRight - regionRect.left);
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
                            this.baseVerticalOffset +
                            (this.anchorTop - regionRect.bottom);
                        break;
                    case "insetTop":
                        this.baseVerticalOffset =
                            this.baseVerticalOffset +
                            (this.anchorBottom - regionRect.bottom);
                        break;
                    case "insetBottom":
                        this.baseVerticalOffset =
                            this.baseVerticalOffset + (this.anchorTop - regionRect.top);
                        break;
                    case "bottom":
                        this.baseVerticalOffset =
                            this.baseVerticalOffset +
                            (this.anchorBottom - regionRect.top);
                        break;
                }
            }
        };
        /**
         *  Get available Horizontal positions based on positioning mode
         */
        this.getHorizontalPositioningOptions = () => {
            if (this.horizontalInset) {
                return ["insetLeft", "insetRight"];
            }
            return ["left", "right"];
        };
        /**
         * Get available Vertical positions based on positioning mode
         */
        this.getVerticalPositioningOptions = () => {
            if (this.verticalInset) {
                return ["insetTop", "insetBottom"];
            }
            return ["top", "bottom"];
        };
        /**
         *  Get the width available for a particular horizontal position
         */
        this.getAvailableWidth = positionOption => {
            if (this.viewportRect !== null) {
                const spaceLeft = this.anchorLeft - this.viewportRect.left;
                const spaceRight =
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
        this.getAvailableHeight = positionOption => {
            if (this.viewportRect !== null) {
                const spaceAbove = this.anchorTop - this.viewportRect.top;
                const spaceBelow =
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
        this.getNextRegionDimension = (
            desiredHorizontalPosition,
            desiredVerticalPosition
        ) => {
            const newRegionDimension = {
                height: this.regionDimension.height,
                width: this.regionDimension.width,
            };
            if (this.horizontalScaling === "fill") {
                newRegionDimension.width = this.getAvailableWidth(
                    desiredHorizontalPosition
                );
            }
            if (this.verticalScaling === "fill") {
                newRegionDimension.height = this.getAvailableHeight(
                    desiredVerticalPosition
                );
            }
            return newRegionDimension;
        };
        /**
         * starts event listeners that can trigger auto updating
         */
        this.startAutoUpdateEventListeners = () => {
            window.addEventListener(eventResize, this.update);
            window.addEventListener(eventScroll, this.update, true);
            if (this.resizeDetector !== null && this.viewportElement !== null) {
                this.resizeDetector.observe(this.viewportElement);
            }
        };
        /**
         * stops event listeners that can trigger auto updating
         */
        this.stopAutoUpdateEventListeners = () => {
            window.removeEventListener(eventResize, this.update);
            window.removeEventListener(eventScroll, this.update);
            if (this.resizeDetector !== null && this.viewportElement !== null) {
                this.resizeDetector.unobserve(this.viewportElement);
            }
        };
    }
    anchorChanged() {
        if (this.initialLayoutComplete) {
            this.anchorElement = this.getAnchor();
        }
    }
    viewportChanged() {
        if (this.initialLayoutComplete) {
            this.viewportElement = this.getViewport();
        }
    }
    horizontalPositioningModeChanged() {
        this.requestReset();
    }
    horizontalDefaultPositionChanged() {
        this.updateForAttributeChange();
    }
    horizontalInsetChanged() {
        this.updateForAttributeChange();
    }
    horizontalThresholdChanged() {
        this.updateForAttributeChange();
    }
    horizontalScalingChanged() {
        this.updateForAttributeChange();
    }
    verticalPositioningModeChanged() {
        this.requestReset();
    }
    verticalDefaultPositionChanged() {
        this.updateForAttributeChange();
    }
    verticalInsetChanged() {
        this.updateForAttributeChange();
    }
    verticalThresholdChanged() {
        this.updateForAttributeChange();
    }
    verticalScalingChanged() {
        this.updateForAttributeChange();
    }
    fixedPlacementChanged() {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.initialize();
        }
    }
    autoUpdateModeChanged(prevMode, newMode) {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            if (prevMode === "auto") {
                this.stopAutoUpdateEventListeners();
            }
            if (newMode === "auto") {
                this.startAutoUpdateEventListeners();
            }
        }
    }
    anchorElementChanged() {
        this.requestReset();
    }
    viewportElementChanged() {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.initialize();
        }
    }
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
    disconnectedCallback() {
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
    adoptedCallback() {
        this.initialize();
    }
    /**
     * destroys the instance's resize observer
     */
    disconnectResizeDetector() {
        if (this.resizeDetector !== null) {
            this.resizeDetector.disconnect();
            this.resizeDetector = null;
        }
    }
    /**
     * initializes the instance's resize observer
     */
    initializeResizeDetector() {
        this.disconnectResizeDetector();
        this.resizeDetector = new window.ResizeObserver(this.handleResize);
    }
    /**
     * react to attribute changes that don't require a reset
     */
    updateForAttributeChange() {
        if (this.$fastController.isConnected && this.initialLayoutComplete) {
            this.update();
        }
    }
    /**
     * fully initializes the component
     */
    initialize() {
        this.initializeResizeDetector();
        if (this.anchorElement === null) {
            this.anchorElement = this.getAnchor();
        }
        this.requestReset();
    }
    /**
     * Request a layout update if there are currently no open requests
     */
    requestLayoutUpdate() {
        if (this.pendingLayoutUpdate === false && this.pendingReset === false) {
            this.pendingLayoutUpdate = true;
            DOM.queueUpdate(() => this.updateLayout());
        }
    }
    /**
     * Request a reset if there are currently no open requests
     */
    requestReset() {
        if (this.$fastController.isConnected && this.pendingReset === false) {
            this.pendingLayoutUpdate = false;
            this.setInitialState();
            DOM.queueUpdate(() => this.reset());
            this.pendingReset = true;
        }
    }
    /**
     * sets the starting configuration for component internal values
     */
    setInitialState() {
        this.initialLayoutComplete = false;
        this.regionVisible = false;
        this.regionTop = "0";
        this.regionRight = "0";
        this.regionBottom = "0";
        this.regionLeft = "0";
        this.regionWidth = "100%";
        this.regionHeight = "100%";
        this.xTransformOrigin = "left";
        this.yTransformOrigin = "top";
        this.viewportRect = null;
        this.regionRect = null;
        this.anchorRect = null;
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
        this.style.opacity = "0";
        this.style.pointerEvents = "none";
        this.updateRegionStyle();
    }
}
AnchoredRegion.intersectionService = new IntersectionService();
__decorate([attr], AnchoredRegion.prototype, "anchor", void 0);
__decorate([attr], AnchoredRegion.prototype, "viewport", void 0);
__decorate(
    [attr({ attribute: "horizontal-positioning-mode" })],
    AnchoredRegion.prototype,
    "horizontalPositioningMode",
    void 0
);
__decorate(
    [attr({ attribute: "horizontal-default-position" })],
    AnchoredRegion.prototype,
    "horizontalDefaultPosition",
    void 0
);
__decorate(
    [attr({ attribute: "horizontal-inset", mode: "boolean" })],
    AnchoredRegion.prototype,
    "horizontalInset",
    void 0
);
__decorate(
    [attr({ attribute: "horizontal-threshold" })],
    AnchoredRegion.prototype,
    "horizontalThreshold",
    void 0
);
__decorate(
    [attr({ attribute: "horizontal-scaling" })],
    AnchoredRegion.prototype,
    "horizontalScaling",
    void 0
);
__decorate(
    [attr({ attribute: "vertical-positioning-mode" })],
    AnchoredRegion.prototype,
    "verticalPositioningMode",
    void 0
);
__decorate(
    [attr({ attribute: "vertical-default-position" })],
    AnchoredRegion.prototype,
    "verticalDefaultPosition",
    void 0
);
__decorate(
    [attr({ attribute: "vertical-inset", mode: "boolean" })],
    AnchoredRegion.prototype,
    "verticalInset",
    void 0
);
__decorate(
    [attr({ attribute: "vertical-threshold" })],
    AnchoredRegion.prototype,
    "verticalThreshold",
    void 0
);
__decorate(
    [attr({ attribute: "vertical-scaling" })],
    AnchoredRegion.prototype,
    "verticalScaling",
    void 0
);
__decorate(
    [attr({ attribute: "fixed-placement", mode: "boolean" })],
    AnchoredRegion.prototype,
    "fixedPlacement",
    void 0
);
__decorate(
    [attr({ attribute: "auto-update-mode" })],
    AnchoredRegion.prototype,
    "autoUpdateMode",
    void 0
);
__decorate([observable], AnchoredRegion.prototype, "anchorElement", void 0);
__decorate([observable], AnchoredRegion.prototype, "viewportElement", void 0);
__decorate([observable], AnchoredRegion.prototype, "initialLayoutComplete", void 0);
