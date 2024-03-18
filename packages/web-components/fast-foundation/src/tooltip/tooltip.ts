import { autoUpdate, computePosition, flip, shift } from "@floating-ui/dom";
import {
    attr,
    css,
    ElementStyles,
    FASTElement,
    nullableBooleanConverter,
    observable,
    Updates,
} from "@microsoft/fast-element";
import { keyEscape, uniqueId } from "@microsoft/fast-web-utilities";
import { getRootActiveElement } from "../utilities/index.js";
import { TooltipPlacement } from "./tooltip.options.js";

/**
 * A Tooltip Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.2/#tooltip | ARIA tooltip }.
 *
 * @slot - The default slot for the tooltip content
 * @fires dismiss - Fires a custom 'dismiss' event when the tooltip is visible and escape key is pressed
 *
 * @public
 */
export class FASTTooltip extends FASTElement {
    /**
     * The visibility of the tooltip.
     *
     * @internal
     */
    @observable
    private _visible: boolean = false;

    /**
     * The id of the element the tooltip is anchored to.
     *
     * @defaultValue - undefined
     * @public
     * @remarks
     * HTML Attribute: `anchor`
     */
    @attr({ attribute: "anchor" })
    public anchor: string | undefined;

    /**
     * Removes listeners from the previous anchor element and updates the anchor element reference.
     *
     * @param prev - the previous anchor string
     * @param next - the current anchor string
     *
     * @internal
     */
    protected anchorChanged(prev: string | undefined, next: string): void {
        if (this.$fastController.isConnected) {
            this.anchorElement = this.getAnchorElement(next);
        }
    }

    /**
     * A reference to the anchor element. This can be assigned directly or by setting the `anchor` attribute.
     * Setting either will override the previous anchor element.
     *
     * @public
     */
    @observable
    public anchorElement: Element | null;
    protected anchorElementChanged(prev: Element | null, next: Element | null): void {
        if (prev) {
            this.removeListeners(prev);
            this.removeAnchorAriaDescribedBy(this.id, prev);
        }
        if (next) {
            this.addAnchorAriaDescribedBy(next);
            if (!this.controlledVisibility) {
                this.addListeners(next);
            }
        }
    }

    /**
     * Cleanup function for the tooltip positioner.
     *
     * @public
     */
    public cleanup: () => void;

    /**
     * Indicates if the tooltip visibility is controlled by the `visible` attribute.
     *
     * When `true`, the tooltip visibility is controlled by the `visible` attribute.
     * When `false`, the tooltip visibility is controlled by the `mouseover` and `focusin` events on the anchor element.
     *
     * @internal
     */
    @observable
    private controlledVisibility: boolean = false;

    /**
     * Switches between controlled and uncontrolled visibility.
     *
     * @param prev - the previous forced visibility state
     * @param next - the current forced visibility state
     * @internal
     */
    protected controlledVisibilityChanged(
        prev: boolean | undefined,
        next: boolean
    ): void {
        if (this.$fastController.isConnected && this.anchorElement) {
            if (!next) {
                this.addListeners(this.anchorElement);
                this.hideTooltip();
                return;
            }

            this.removeListeners(this.anchorElement);
        }
    }

    /**
     * Hides the tooltip when the anchor element loses focus.
     *
     * @internal
     */
    protected focusoutAnchorHandler = (): void => {
        if (!this.controlledVisibility && this._visible) {
            this.hideTooltip();
        }
    };

    /**
     * Shows the tooltip when the anchor element gains focus.
     *
     * @internal
     */
    protected focusinAnchorHandler = (): void => {
        if (!this.controlledVisibility && !this._visible) {
            this.showTooltip();
        }
    };

    /**
     * The tooltip ID attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: `id`
     */
    @attr
    id: string;
    public idChanged(prev: string, next: string): void {
        if (this.anchorElement) {
            this.removeAnchorAriaDescribedBy(prev, this.anchorElement);
            Updates.enqueue(() => {
                if (this.anchorElement) {
                    this.addAnchorAriaDescribedBy(this.anchorElement);
                }
            });
        }
    }

    /**
     * Hides the tooltip when the `Escape` key is pressed.
     *
     * @param e - the keyboard event
     *
     * @internal
     */
    private keydownDocumentHandler = (e: KeyboardEvent): void => {
        if (!e.defaultPrevented && this.visible) {
            switch (e.key) {
                case keyEscape: {
                    this.dismiss();
                    break;
                }
            }
        }
    };

    /**
     * Shows the tooltip when the mouse is over the anchor element.
     *
     * @internal
     */
    private mouseoverAnchorHandler = (): void => {
        if (!getRootActiveElement(this)?.isSameNode(this.anchorElement)) {
            this.showTooltip();
        }
    };

    /**
     * Hides the tooltip when the mouse leaves the anchor element.
     *
     * @internal
     */
    private mouseoutAnchorHandler = (e: MouseEvent): void => {
        if (
            !getRootActiveElement(this)?.isSameNode(this.anchorElement) &&
            !this.isSameNode(e.relatedTarget as HTMLElement)
        ) {
            this.hideTooltip();
        }
    };

    /**
     * The placement of the tooltip relative to the anchor element.
     *
     * @public
     * @remarks
     * HTML Attribute: `placement`
     */
    @attr
    public placement: TooltipPlacement = TooltipPlacement.bottom;

    /**
     * Calculated styles for the tooltip position.
     *
     * @internal
     */
    @observable
    protected positionStyles: ElementStyles;

