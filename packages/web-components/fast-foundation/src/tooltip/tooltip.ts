import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import {AnchoredRegion} from "../anchored-region"

export type TooltipPosition = "top" | "right" | "bottom | left";

export class Tooltip extends FASTElement {
    @attr({ mode: "boolean" })
    public hidden: boolean = false;

    @attr       
    public anchor: string = "";
    private anchorChanged(): void {
    }

    @attr
    public delay: number = 300;

    @attr
    public position: TooltipPosition = "top";

    @observable
    public anchorElement: HTMLElement | null = null;
    // private anchorElementChanged(): void {
    //     if (this.initialLayoutComplete) {
    //         this.initialLayoutComplete = false;
    //         this.reset();
    //     }
    // }

    /**
     * reference to the component root
     */
    public root: HTMLDivElement;

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
        this.region.viewportElement = this.root.parentElement;
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
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
