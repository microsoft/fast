import { attr, DOM, Notifier, Observable } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import { isTabbable } from "tabbable";
import { FoundationElement } from "../foundation-element";

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#dialog | ARIA dialog }.
 *
 * @public
 */
export class Dialog extends FoundationElement {
    /**
     * Indicates the element is modal. When modal, user mouse interaction will be limited to the contents of the element by a modal
     * overlay.  Clicks on the overlay will cause the dialog to emit a "dismiss" event.
     * @public
     * @defaultValue - true
     * @remarks
     * HTML Attribute: modal
     */
    @attr({ mode: "boolean" })
    public modal: boolean = true;

    /**
     * The hidden state of the element.
     *
     * @public
     * @defaultValue - false
     * @remarks
     * HTML Attribute: hidden
     */
    @attr({ mode: "boolean" })
    public hidden: boolean = false;

    /**
     * Indicates that the dialog should trap focus.
     *
     * @public
     * @defaultValue - true
     * @remarks
     * HTML Attribute: trap-focus
     */
    @attr({ attribute: "trap-focus", mode: "boolean" })
    public trapFocus: boolean = true;
    private trapFocusChanged = (): void => {
        if ((this as FoundationElement).$fastController.isConnected) {
            this.updateTrapFocus();
        }
    };

    /**
     * The id of the element describing the dialog.
     * @public
     * @remarks
     * HTML Attribute: aria-describedby
     */
    @attr({ attribute: "aria-describedby" })
    public ariaDescribedby: string;

    /**
     * The id of the element labeling the dialog.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

    /**
     * @internal
     */
    public dialog: HTMLDivElement;

    /**
     * @internal
     */
    private isTrappingFocus: boolean = false;

    /**
     * @internal
     */
    private notifier: Notifier;

    /**
     * @internal
     */
    public dismiss(): void {
        this.$emit("dismiss");
    }

    /**
     * The method to show the dialog.
     *
     * @public
     */
    public show(): void {
        this.hidden = false;
    }

    /**
     * The method to hide the dialog.
     *
     * @public
     */
    public hide(): void {
        this.hidden = true;
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        document.addEventListener("keydown", this.handleDocumentKeydown);
        this.notifier = Observable.getNotifier(this);
        this.notifier.subscribe(this, "hidden");
        this.updateTrapFocus();
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        // remove keydown event listener
        document.removeEventListener("keydown", this.handleDocumentKeydown);

        // if we are trapping focus remove the focusin listener
        this.updateTrapFocus(false);

        this.notifier.unsubscribe(this, "hidden");
    }

    /**
     * @internal
     */
    public handleChange(source: any, propertyName: string) {
        switch (propertyName) {
            case "hidden":
                this.updateTrapFocus();
                break;
            default:
                break;
        }
    }

    private handleDocumentKeydown = (e: KeyboardEvent): void => {
        if (!e.defaultPrevented && !this.hidden) {
            switch (e.keyCode) {
                case keyCodeEscape:
                    this.dismiss();
                    e.preventDefault();
                    break;

                case keyCodeTab:
                    this.handleTabKeyDown(e);
                    break;
            }
        }
    };

    private handleDocumentFocus = (e: Event): void => {
        if (!e.defaultPrevented && this.shouldForceFocus(e.target as HTMLElement)) {
            this.focusFirstElement();
            e.preventDefault();
        }
    };

    private handleTabKeyDown = (e: KeyboardEvent): void => {
        if (!this.trapFocus || this.hidden) {
            return;
        }

        const bounds: (HTMLElement | SVGElement)[] = this.getTabQueueBounds();

        if (bounds.length === 0) {
            return;
        }

        if (bounds.length === 1) {
            // keep focus on single element
            bounds[0].focus();
            e.preventDefault();
            return;
        }

        if (e.shiftKey && e.target === bounds[0]) {
            bounds[bounds.length - 1].focus();
            e.preventDefault();
        } else if (!e.shiftKey && e.target === bounds[bounds.length - 1]) {
            bounds[0].focus();
            e.preventDefault();
        }

        return;
    };

    private getTabQueueBounds = (): (HTMLElement | SVGElement)[] => {
        const bounds: HTMLElement[] = [];

        return Dialog.reduceTabbableItems(bounds, this);
    };

    /**
     * focus on first element of tab queue
     */
    private focusFirstElement = (): void => {
        const bounds: (HTMLElement | SVGElement)[] = this.getTabQueueBounds();

        if (bounds.length > 0) {
            bounds[0].focus();
        } else {
            if (this.dialog instanceof HTMLElement) {
                this.dialog.focus;
            }
        }
    };

    /**
     * we should only focus if focus has not already been brought to the dialog
     */
    private shouldForceFocus = (currentFocusElement: Element | null): boolean => {
        return this.isTrappingFocus && !this.contains(currentFocusElement);
    };

    /**
     * we should we be active trapping focus
     */
    private shouldTrapFocus = (): boolean => {
        return this.trapFocus && !this.hidden;
    };

    /**
     *
     *
     * @internal
     */
    private updateTrapFocus = (shouldTrapFocusOverride?: boolean): void => {
        const shouldTrapFocus =
            shouldTrapFocusOverride === undefined
                ? this.shouldTrapFocus()
                : shouldTrapFocusOverride;

        if (shouldTrapFocus && !this.isTrappingFocus) {
            this.isTrappingFocus = true;
            // Add an event listener for focusin events if we are trapping focus
            document.addEventListener("focusin", this.handleDocumentFocus);
            DOM.queueUpdate(() => {
                if (this.shouldForceFocus(document.activeElement)) {
                    this.focusFirstElement();
                }
            });
        } else if (!shouldTrapFocus && this.isTrappingFocus) {
            this.isTrappingFocus = false;
            // remove event listener if we are not trapping focus
            document.removeEventListener("focusin", this.handleDocumentFocus);
        }
    };

    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    private static reduceTabbableItems(
        elements: HTMLElement[],
        element: FoundationElement & HTMLElement
    ) {
        if (element.getAttribute("tabindex") === "-1") {
            return elements;
        }

        if (
            isTabbable(element) ||
            (Dialog.isFocusableFastElement(element) && Dialog.hasTabbableShadow(element))
        ) {
            elements.push(element);
            return elements;
        }

        if (element.childElementCount) {
            return elements.concat(
                Array.from(element.children).reduce(Dialog.reduceTabbableItems, [])
            );
        }

        return elements;
    }

    /**
     * Test if element is focusable fast element
     *
     * @param element - The element to check
     *
     * @internal
     */
    private static isFocusableFastElement(
        element: FoundationElement & HTMLElement
    ): boolean {
        return !!element.$fastController?.definition.shadowOptions?.delegatesFocus;
    }

    /**
     * Test if the element has a focusable shadow
     *
     * @param element - The element to check
     *
     * @internal
     */
    private static hasTabbableShadow(element: FoundationElement & HTMLElement) {
        return Array.from(element.shadowRoot?.querySelectorAll("*") ?? []).some(x => {
            return isTabbable(x);
        });
    }
}