    /**
     * Updates the styles for the tooltip position.
     *
     * @param prev - the previous placement styles
     * @param next - the current placement styles
     *
     * @internal
     */
    protected positionStylesChanged(
        prev: ElementStyles | undefined,
        next: ElementStyles | undefined
    ): void {
        this.$fastController.removeStyles(prev);
        this.$fastController.addStyles(next);
    }

    /**
     * The visibility state of the tooltip.
     *
     * @public
     * @remarks
     * HTML Attribute: `show`
     */
    @attr({
        attribute: "show",
        converter: nullableBooleanConverter,
        mode: "fromView",
    })
    public show: boolean | undefined;
    public showChanged(prev: boolean | undefined, next: boolean | undefined): void {
        this.setVisible(next);
    }

    /**
     * Returns the current visibility of the tooltip.
     * @public
     */
    public get visible(): boolean | undefined {
        return this._visible;
    }

    /**
     * Sets the forced visibility state and shows or hides the tooltip.
     *
     * @internal
     */
    private setVisible(value: boolean | undefined) {
        this.controlledVisibility = typeof value === "boolean";
        if (this.controlledVisibility) {
            this.show = value;
        }

        if (value) {
            this.showTooltip();
            return;
        }

        this.hideTooltip();
    }

    /**
     * Adds the `id` of the tooltip to the `aria-describedby` attribute of the anchor element.
     *
     * @internal
     */
    private addAnchorAriaDescribedBy(anchorElement: Element): void {
        if (!this.id) {
            this.id = uniqueId("tooltip-");
            return;
        }

        const anchorElementDescribedBy = anchorElement
            .getAttribute("aria-describedby")
            ?.concat(" ", this.id)
            .trim();

        if (anchorElementDescribedBy) {
            anchorElement.setAttribute("aria-describedby", anchorElementDescribedBy);
        }
    }

    /**
     * Adds event listeners to the anchor element, the tooltip element, and the document.
     *
     * @internal
     */
    private addListeners(anchorElement: Element): void {
        anchorElement.addEventListener("focusin", this.focusinAnchorHandler);
        anchorElement.addEventListener("focusout", this.focusoutAnchorHandler);
        anchorElement.addEventListener("mouseout", this.mouseoutAnchorHandler);
        anchorElement.addEventListener("mouseover", this.mouseoverAnchorHandler);

        this.addEventListener("mouseout", this.mouseoutAnchorHandler);
        this.addEventListener("mouseover", this.mouseoverAnchorHandler);

        document.addEventListener("keydown", this.keydownDocumentHandler);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.anchor !== undefined) {
            this.anchorElement = this.getAnchorElement(this.anchor);
        }
    }

    /**
     * Hides the tooltip and emits a custom `dismiss` event.
     *
     * @internal
     */
    private dismiss(): void {
        this.hideTooltip();
        this.$emit("dismiss");
    }

    /**
     * Hides the tooltip.
     *
     * @internal
     */
    public hideTooltip(): void {
        this._visible = false;
        this.cleanup?.();
    }

    /**
     * Gets the anchor element by id.
     *
     * @param id - the id of the anchor element
     *
     * @internal
     */
    private getAnchorElement(id: string = ""): HTMLElement | null {
        const rootNode = this.getRootNode();
        if (rootNode instanceof ShadowRoot) {
            return rootNode.getElementById(id);
        }

        return document.getElementById(id);
    }

    /**
     * Removes the `id` of the tooltip from the `aria-describedby` attribute of the anchor element.
     *
     * @param id - the id of the tooltip
     *
     * @internal
     */
    private removeAnchorAriaDescribedBy(id: string, anchorElement: Element): void {
        const anchorElementDescribedBy = anchorElement
            .getAttribute("aria-describedby")
            ?.split(" ");

        anchorElement.setAttribute(
            "aria-describedby",
            (anchorElementDescribedBy ?? []).filter(i => i !== id).join(" ")
        );

        if (anchorElement.getAttribute("aria-describedby") === "") {
            anchorElement.removeAttribute("aria-describedby");
        }
    }

    /**
     * Removes event listeners from the anchor element, the tooltip element, and the document.
     *
     * @internal
     */
    private removeListeners(anchorElement: Element): void {
        anchorElement.removeEventListener("focusin", this.focusinAnchorHandler);
        anchorElement.removeEventListener("focusout", this.focusoutAnchorHandler);
        anchorElement.removeEventListener("mouseout", this.mouseoutAnchorHandler);
        anchorElement.removeEventListener("mouseover", this.mouseoverAnchorHandler);

        this.removeEventListener("mouseout", this.mouseoutAnchorHandler);
        this.removeEventListener("mouseover", this.mouseoverAnchorHandler);

        document.removeEventListener("keydown", this.keydownDocumentHandler);
    }

    /**
     * Sets the tooltip position.
     *
     * @public
     */
    public setPositioning(): void {
        this.cleanup?.();

        if (!this.anchorElement) {
            this.hideTooltip();
            return;
        }

        const anchorElement = this.anchorElement;

        this.cleanup = autoUpdate(anchorElement, this, async () => {
            const middleware = [shift()];

            if (!this.placement) {
                middleware.unshift(flip());
            }

            const { x, y } = await computePosition(anchorElement, this, {
                placement: this.placement,
                strategy: "fixed",
                middleware,
            });

            this.positionStyles = css`
                :host {
                    position: fixed;
                    left: ${x.toString()}px;
                    top: ${y.toString()}px;
                }
            `;
        });
    }

    /**
     * Shows the tooltip.
     *
     * @internal
     */
    private showTooltip(): void {
        this._visible = true;
        Updates.enqueue(() => this.setPositioning());
    }
}
