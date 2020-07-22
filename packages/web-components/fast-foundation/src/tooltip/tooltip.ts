import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { AnchoredRegion, AxisPositioningMode, AxisScalingMode } from "../anchored-region";
import { keyCodeEscape } from "@microsoft/fast-web-utilities";

export type TooltipPosition = "top" | "right" | "bottom" | "left";

const hiddenRegionStyle: string = `
     display: none;
     pointer-events: none;
`;

const visibleRegionStyle: string = `
     pointer-events: none;
`;

export class Tooltip extends FASTElement {
    @attr({ mode: "boolean" })
    public visible: boolean;
    private visibleChanged(): void {
        if ((this as any).$fastController.isConnected) {
            this.updateTooltipVisibility();
            this.updateLayout();
        }
    }

    @attr
    public anchor: string = "";
    private anchorChanged(): void {
        if ((this as any).$fastController.isConnected) {
            this.updateLayout();
        }
    }

    @attr
    public delay: number = 300;

    @attr
    public position: TooltipPosition | null = null;
    private positionChanged(): void {
        if ((this as any).$fastController.isConnected) {
            this.updateLayout();
        }
    }

    @observable
    public anchorElement: HTMLElement | null = null;
    private anchorElementChanged(oldValue: HTMLElement | null): void {
        if ((this as any).$fastController.isConnected) {
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

                document.querySelectorAll(":hover").forEach(element => {
                    if (element.id === anchorId) {
                        this.startHoverTimer();
                    }
                });
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

    @observable
    public viewportElement: HTMLElement | null = null;
    private viewportElementChanged(): void {
        if (this.region !== null && this.region !== undefined) {
            this.region.viewportElement = this.viewportElement;
        }
        this.updateLayout();
    }

    @observable
    public verticalPositioningMode: AxisPositioningMode = "dynamic";

    @observable
    public horizontalPositioningMode: AxisPositioningMode = "dynamic";

    @observable
    public horizontalInset: string = "true";

    @observable
    public verticalInset: string = "false";

    @observable
    public horizontalScaling: AxisScalingMode = "anchor";

    @observable
    public verticalScaling: AxisScalingMode = "content";

    @observable
    public verticalDefaultPosition: string | undefined = undefined;

    @observable
    public horizontalDefaultPosition: string | undefined = undefined;

    @observable
    public tooltipVisible: boolean = false;

    @observable
    public regionStyle: string = hiddenRegionStyle;

    /**
     * reference to the tooltip container
     */
    public tooltipElement: HTMLDivElement;

    /**
     * reference to the anchored region
     */
    public region: AnchoredRegion;

    private delayTimer: number | null = null;

    private isAnchorHovered: boolean = false;

    constructor() {
        super();
    }

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

    public handlePositionChange = (ev: Event): void => {
        this.upDatePositionCSS();
    };

    public upDatePositionCSS(): void {
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
    }

    public handleAnchorMouseOver = (ev: Event): void => {
        this.startHoverTimer();
    };

    public handleAnchorMouseOut = (ev: Event): void => {
        if (this.isAnchorHovered) {
            this.isAnchorHovered = false;
            this.updateTooltipVisibility();
        }
        this.clearDelayTimer();
    };

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

    private clearDelayTimer = (): void => {
        if (this.delayTimer !== null) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    };

    private updateLayout(): void {
        switch (this.position) {
            case "top":
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                this.horizontalScaling = "anchor";
                this.verticalScaling = "content";
                break;

            case "bottom":
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                this.horizontalScaling = "anchor";
                this.verticalScaling = "content";
                break;

            case "right":
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = "right";
                this.horizontalInset = "false";
                this.verticalInset = "true";
                this.horizontalScaling = "content";
                this.verticalScaling = "anchor";
                break;

            case "left":
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = "left";
                this.horizontalInset = "false";
                this.verticalInset = "true";
                this.horizontalScaling = "content";
                this.verticalScaling = "anchor";
                break;

            case null:
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
        return document.getElementById(this.anchor);
    };

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

    private startHover = (): void => {
        this.isAnchorHovered = true;
        this.updateTooltipVisibility();
    };

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

    private showTooltip = (): void => {
        if (this.tooltipVisible) {
            return;
        }
        DOM.queueUpdate(this.showRegion);
    };

    private hideTooltip = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        if (this.region !== null && this.region !== undefined) {
            (this.region as any).removeEventListener("change", this.handlePositionChange);
            this.region.viewportElement = null;
            this.region.anchorElement = null;
        }
        document.removeEventListener("keydown", this.handleDocumentKeydown);
        this.tooltipVisible = false;
        this.regionStyle = hiddenRegionStyle;
    };

    private showRegion = (): void => {
        document.addEventListener("keydown", this.handleDocumentKeydown);
        this.tooltipVisible = true;
        this.regionStyle = visibleRegionStyle;
        DOM.queueUpdate(this.setRegionProps);
    };

    private setRegionProps = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        this.viewportElement = document.body;
        this.region.viewportElement = this.viewportElement;
        this.region.anchorElement = this.anchorElement;
        (this.region as any).addEventListener("change", this.handlePositionChange);
    };
}
