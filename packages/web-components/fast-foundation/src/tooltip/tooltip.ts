import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import {AnchoredRegion} from "../anchored-region"

export type TooltipPosition = "top" | "right" | "bottom" | "left";

export class Tooltip extends FASTElement {
    @attr({ mode: "boolean" })
    public hidden: boolean = false;
    private hiddenChanged(): void {

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
    private anchorElementChanged(): void {
        if ((this as any).$fastController.isConnected){
            this.updateLayout();
        }
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

    /**
     * reference to the component root
     */
    public tooltipRoot: HTMLDivElement;

    /**
     * reference to the anchored region
     */
    public region: AnchoredRegion;

    public viewport: HTMLElement | null = null;

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        (this.region as any).addEventListener("change", this.handlePositionChange);
        (this.region as any).viewportElement = this.tooltipRoot.parentElement;
        this.upDatePositionCSS();
        this.updateLayout();
    }

    public disconnectedCallback(): void {
        (this.region as any).removeEventListener("change", this.handlePositionChange);
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

    private updatePositioningStyles = (anchoredRegion: AnchoredRegion): void => {
        
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
     * TODO: Issue #2742 - https://github.com/microsoft/fast-dna/issues/2742
     * This is a placeholder function to check if the hidden attribute is present
     * Currently there is not support for boolean attributes.
     * Once support is added, we will simply use this.hidden.
     */
    private isTooltipHidden(): boolean {
        return typeof this.hidden !== "boolean";
    }

}
