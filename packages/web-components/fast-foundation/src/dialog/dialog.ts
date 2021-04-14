import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import { tabbable } from "tabbable";
import { FoundationElement } from "../foundation-element";

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#dialog | ARIA dialog }.
 *
 * @public
 */
export class Dialog extends FoundationElement {
    /**
     * Indicates the element is modal. When modal, user interaction will be limited to the contents of the element.
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

    /**
     * The start element of the internal tab queue
     *
     * @public
     * @remarks
     * HTML Attribute: tab-queue-start
     */
    @attr({ attribute: "tab-queue-start" })
    public tabQueueStart: string | HTMLElement | ((HTMLElement) => HTMLElement);

    /**
     * The end element of the internal tab queue
     *
     * @public
     * @remarks
     * HTML Attribute: tab-queue-end
     */
    @attr({ attribute: "tab-queue-end" })
    public tabQueueEnd: string | HTMLElement | ((HTMLElement) => HTMLElement);

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

        // Ensure the DOM is updated
        // This helps avoid a delay with `autofocus` elements receiving focus
        DOM.queueUpdate(this.trapFocusChanged);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();

        // remove keydown event listener
        document.removeEventListener("keydown", this.handleDocumentKeydown);

        // if we are trapping focus remove the focusin listener
        if (this.trapFocus) {
            document.removeEventListener("focusin", this.handleDocumentFocus);
        }
    }

    private trapFocusChanged = (): void => {
        if (this.trapFocus) {
            // Add an event listener for focusin events if we should be trapping focus
            document.addEventListener("focusin", this.handleDocumentFocus);

            // determine if we should move focus inside the dialog
            if (this.shouldForceFocus(document.activeElement)) {
                this.focusFirstElement();
            }
        } else {
            // remove event listener if we are not trapping focus
            document.removeEventListener("focusin", this.handleDocumentFocus);
        }
    };

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
        if (this.tabQueueStart === undefined) {
            return tabbable(this);
        }

        const bounds: HTMLElement[] = [];

        const boundStart: HTMLElement | null = this.resolveElementReference(
            this.tabQueueStart
        );
        if (boundStart !== null) {
            bounds.push(boundStart);
        }

        const boundEnd: HTMLElement | null = this.resolveElementReference(
            this.tabQueueEnd
        );
        if (boundEnd !== null) {
            bounds.push(boundEnd);
        }

        return bounds;
    };

    private resolveElementReference = (
        elementRef: string | HTMLElement | ((HTMLElement) => HTMLElement)
    ): HTMLElement | null => {
        if (typeof elementRef === "string") {
            return document.getElementById(elementRef);
        }

        if (typeof elementRef === "function") {
            return elementRef(this.dialog);
        }

        if (isHTMLElement(elementRef)) {
            return elementRef;
        }

        return null;
    };

    /**
     * focus on first element of tab queue
     */
    private focusFirstElement = (): void => {
        const bounds: (HTMLElement | SVGElement)[] = this.getTabQueueBounds();

        if (bounds.length > 0) {
            bounds[0].focus();
        }
    };

    /**
     * we should only focus if focus has not already been brought to the dialog
     */
    private shouldForceFocus = (currentFocusElement: Element | null): boolean => {
        return !this.hidden && !this.contains(currentFocusElement);
    };
}
