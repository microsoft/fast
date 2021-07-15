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
import { Direction, keyCodeEscape } from "@microsoft/fast-web-utilities";
import { getDirection } from "../utilities/";
import { FoundationElement } from "../foundation-element";
import { TooltipPosition } from "./tooltip.options";
export { TooltipPosition };
/**
 * An Tooltip Custom HTML Element.
 *
 * @public
 */
export class Tooltip extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The id of the element the tooltip is anchored to
         *
         * @defaultValue - undefined
         * @public
         * HTML Attribute: anchor
         */
        this.anchor = "";
        /**
         * The delay in milliseconds before a tooltip is shown after a hover event
         *
         * @defaultValue - 300
         * @public
         * HTML Attribute: delay
         */
        this.delay = 300;
        /**
         * the html element currently being used as anchor.
         * Setting this directly overrides the anchor attribute.
         *
         * @public
         */
        this.anchorElement = null;
        /**
         * The current viewport element instance
         *
         * @internal
         */
        this.viewportElement = null;
        /**
         * @internal
         */
        this.verticalPositioningMode = "dynamic";
        /**
         * @internal
         */
        this.horizontalPositioningMode = "dynamic";
        /**
         * @internal
         */
        this.horizontalInset = "true";
        /**
         * @internal
         */
        this.verticalInset = "false";
        /**
         * @internal
         */
        this.horizontalScaling = "anchor";
        /**
         * @internal
         */
        this.verticalScaling = "content";
        /**
         * @internal
         */
        this.verticalDefaultPosition = undefined;
        /**
         * @internal
         */
        this.horizontalDefaultPosition = undefined;
        /**
         * @internal
         */
        this.tooltipVisible = false;
        /**
         * Track current direction to pass to the anchored region
         * updated when tooltip is shown
         *
         * @internal
         */
        this.currentDirection = Direction.ltr;
        /**
         * The timer that tracks delay time before the tooltip is shown on hover
         */
        this.delayTimer = null;
        /**
         * Indicates whether the anchor is currently being hovered
         */
        this.isAnchorHovered = false;
        /**
         * invoked when the anchored region's position relative to the anchor changes
         *
         * @internal
         */
        this.handlePositionChange = ev => {
            this.classList.toggle("top", this.region.verticalPosition === "top");
            this.classList.toggle("bottom", this.region.verticalPosition === "bottom");
            this.classList.toggle(
                "inset-top",
                this.region.verticalPosition === "insetTop"
            );
            this.classList.toggle(
                "inset-bottom",
                this.region.verticalPosition === "insetBottom"
            );
            this.classList.toggle("left", this.region.horizontalPosition === "left");
            this.classList.toggle("right", this.region.horizontalPosition === "right");
            this.classList.toggle(
                "inset-left",
                this.region.horizontalPosition === "insetLeft"
            );
            this.classList.toggle(
                "inset-right",
                this.region.horizontalPosition === "insetRight"
            );
        };
        /**
         * mouse enters anchor
         */
        this.handleAnchorMouseOver = ev => {
            this.startHoverTimer();
        };
        /**
         * mouse leaves anchor
         */
        this.handleAnchorMouseOut = ev => {
            if (this.isAnchorHovered) {
                this.isAnchorHovered = false;
                this.updateTooltipVisibility();
            }
            this.clearDelayTimer();
        };
        /**
         * starts the hover timer if not currently running
         */
        this.startHoverTimer = () => {
            if (this.isAnchorHovered) {
                return;
            }
            if (this.delay > 1) {
                if (this.delayTimer === null)
                    this.delayTimer = window.setTimeout(() => {
                        this.startHover();
                    }, this.delay);
                return;
            }
            this.startHover();
        };
        /**
         * starts the hover delay timer
         */
        this.startHover = () => {
            this.isAnchorHovered = true;
            this.updateTooltipVisibility();
        };
        /**
         * clears the hover delay
         */
        this.clearDelayTimer = () => {
            if (this.delayTimer !== null) {
                clearTimeout(this.delayTimer);
                this.delayTimer = null;
            }
        };
        /**
         *  Gets the anchor element by id
         */
        this.getAnchor = () => {
            const rootNode = this.getRootNode();
            if (rootNode instanceof ShadowRoot) {
                return rootNode.getElementById(this.anchor);
            }
            return document.getElementById(this.anchor);
        };
        /**
         * handles key down events to check for dismiss
         */
        this.handleDocumentKeydown = e => {
            if (!e.defaultPrevented && this.tooltipVisible) {
                switch (e.keyCode) {
                    case keyCodeEscape:
                        this.isAnchorHovered = false;
                        this.updateTooltipVisibility();
                        this.$emit("dismiss");
                        break;
                }
            }
        };
        /**
         * determines whether to show or hide the tooltip based on current state
         */
        this.updateTooltipVisibility = () => {
            if (this.visible === false) {
                this.hideTooltip();
            } else if (this.visible === true) {
                this.showTooltip();
            } else {
                if (this.isAnchorHovered) {
                    this.showTooltip();
                    return;
                }
                this.hideTooltip();
            }
        };
        /**
         * shows the tooltip
         */
        this.showTooltip = () => {
            if (this.tooltipVisible) {
                return;
            }
            this.currentDirection = getDirection(this);
            this.tooltipVisible = true;
            document.addEventListener("keydown", this.handleDocumentKeydown);
            DOM.queueUpdate(this.setRegionProps);
        };
        /**
         * hides the tooltip
         */
        this.hideTooltip = () => {
            if (!this.tooltipVisible) {
                return;
            }
            if (this.region !== null && this.region !== undefined) {
                this.region.removeEventListener(
                    "positionchange",
                    this.handlePositionChange
                );
                this.region.viewportElement = null;
                this.region.anchorElement = null;
            }
            document.removeEventListener("keydown", this.handleDocumentKeydown);
            this.tooltipVisible = false;
        };
        /**
         * updates the tooltip anchored region props after it has been
         * added to the DOM
         */
        this.setRegionProps = () => {
            if (!this.tooltipVisible) {
                return;
            }
            this.viewportElement = document.body;
            this.region.viewportElement = this.viewportElement;
            this.region.anchorElement = this.anchorElement;
            this.region.addEventListener("positionchange", this.handlePositionChange);
        };
    }
    visibleChanged() {
        if (this.$fastController.isConnected) {
            this.updateTooltipVisibility();
            this.updateLayout();
        }
    }
    anchorChanged() {
        if (this.$fastController.isConnected) {
            this.updateLayout();
        }
    }
    positionChanged() {
        if (this.$fastController.isConnected) {
            this.updateLayout();
        }
    }
    anchorElementChanged(oldValue) {
        if (this.$fastController.isConnected) {
            if (oldValue !== null && oldValue !== undefined) {
                oldValue.removeEventListener("mouseover", this.handleAnchorMouseOver);
                oldValue.removeEventListener("mouseout", this.handleAnchorMouseOut);
            }
            if (this.anchorElement !== null && this.anchorElement !== undefined) {
                this.anchorElement.addEventListener(
                    "mouseover",
                    this.handleAnchorMouseOver,
                    { passive: true }
                );
                this.anchorElement.addEventListener(
                    "mouseout",
                    this.handleAnchorMouseOut,
                    { passive: true }
                );
                const anchorId = this.anchorElement.id;
                if (this.anchorElement.parentElement !== null) {
                    this.anchorElement.parentElement
                        .querySelectorAll(":hover")
                        .forEach(element => {
                            if (element.id === anchorId) {
                                this.startHoverTimer();
                            }
                        });
                }
            }
            if (
                this.region !== null &&
                this.region !== undefined &&
                this.tooltipVisible
            ) {
                this.region.anchorElement = this.anchorElement;
            }
            this.updateLayout();
        }
    }
    viewportElementChanged() {
        if (this.region !== null && this.region !== undefined) {
            this.region.viewportElement = this.viewportElement;
        }
        this.updateLayout();
    }
    connectedCallback() {
        super.connectedCallback();
        this.anchorElement = this.getAnchor();
        this.updateLayout();
        this.updateTooltipVisibility();
    }
    disconnectedCallback() {
        this.hideTooltip();
        this.clearDelayTimer();
        super.disconnectedCallback();
    }
    /**
     * updated the properties being passed to the anchored region
     */
    updateLayout() {
        switch (this.position) {
            case TooltipPosition.top:
            case TooltipPosition.bottom:
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = this.position;
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                this.horizontalScaling = "anchor";
                this.verticalScaling = "content";
                break;
            case TooltipPosition.right:
            case TooltipPosition.left:
            case TooltipPosition.start:
            case TooltipPosition.end:
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = this.position;
                this.horizontalInset = "false";
                this.verticalInset = "true";
                this.horizontalScaling = "content";
                this.verticalScaling = "anchor";
                break;
            default:
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                this.horizontalScaling = "anchor";
                this.verticalScaling = "content";
                break;
        }
    }
}
Tooltip.DirectionAttributeName = "dir";
__decorate([attr({ mode: "boolean" })], Tooltip.prototype, "visible", void 0);
__decorate([attr], Tooltip.prototype, "anchor", void 0);
__decorate([attr], Tooltip.prototype, "delay", void 0);
__decorate([attr], Tooltip.prototype, "position", void 0);
__decorate([observable], Tooltip.prototype, "anchorElement", void 0);
__decorate([observable], Tooltip.prototype, "viewportElement", void 0);
__decorate([observable], Tooltip.prototype, "verticalPositioningMode", void 0);
__decorate([observable], Tooltip.prototype, "horizontalPositioningMode", void 0);
__decorate([observable], Tooltip.prototype, "horizontalInset", void 0);
__decorate([observable], Tooltip.prototype, "verticalInset", void 0);
__decorate([observable], Tooltip.prototype, "horizontalScaling", void 0);
__decorate([observable], Tooltip.prototype, "verticalScaling", void 0);
__decorate([observable], Tooltip.prototype, "verticalDefaultPosition", void 0);
__decorate([observable], Tooltip.prototype, "horizontalDefaultPosition", void 0);
__decorate([observable], Tooltip.prototype, "tooltipVisible", void 0);
__decorate([observable], Tooltip.prototype, "currentDirection", void 0);
