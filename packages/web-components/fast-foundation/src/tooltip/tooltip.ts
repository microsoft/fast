import {
    attr,
    FASTElement,
    nullableNumberConverter,
    observable,
    Updates,
} from "@microsoft/fast-element";
import { Direction, keyEscape } from "@microsoft/fast-web-utilities";
import type { FASTAnchoredRegion } from "../anchored-region/anchored-region.js";
import type {
    AutoUpdateMode,
    AxisPositioningMode,
    AxisScalingMode,
} from "../anchored-region/anchored-region.options.js";
import { getDirection } from "../utilities/direction.js";
import { TooltipPosition } from "./tooltip.options.js";

export { TooltipPosition };

/**
 * An Tooltip Custom HTML Element.
 *
 * @slot - The default slot for the tooltip content
 * @csspart control - The tooltip element
 * @fires dismiss - Fires a custom 'dismiss' event when the tooltip is visible and escape key is pressed
 *
 * @public
 */
export class FASTTooltip extends FASTElement {
    /**
     * Whether the tooltip is visible or not.
     * If undefined tooltip is shown when anchor element is hovered
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: visible
     */
    @attr({ mode: "boolean" })
    public visible: boolean;
    protected visibleChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateTooltipVisibility();
            this.updateLayout();
        }
    }

    /**
     * The id of the element the tooltip is anchored to
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: anchor
     */
    @attr
    public anchor: string = "";
    protected anchorChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.anchorElement = this.getAnchor();
        }
    }

    /**
     * The delay in milliseconds before a tooltip is shown after a hover event
     *
     * @defaultValue - 300
     * @public
     * HTML Attribute: delay
     */
    @attr({ attribute: "delay", converter: nullableNumberConverter })
    public delay: number = 300;

    /**
     * Controls the placement of the tooltip relative to the anchor.
     * When the position is undefined the tooltip is placed above or below the anchor based on available space.
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: position
     */
    @attr
    public position: TooltipPosition;
    private positionChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateLayout();
        }
    }

    /**
     * Controls when the tooltip updates its position, default is 'anchor' which only updates when
     * the anchor is resized.  'auto' will update on scroll/resize events.
     * Corresponds to anchored-region auto-update-mode.
     * @public
     * @remarks
     * HTML Attribute: auto-update-mode
     */
    @attr({ attribute: "auto-update-mode" })
    public autoUpdateMode: AutoUpdateMode = "anchor";

    /**
     * Controls if the tooltip will always remain fully in the viewport on the horizontal axis
     * @public
     * @remarks
     * HTML Attribute: horizontal-viewport-lock
     */
    @attr({ attribute: "horizontal-viewport-lock" })
    public horizontalViewportLock: boolean;

    /**
     * Controls if the tooltip will always remain fully in the viewport on the vertical axis
     * @public
     * @remarks
     * HTML Attribute: vertical-viewport-lock
     */
    @attr({ attribute: "vertical-viewport-lock" })
    public verticalViewportLock: boolean;

    /**
     * the html element currently being used as anchor.
     * Setting this directly overrides the anchor attribute.
     *
     * @public
     */
    @observable
    public anchorElement: HTMLElement | null = null;
    protected anchorElementChanged(oldValue: HTMLElement | null): void {
        if ((this as FASTElement).$fastController.isConnected) {
            if (oldValue !== null && oldValue !== undefined) {
                oldValue.removeEventListener("mouseover", this.handleAnchorMouseOver);
                oldValue.removeEventListener("mouseout", this.handleAnchorMouseOut);
                oldValue.removeEventListener("focusin", this.handleAnchorFocusIn);
                oldValue.removeEventListener("focusout", this.handleAnchorFocusOut);
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
                this.anchorElement.addEventListener("focusin", this.handleAnchorFocusIn, {
                    passive: true,
                });
                this.anchorElement.addEventListener(
                    "focusout",
                    this.handleAnchorFocusOut,
                    { passive: true }
                );

                const anchorId: string = this.anchorElement.id;

                if (this.anchorElement.parentElement !== null) {
                    this.anchorElement.parentElement
                        .querySelectorAll(":hover")
                        .forEach(element => {
                            if (element.id === anchorId) {
                                this.startShowDelayTimer();
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

    /**
     * The current viewport element instance
     *
     * @internal
     */
    @observable
    public viewportElement: HTMLElement | null = null;
    protected viewportElementChanged(): void {
        if (this.region !== null && this.region !== undefined) {
            this.region.viewportElement = this.viewportElement;
        }
        this.updateLayout();
    }

    /**
     * @internal
     * @defaultValue "dynamic"
     */
    @observable
    public verticalPositioningMode: AxisPositioningMode = "dynamic";

    /**
     * @internal
     * @defaultValue "dynamic"
     */
    @observable
    public horizontalPositioningMode: AxisPositioningMode = "dynamic";

    /**
     * @internal
     */
    @observable
    public horizontalInset: string = "false";

    /**
     * @internal
     */
    @observable
    public verticalInset: string = "false";

    /**
     * @internal
     */
    @observable
    public horizontalScaling: AxisScalingMode = "content";

    /**
     * @internal
     */
    @observable
    public verticalScaling: AxisScalingMode = "content";

    /**
     * @internal
     */
    @observable
    public verticalDefaultPosition: string | undefined = undefined;

    /**
     * @internal
     */
    @observable
    public horizontalDefaultPosition: string | undefined = undefined;

    /**
     * @internal
     */
    @observable
    public tooltipVisible: boolean = false;

    /**
     * Track current direction to pass to the anchored region
     * updated when tooltip is shown
     *
     * @internal
     */
    @observable
    public currentDirection: Direction = Direction.ltr;

    /**
     * reference to the anchored region
     *
     * @internal
     */
    public region: FASTAnchoredRegion;

    /**
     * The timer that tracks delay time before the tooltip is shown on hover
     */
    private showDelayTimer: number | null = null;

    /**
     * The timer that tracks delay time before the tooltip is hidden
     */
    private hideDelayTimer: number | null = null;

    /**
     * Indicates whether the anchor is currently being hovered or has focus
     */
    private isAnchorHoveredFocused: boolean = false;

    /**
     * Indicates whether the region is currently being hovered
     */
    private isRegionHovered: boolean = false;

    public connectedCallback(): void {
        super.connectedCallback();
        this.anchorElement = this.getAnchor();
        this.updateTooltipVisibility();
    }

    public disconnectedCallback(): void {
        this.hideTooltip();
        this.clearShowDelayTimer();
        this.clearHideDelayTimer();
        super.disconnectedCallback();
    }

    /**
     * invoked when the anchored region's position relative to the anchor changes
     *
     * @internal
     */
    public handlePositionChange = (ev: Event): void => {
        this.classList.toggle("top", this.region.verticalPosition === "start");
        this.classList.toggle("bottom", this.region.verticalPosition === "end");
        this.classList.toggle("inset-top", this.region.verticalPosition === "insetStart");
        this.classList.toggle(
            "inset-bottom",
            this.region.verticalPosition === "insetEnd"
        );
        this.classList.toggle(
            "center-vertical",
            this.region.verticalPosition === "center"
        );

        this.classList.toggle("left", this.region.horizontalPosition === "start");
        this.classList.toggle("right", this.region.horizontalPosition === "end");
        this.classList.toggle(
            "inset-left",
            this.region.horizontalPosition === "insetStart"
        );
        this.classList.toggle(
            "inset-right",
            this.region.horizontalPosition === "insetEnd"
        );
        this.classList.toggle(
            "center-horizontal",
            this.region.horizontalPosition === "center"
        );
    };

    /**
     * mouse enters region
     */
    private handleRegionMouseOver = (ev: Event): void => {
        this.isRegionHovered = true;
    };

    /**
     * mouse leaves region
     */
    private handleRegionMouseOut = (ev: Event): void => {
        this.isRegionHovered = false;
        this.startHideDelayTimer();
    };

    /**
     * mouse enters anchor
     */
    private handleAnchorMouseOver = (ev: Event): void => {
        if (this.tooltipVisible) {
            // tooltip is already visible, just set the anchor hover flag
            this.isAnchorHoveredFocused = true;
            return;
        }
        this.startShowDelayTimer();
    };

    /**
     * mouse leaves anchor
     */
    private handleAnchorMouseOut = (ev: Event): void => {
        this.isAnchorHoveredFocused = false;
        this.clearShowDelayTimer();
        this.startHideDelayTimer();
    };

    /**
     * anchor gets focus
     */
    private handleAnchorFocusIn = (ev: Event): void => {
        this.startShowDelayTimer();
    };

    /**
     * anchor loses focus
     */
    private handleAnchorFocusOut = (ev: Event): void => {
        this.isAnchorHoveredFocused = false;
        this.clearShowDelayTimer();
        this.startHideDelayTimer();
    };

    /**
     * starts the hide timer
     */
    private startHideDelayTimer = (): void => {
        this.clearHideDelayTimer();

        if (!this.tooltipVisible) {
            return;
        }

        // allow 60 ms for account for pointer to move between anchor/tooltip
        // without hiding tooltip
        this.hideDelayTimer = window.setTimeout((): void => {
            this.updateTooltipVisibility();
        }, 60);
    };

    /**
     * clears the hide delay
     */
    private clearHideDelayTimer = (): void => {
        if (this.hideDelayTimer !== null) {
            clearTimeout(this.hideDelayTimer);
            this.hideDelayTimer = null;
        }
    };

    /**
     * starts the show timer if not currently running
     */
    private startShowDelayTimer = (): void => {
        if (this.isAnchorHoveredFocused) {
            return;
        }

        if (this.delay > 1) {
            if (this.showDelayTimer === null)
                this.showDelayTimer = window.setTimeout((): void => {
                    this.startHover();
                }, this.delay);
            return;
        }

        this.startHover();
    };

    /**
     * start hover
     */
    private startHover = (): void => {
        this.isAnchorHoveredFocused = true;
        this.updateTooltipVisibility();
    };

    /**
     * clears the show delay
     */
    private clearShowDelayTimer = (): void => {
        if (this.showDelayTimer !== null) {
            clearTimeout(this.showDelayTimer);
            this.showDelayTimer = null;
        }
    };

    /**
     * updated the properties being passed to the anchored region
     */
    private updateLayout(): void {
        this.verticalPositioningMode = "locktodefault";
        this.horizontalPositioningMode = "locktodefault";

        switch (this.position) {
            case TooltipPosition.top:
            case TooltipPosition.bottom:
                this.verticalDefaultPosition = this.position;
                this.horizontalDefaultPosition = "center";
                break;

            case TooltipPosition.right:
            case TooltipPosition.left:
            case TooltipPosition.start:
            case TooltipPosition.end:
                this.verticalDefaultPosition = "center";
                this.horizontalDefaultPosition = this.position;
                break;

            case TooltipPosition.center:
                this.verticalDefaultPosition = "center";
                this.horizontalDefaultPosition = "center";
                break;

            case TooltipPosition.topLeft:
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "left";
                break;

            case TooltipPosition.topCenter:
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "center";
                break;

            case TooltipPosition.bottomCenter:
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "center";
                break;

            case TooltipPosition.topRight:
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "right";
                break;

            case TooltipPosition.bottomLeft:
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "left";
                break;

            case TooltipPosition.bottomRight:
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "right";
                break;

            case TooltipPosition.topStart:
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "start";
                break;

            case TooltipPosition.topEnd:
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "end";
                break;

            case TooltipPosition.bottomStart:
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "start";
                break;

            case TooltipPosition.bottomEnd:
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "end";
                break;

            default:
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = void 0;
                this.horizontalDefaultPosition = "center";
                break;
        }
    }

    /**
     *  Gets the anchor element by id
     */
    private getAnchor = (): HTMLElement | null => {
        const rootNode = this.getRootNode();

        if (rootNode instanceof ShadowRoot) {
            return rootNode.getElementById(this.anchor);
        }

        return document.getElementById(this.anchor);
    };

    /**
     * handles key down events to check for dismiss
     */
    private handleDocumentKeydown = (e: KeyboardEvent): void => {
        if (!e.defaultPrevented && this.tooltipVisible) {
            switch (e.key) {
                case keyEscape:
                    this.isAnchorHoveredFocused = false;
                    this.updateTooltipVisibility();
                    this.$emit("dismiss");
                    break;
            }
        }
    };

    /**
     * determines whether to show or hide the tooltip based on current state
     */
    private updateTooltipVisibility = (): void => {
        if (this.visible === false) {
            this.hideTooltip();
        } else if (this.visible === true) {
            this.showTooltip();
            return;
        } else {
            if (this.isAnchorHoveredFocused || this.isRegionHovered) {
                this.showTooltip();
                return;
            }
            this.hideTooltip();
        }
    };

    /**
     * shows the tooltip
     */
    private showTooltip = (): void => {
        if (this.tooltipVisible) {
            return;
        }
        this.currentDirection = getDirection(this);
        this.tooltipVisible = true;
        document.addEventListener("keydown", this.handleDocumentKeydown);
        Updates.enqueue(this.setRegionProps);
    };

    /**
     * hides the tooltip
     */
    private hideTooltip = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        this.clearHideDelayTimer();
        if (this.region !== null && this.region !== undefined) {
            (this.region as any).removeEventListener(
                "positionchange",
                this.handlePositionChange
            );
            this.region.viewportElement = null;
            this.region.anchorElement = null;

            this.region.removeEventListener("mouseover", this.handleRegionMouseOver);
            this.region.removeEventListener("mouseout", this.handleRegionMouseOut);
        }
        document.removeEventListener("keydown", this.handleDocumentKeydown);
        this.tooltipVisible = false;
    };

    /**
     * updates the tooltip anchored region props after it has been
     * added to the DOM
     */
    private setRegionProps = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        this.region.viewportElement = this.viewportElement;
        this.region.anchorElement = this.anchorElement;
        (this.region as any).addEventListener(
            "positionchange",
            this.handlePositionChange
        );

        this.region.addEventListener("mouseover", this.handleRegionMouseOver, {
            passive: true,
        });
        this.region.addEventListener("mouseout", this.handleRegionMouseOut, {
            passive: true,
        });
    };
}
