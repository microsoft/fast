import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element";
import type { Tooltip, TooltipPosition } from "../tooltip";

/**
 * An Abbr Custom HTML Element
 * Implements {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr | HTML abbr}.
 * @public
 *
 * @remarks
 * Designed to be used with {@link @microsoft/fast-foundation#abbrTemplate}.
 */
export class Abbr extends FoundationElement {
    /**
     * @public
     */
    @attr
    public text: string;

    /**
     * @public
     */
    @attr
    public position: TooltipPosition;

    /**
     * @public
     */
    @attr({ converter: nullableNumberConverter })
    public delay: number;

    /**
     * @internal
     */
    @observable
    public showTooltip: boolean = false;

    /**
     * @internal
     */
    public tooltip: Tooltip;

    /**
     * @internal
     */
    public root: HTMLElement;

    public connectedCallback() {
        super.connectedCallback();

        this.tooltip.anchorElement = this.root;
        this.tooltip.horizontalViewportLock = true;
        this.tooltip.verticalViewportLock = true;
    }

    /**
     * @internal
     */
    public handleMouseOver = (e: MouseEvent): void => {
        this.showTooltip = true;
    };

    /**
     * @internal
     */
    public handleMouseOut = (e: MouseEvent): void => {
        this.showTooltip = false;
    };
}
