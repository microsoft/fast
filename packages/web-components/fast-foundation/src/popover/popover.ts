import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Direction, keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import tabbable from "tabbable";
import { AnchoredRegion, AxisPositioningMode, AxisScalingMode } from "../anchored-region";
import { ARIAGlobalStatesAndProperties } from "../patterns";
import { applyMixins, getDirection } from "../utilities";
import { PopoverPosition } from "./popover.options";

// TODO: ASK Do we want trapFocus to always be true???
// TODO: ASK Should we bring focus back to target after popover is closed

export { PopoverPosition };

/**
 * An Popover Custom HTML Element.
 *
 * @public
 */
export class Popover extends FASTElement {
    private static DirectionAttributeName: string = "dir";

    /**
     * Whether the popover is visible or not.
     *
     * @defaultValue - false
     * @public
     * HTML Attribute: visible
     */
    @attr({ mode: "boolean" })
    public visible: boolean;
    private visibleChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            if (!this.visible && this.isDelayTriggered) {
                // prevents a double click of target from creating an erroneous state of visible = false, but the popover still shows on the page when delay is used. This occurs when the delay is longer than the double click period.
                this.visible = true;
                return;
            }
            this.updatePopoverVisibility();
            this.updateLayout();
        }
    }

    /**
     * whether or not the popover will trap focus inside of it when it is open
     * @defaultValue - true
     * @public
     */
    @attr({ attribute: "trap-focus", mode: "boolean" })
    public trapFocus: boolean;
    // TODO: ASK when trapFocus is _off_ the tab sequence targets the next tabbable element in the page, _not_ in the popover. It's like the popover gets placed in the DOM before it's target element. Should trapFocus even be optional???

    /**
     * The id of the element the popover uses as a target to be triggered from
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: target
     */
    @attr
    public target: string = "";
    private targetChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateLayout();
        }
    }

    /**
     * Whether or not to focus back on the target element when popover is closed
     * @defaultValue - true
     * @public
     * HTML Attribute: focus-target-on-dismiss
     */
    @attr({ attribute: "focus-target-on-dismiss", mode: "boolean" })
    public focusTargetOnDismiss: boolean;

    /**
     * Controls the placement of the popover relative to the target.
     * When the position is undefined the popover is placed above or below the target based on available space.
     *
     * @defaultValue - undefined
     * @public
     * HTML Attribute: position
     */
    @attr
    public position: PopoverPosition;
    private positionChanged(): void {
        if ((this as FASTElement).$fastController.isConnected) {
            this.updateLayout();
        }
    }

    /**
     * The delay in milliseconds before a popover is shown after a trigger event
     *
     * @defaultValue - 0
     * @public
     * HTML Attribute: delay
     */
    @attr
    public delay: number;

    /**
     * the html element currently being used as target.
     * Setting this directly overrides the target attribute.
     *
     * @public
     */
    @observable
    public targetElement: HTMLElement | null = null;
    private targetElementChanged(oldValue: HTMLElement | null): void {
        if ((this as FASTElement).$fastController.isConnected) {
            if (
                this.region !== null &&
                this.region !== undefined &&
                this.popoverVisible
            ) {
                this.region.anchorElement = this.targetElement;
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
    public popoverVisible: boolean = false;

    /**
     * @internal
     */
    @observable
    public isDelayTriggered: boolean = false;

    /**
     * Track current direction to pass to the anchored region, updated when popover is shown
     *
     * @internal
     */
    @observable
    public currentDirection: Direction = Direction.ltr;

    /**
     * @internal
     */
    public region: AnchoredRegion;

    /**
     * @internal
     */
    public popover: HTMLDivElement;

    /**
     * The timer that tracks delay time before the popover is shown on target trigger
     */
    private delayTimer: number | null = null;

    private tabbableElements: HTMLElement[];

    private observer: MutationObserver;

    public connectedCallback(): void {
        super.connectedCallback();
        this.observer = new MutationObserver(this.onChildListChange);
        // only observe if nodes are added or removed
        this.observer.observe(this as Element, { childList: true });

        if (!this.visible) {
            this.visible = false;
        }

        if (this.trapFocus === undefined) {
            this.trapFocus = true;
        }

        if (this.focusTargetOnDismiss === undefined) {
            this.focusTargetOnDismiss = true;
        }

        if (this.delayTimer === undefined) {
            this.delay = 0;
        }

        this.targetElement = this.getTarget();

        this.updateLayout();
        this.updatePopoverVisibility();
    }

    public disconnectedCallback(): void {
        this.hidePopover();
        this.clearDelayTimer();
        super.disconnectedCallback();
        this.observer.disconnect();
    }

    /**
     * invoked when the anchored region's position relative to the anchor changes
     * @internal
     */
    public handlePositionChange = (e: Event): void => {
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
     * invoked when the anchored region is loaded, safe to run any events/methods on anchored region in this method
     * @internal
     */
    public handleAnchoredRegionLoaded = (e: Event) => {
        this.trapFocusChanged();
    };

    /**
     * handle click on the body for soft-dismiss
     */
    private handleDocumentClick = (e: Event): void => {
        if (
            this.popoverVisible &&
            e.target !== this &&
            !this.contains(e.target as Node) &&
            e.target !== this.targetElement
        ) {
            // this.hidePopover();
            this.visible = false;
            this.popoverVisible = false;
        }
    };

    /**
     * updated the properties being passed to the anchored region
     */
    private updateLayout(): void {
        switch (this.position) {
            case PopoverPosition.top:
            case PopoverPosition.bottom:
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "dynamic";
                this.verticalDefaultPosition = this.position;
                this.horizontalDefaultPosition = undefined;
                this.horizontalInset = "true";
                this.verticalInset = "false";
                this.horizontalScaling = "anchor";
                this.verticalScaling = "content";
                break;
            case PopoverPosition.topLeft:
            case PopoverPosition.topRightAligned:
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "left";
                this.horizontalInset =
                    this.position === PopoverPosition.topLeft ? "false" : "true";
                this.verticalInset = "false";
                this.horizontalScaling = "content";
                this.verticalScaling = "content";
                break;
            case PopoverPosition.topRight:
            case PopoverPosition.topLeftAligned:
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = "top";
                this.horizontalDefaultPosition = "right";
                this.horizontalInset =
                    this.position === PopoverPosition.topRight ? "false" : "true";
                this.verticalInset = "false";
                this.horizontalScaling = "content";
                this.verticalScaling = "content";
                break;
            case PopoverPosition.bottomLeft:
            case PopoverPosition.bottomRightAligned:
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "left";
                this.horizontalInset =
                    this.position === PopoverPosition.bottomLeft ? "false" : "true";
                this.verticalInset = "false";
                this.horizontalScaling = "content";
                this.verticalScaling = "content";
                break;
            case PopoverPosition.bottomRight:
            case PopoverPosition.bottomLeftAligned:
                this.verticalPositioningMode = "locktodefault";
                this.horizontalPositioningMode = "locktodefault";
                this.verticalDefaultPosition = "bottom";
                this.horizontalDefaultPosition = "right";
                this.horizontalInset =
                    this.position === PopoverPosition.bottomRight ? "false" : "true";
                this.verticalInset = "false";
                this.horizontalScaling = "content";
                this.verticalScaling = "content";
                break;

            case PopoverPosition.right:
            case PopoverPosition.left:
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
    private getTarget = (): HTMLElement | null => {
        return document.getElementById(this.target);
    };

    /**
     * handles key down events to check for dismiss and tab when trapFocus is true
     */
    private handleDocumentKeydown = (e: KeyboardEvent): void => {
        if (!e.defaultPrevented && this.popoverVisible) {
            switch (e.keyCode) {
                case keyCodeEscape:
                    this.visible = false;
                    this.$emit("dismiss");
                    break;
                case keyCodeTab:
                    if (this.trapFocus) {
                        if (e.shiftKey && e.target === this.tabbableElements[0]) {
                            this.tabbableElements[
                                this.tabbableElements.length - 1
                            ].focus();
                            e.preventDefault();
                        } else if (
                            !e.shiftKey &&
                            e.target ===
                                this.tabbableElements[this.tabbableElements.length - 1]
                        ) {
                            this.tabbableElements[0].focus();
                            e.preventDefault();
                        }
                    }
                    break;
            }
        }
    };

    /**
     *
     */
    private handleDocumentFocus = (e: Event): void => {
        if (
            !e.defaultPrevented &&
            this.shouldForceFocus(e.target as HTMLElement) &&
            e.target !== this.targetElement
        ) {
            this.focusFirstElement();
            e.preventDefault();
        }
    };

    /**
     * determines whether to show or hide the popover based on current state
     */
    private updatePopoverVisibility = (): void => {
        if (this.visible === false) {
            this.hidePopover();
        } else if (this.visible === true) {
            this.showPopoverTimer();
        } else {
            if (this.popoverVisible) {
                this.showPopoverTimer();
                return;
            }
            this.hidePopover();
        }
    };

    /**
     * shows the popover
     */
    private showPopoverTimer = (): void => {
        if (this.popoverVisible) {
            return;
        }

        this.currentDirection = getDirection(this);
        if (!this.isDelayTriggered) {
            if (this.delay > 1) {
                this.isDelayTriggered = true;
                this.delayTimer = window.setTimeout((): void => {
                    this.showPopover();
                }, this.delay);
                return;
            }
            this.showPopover();
        }
    };

    private showPopover = (): void => {
        document.addEventListener("keydown", this.handleDocumentKeydown);
        document.addEventListener("click", this.handleDocumentClick);
        this.popoverVisible = true;
        this.isDelayTriggered = false;
        DOM.queueUpdate(this.setRegionProps);
    };

    /**
     * hides the popover
     */
    private hidePopover = (): void => {
        if (!this.popoverVisible) {
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
        document.removeEventListener("click", this.handleDocumentClick);

        document.removeEventListener("focusin", this.handleDocumentFocus);
        if (this.focusTargetOnDismiss) {
            this.refocusOnTarget();
        }
        this.popoverVisible = false;
        this.clearDelayTimer();
    };

    /**
     * updates the popover anchored region props after it has been
     * added to the DOM
     */
    private setRegionProps = (): void => {
        if (!this.popoverVisible) {
            return;
        }
        this.viewportElement = document.body;
        this.region.viewportElement = this.viewportElement;
        this.region.anchorElement = this.targetElement;
        (this.region as any).addEventListener(
            "positionchange",
            this.handlePositionChange
        );
        (this.region as any).addEventListener("loaded", this.handleAnchoredRegionLoaded);
    };

    /**
     * trap focus in popover
     */
    private trapFocusChanged = (): void => {
        this.tabbableElements = tabbable(this as Element);
        if (this.trapFocus) {
            document.addEventListener("focusin", this.handleDocumentFocus);

            if (this.shouldForceFocus(document.activeElement)) {
                if (this.tabbableElements.length === 0) {
                    this.popover.focus();
                    return;
                }
                if (this.tabbableElements.length) {
                    if (!this.checkAutofocus(this.tabbableElements)) {
                        this.focusFirstElement();
                    }
                }
            }
        } else {
            document.removeEventListener("focusin", this.handleDocumentFocus);
            if (this.tabbableElements.length) {
                this.checkAutofocus(this.tabbableElements);
            }
            // } else {
            //     document.removeEventListener("focusin", this.handleDocumentFocus);
        }
    };

    /**
     * check if elements contain an autofocus attribute
     */

    private checkAutofocus = (elements: HTMLElement[]) => {
        let autofocusFlag: boolean = false;
        elements.forEach((element: HTMLElement) => {
            if (element.hasAttribute("autofocus")) {
                element.focus();
                autofocusFlag = true;
                return;
            }
        });
        return autofocusFlag;
    };

    /**
     * focus on first element of tab queue
     */
    private focusFirstElement = (): void => {
        if (this.tabbableElements.length === 0) {
            this.popover.focus();
        } else {
            this.tabbableElements[0].focus();
        }
    };

    /**
     * Focus helper to take focus back to target once the popover is closed
     */
    private refocusOnTarget = () => {
        this.targetElement?.focus();
    };

    /**
     * we should only focus if focus has not already been brought to the popover
     */
    private shouldForceFocus = (currentFocusElement: Element | null): boolean => {
        return !this.hidden && !this.contains(currentFocusElement);
    };

    private onChildListChange(
        mutations: MutationRecord[],
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        observer: MutationObserver
    ): void {
        if (mutations!.length) {
            this.tabbableElements = tabbable(this as Element);
        }
    }

    private clearDelayTimer = (): void => {
        if (this.delayTimer !== null) {
            clearTimeout(this.delayTimer);
            this.delayTimer == null;
        }
    };
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface Popover extends ARIAGlobalStatesAndProperties {}
applyMixins(Popover, ARIAGlobalStatesAndProperties);
