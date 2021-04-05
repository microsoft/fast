import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Direction, keyCodeEscape } from "@microsoft/fast-web-utilities";
import type {
    AnchoredRegion,
    AxisPositioningMode,
    AxisScalingMode,
} from "../anchored-region";
import { getDirection } from "../utilities/";
import { TooltipPosition } from "./tooltip.options";

export { TooltipPosition };

/**
 * An Tooltip Custom HTML Element.
 *
 * @public
 */
export class Tooltip extends FASTElement {
    private static DirectionAttributeName: string = "dir";

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
    private visibleChanged(): void {
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
    private anchorChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateLayout();
        }
    }

    /**
     * The delay in milliseconds before a tooltip is shown after a hover event
     *
     * @defaultValue - 300
     * @public
     * HTML Attribute: delay
     */
    @attr
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
     * the html element currently being used as anchor.
     * Setting this directly overrides the anchor attribute.
     *
     * @public
     */
    @observable
    public anchorElement: HTMLElement | null = null;
    private anchorElementChanged(oldValue: HTMLElement | null): void {
        if ((this as FASTElement).$fastController.isConnected) {
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

                const anchorId: string = this.anchorElement.id;

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

    /**
     * The current viewport element instance
     *
     * @internal
     */
    @observable
    public viewportElement: HTMLElement | null = null;
    private viewportElementChanged(): void {
        if (this.region !== null && this.region !== undefined) {
            this.region.viewportElement = this.viewportElement;
        }
        this.updateLayout();
    }

    /**
     * @internal
     */
    @observable
    public verticalPositioningMode: AxisPositioningMode = "dynamic";

    /**
     * @internal
     */
    @observable
    public horizontalPositioningMode: AxisPositioningMode = "dynamic";

    /**
     * @internal
     */
    @observable
    public horizontalInset: string = "true";

    /**
     * @internal
     */
    @observable
    public verticalInset: string = "false";

    /**
     * @internal
     */
    @observable
    public horizontalScaling: AxisScalingMode = "anchor";

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
    public region: AnchoredRegion;

    /**
     * The timer that tracks delay time before the tooltip is shown on hover
     */
    private delayTimer: number | null = null;

    /**
     * Indicates whether the anchor is currently being hovered
     */
    private isAnchorHovered: boolean = false;

    public connectedCallback(): void {
        super.connectedCallback();
        this.anchorElement = this.getAnchor();

        this.updateLayout();
        this.updateTooltipVisibility();
    }

    public disconnectedCallback(): void {
        this.hideTooltip();
        this.clearDelayTimer();
        super.disconnectedCallback();
    }

    /**
     * invoked when the anchored region's position relative to the anchor changes
     *
     * @internal
     */
    public handlePositionChange = (ev: Event): void => {
        this.classList.toggle("top", this.region.verticalPosition === "top");
        this.classList.toggle("bottom", this.region.verticalPosition === "bottom");
        this.classList.toggle("inset-top", this.region.verticalPosition === "insetTop");
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
    private handleAnchorMouseOver = (ev: Event): void => {
        this.startHoverTimer();
    };

    /**
     * mouse leaves anchor
     */
    private handleAnchorMouseOut = (ev: Event): void => {
        if (this.isAnchorHovered) {
            this.isAnchorHovered = false;
            this.updateTooltipVisibility();
        }
        this.clearDelayTimer();
    };

    /**
     * starts the hover timer if not currently running
     */
    private startHoverTimer = (): void => {
        if (this.isAnchorHovered) {
            return;
        }

        if (this.delay > 1) {
            if (this.delayTimer === null)
                this.delayTimer = window.setTimeout((): void => {
                    this.startHover();
                }, this.delay);
            return;
        }

        this.startHover();
    };

    /**
     * starts the hover delay timer
     */
    private startHover = (): void => {
        this.isAnchorHovered = true;
        this.updateTooltipVisibility();
    };

    /**
     * clears the hover delay
     */
    private clearDelayTimer = (): void => {
        if (this.delayTimer !== null) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    };

    /**
     * updated the properties being passed to the anchored region
     */
    private updateLayout(): void {
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
    private updateTooltipVisibility = (): void => {
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
    private showTooltip = (): void => {
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
    private hideTooltip = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        if (this.region !== null && this.region !== undefined) {
            (this.region as any).removeEventListener(
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
    private setRegionProps = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        this.viewportElement = document.body;
        this.region.viewportElement = this.viewportElement;
        this.region.anchorElement = this.anchorElement;
        (this.region as any).addEventListener(
            "positionchange",
            this.handlePositionChange
        );
    };
}
