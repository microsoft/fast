import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {AnchoredRegion} from "../anchored-region";
import { keyCodeEscape } from "@microsoft/fast-web-utilities";

export type TooltipPosition = "top" | "right" | "bottom" | "left";

const hiddenRegionStyle: string =  `
     pointer-events: none;
`;

const visibleRegionStyle: string =  `
     pointer-events: none;
`;

export class Tooltip extends FASTElement {
    @attr({ mode: "boolean" })
    public hidden: boolean;
    private hiddenChanged(): void {
        if ((this as any).$fastController.isConnected){
            this.updateTooltipVisibility()
            this.updateLayout();
        }
    }

    @attr       
    public anchor: string = "";
    private anchorChanged(): void {
        if ((this as any).$fastController.isConnected){
            this.updateLayout();
        }
    }

    @attr
    public delay: number = 300;

    @attr
    public position: TooltipPosition | null = null;
    private positionChanged(): void {
        if ((this as any).$fastController.isConnected){
            this.updateLayout();
        }
    }

    @observable
    public anchorElement: HTMLElement | null = null;
    private anchorElementChanged(oldValue: HTMLElement | null ): void {
        if ((this as any).$fastController.isConnected){
            if (
                oldValue !== null &&
                oldValue !== undefined
            ) {
                oldValue.removeEventListener("mouseover", this.handleAnchorMouseOver);
                oldValue.removeEventListener("mouseout", this.handleAnchorMouseOut);
            }

            if (
                this.anchorElement !== null &&
                this.anchorElement !== undefined
            ) {
                this.anchorElement.addEventListener("mouseover", this.handleAnchorMouseOver, { passive: true });
                this.anchorElement.addEventListener("mouseout", this.handleAnchorMouseOut, { passive: true });
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
    public verticalPositioningMode: string = "dynamic";

    @observable
    public horizontalPositioningMode: string = "dynamic";

    @observable
    public horizontalInset: string = "false";

    @observable
    public verticalInset: string = "false";

    @observable
    public verticalDefaultPosition: string | undefined = undefined;

    @observable
    public horizontalDefaultPosition: string | undefined = undefined;

    @observable
    public tooltipVisible: boolean = false;

    @observable
    public regionStyle: string = hiddenRegionStyle;

    /**
     * reference to the component root
     */
    public tooltipRoot: HTMLDivElement;

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

        (this.region as any).addEventListener("change", this.handlePositionChange);
        this.viewportElement = this.tooltipRoot.parentElement;
        this.region.viewportElement = this.viewportElement;
        this.region.anchorElement = this.anchorElement;
        this.upDatePositionCSS();
        this.updateLayout();
        this.updateTooltipVisibility();
    }

    public disconnectedCallback(): void {
        if (this.region !== null && this.region  !== undefined) {
            (this.region as any).removeEventListener("change", this.handlePositionChange);
        }
        this.clearDelayTimer();
        super.disconnectedCallback();
    }

    public handlePositionChange = (ev:Event): void => {
        this.upDatePositionCSS();
    }

    public upDatePositionCSS = (): void => {
        this.classList.toggle("top", this.region.verticalPosition === "top");
        this.classList.toggle("bottom", this.region.verticalPosition === "bottom");
        this.classList.toggle("inset-top", this.region.verticalPosition === "insetTop");
        this.classList.toggle("inset-bottom", this.region.verticalPosition === "insetBottom");

        this.classList.toggle("left", this.region.horizontalPosition === "left");
        this.classList.toggle("right", this.region.horizontalPosition === "right");
        this.classList.toggle("inset-left", this.region.horizontalPosition === "insetLeft");
        this.classList.toggle("inset-right", this.region.horizontalPosition === "insetRight");
    }

    public handleAnchorMouseOver = (ev:Event): void => {
        if (this.isAnchorHovered) {
            return;
        }

        if (
            this.delay > 1
        ) {
            if (this.delayTimer === null)
            this.delayTimer = window.setTimeout((): void => {
            this.startHover();
            }, this.delay);
            return;
        }

        this.startHover();
    }

    public handleAnchorMouseOut = (ev:Event): void => {
       if (this.isAnchorHovered) {
           this.isAnchorHovered = false;
           this.updateTooltipVisibility();
       }
       this.clearDelayTimer();
    }

    private clearDelayTimer = (): void => {
        if (this.delayTimer !== null) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    }

    private updateLayout(): void {
        switch (this.position) {
            case "top":
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                break;

            case "bottom":
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                break;

            case "right":
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = "right";
                this.horizontalInset = "false";
                this.verticalInset = "true";
                break;

            case "left":
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = "left";
                this.horizontalInset = "false";
                this.verticalInset = "true";
                break;

            case null:
                this.verticalPositioningMode = "dynamic";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = undefined;
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "false";
                this.verticalInset = "false";
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
    }


    private updateTooltipVisibility = (): void => {
        if (this.hidden === true) {
           this.hideTooltip();
        } else if (this.hidden === false) {
            this.showTooltip();
        } else {
            if (
                this.isAnchorHovered
            ) {
                this.showTooltip();
                return;
            }
            this.hideTooltip();
        }
    }

    private showTooltip = (): void => {
        if (this.tooltipVisible) {
            return;
        }
        document.addEventListener("keydown", this.handleDocumentKeydown);
        this.tooltipVisible = true;
        // this.regionStyle = visibleRegionStyle;
        // this.region.anchorElement = this.anchorElement;
    }

    private hideTooltip = (): void => {
        if (!this.tooltipVisible) {
            return;
        }
        document.removeEventListener("keydown", this.handleDocumentKeydown);
        this.tooltipVisible = false;
        // this.regionStyle = hiddenRegionStyle;
        // this.region.anchorElement = null;
    }

}
