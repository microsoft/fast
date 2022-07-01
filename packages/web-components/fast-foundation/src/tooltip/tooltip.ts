import {
    autoUpdate,
    computePosition,
    ComputePositionConfig,
    flip,
    inline,
    Middleware,
    offset,
} from "@floating-ui/dom";
import { attr, FASTElement, observable, Updates } from "@microsoft/fast-element";
import { keyEscape } from "@microsoft/fast-web-utilities";
import { TooltipPosition } from "./tooltip.options.js";

export { TooltipPosition };

/**
 * An Tooltip Custom HTML Element.
 *
 * @slot - The default slot for the tooltip content
 * @csspart tooltip - The tooltip element
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
            this.setTooltipPosition();
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
            this.setTooltipPosition();
        }
    }

    public cleanupTooltipPosition: () => void;

    /**
     * This is the type of CSS position property to use.
     * Apply the corresponding css value in your element styles
     * Fixed strategy is useful for reducing jumpiness and more easily
     * enables the tooltip to break out of a clipping container (into the "top layer")
     *
     * @public
     * @remarks
     * HTML Attribute: strategy
     */
    @attr
    public strategy: "fixed" | "absolute";

    /**
     * Displaces the tooltip from its anchor along the specified axes.
     *
     * @public
     * @remarks
     * HTML Attribute: offset
     */
    @attr
    public offset: number;

    /**
     * Provides improved positioning for inline reference elements that span over multiple lines,
     * such as hyperlinks or range selections.
     *
     * @public
     * @remarks
     * HTML Attribute: inline
     */
    @attr
    public inline: boolean = false;

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

            this.setTooltipPosition();
        }
    }

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
     * Sets the tooltip position
     *
     * @public
     */
    public setTooltipPosition = (): void => {
        const positionConfig: Partial<ComputePositionConfig> = {
            placement: this.position || TooltipPosition.top,
            middleware: [flip()],
            strategy: this.strategy,
        };
        if (this.offset) {
            positionConfig.middleware?.push(offset(this.offset));
        }

        if (this.inline) {
            positionConfig.middleware!.push(inline());
        }

        this.cleanupTooltipPosition = autoUpdate(
            this.anchorElement as HTMLElement,
            this,
            () =>
                computePosition(
                    this.anchorElement as HTMLElement,
                    this,
                    positionConfig
                ).then(({ x, y }) => {
                    Object.assign((this as HTMLElement)!.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                }),
            {
                ancestorScroll: true,
                ancestorResize: true,
                elementResize: true,
            }
        );
    };

    /**
     * mouse enters anchor
     */
    private handleAnchorMouseOver = (ev: Event): void => {
        if (!this.hidden) {
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

        if (this.hidden) {
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
        if (!e.defaultPrevented && !this.hidden) {
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
            if (this.isAnchorHoveredFocused) {
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
        if (!this.hidden) {
            return;
        }

        this.hidden = false;

        Updates.enqueue(() => {
            this.setTooltipPosition();
        });

        document.addEventListener("keydown", this.handleDocumentKeydown);
    };

    /**
     * hides the tooltip
     */
    private hideTooltip = (): void => {
        if (this.hidden) {
            return;
        }
        this.clearHideDelayTimer();

        document.removeEventListener("keydown", this.handleDocumentKeydown);

        this.hidden = true;

        this.cleanupTooltipPosition();
    };
}
