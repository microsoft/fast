import { attr, FastElement } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import tabbable from "tabbable";

export class Dialog extends FastElement {
    @attr
    public modal: boolean = true;

    @attr
    public hidden: boolean = false;

    @attr({ attribute: "trap-focus" })
    public trapFocus: boolean = true;

    @attr({ attribute: "aria-describedby" })
    public ariaDescribedby: string;

    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

    public root: HTMLDivElement;

    public dismiss(): void {
        this.dispatchEvent(
            new CustomEvent("dismiss", {
                bubbles: true,
                composed: true,
            })
        );
    }

    public connectedCallback(): void {
        super.connectedCallback();

        document.addEventListener("keydown", this.handleDocumentKeydown);

        if (this.trapFocus) {
            document.addEventListener("focusin", this.handleDocumentFocus);

            if (this.shouldForceFocus(document.activeElement)) {
                this.focusFirstElement();
            }
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        document.removeEventListener("keydown", this.handleDocumentKeydown);
    }

    private handleDocumentKeydown(e: KeyboardEvent): void {
        if (!e.defaultPrevented && !this.hidden) {
            switch (e.keyCode) {
                case keyCodeEscape:
                    this.dismiss();
                    break;

                case keyCodeTab:
                    this.handleTabKeyDown(e);
                    break;
            }
        }
    }

    private handleDocumentFocus(e: Event): void {
        if (!e.defaultPrevented && this.shouldForceFocus(e.target as HTMLElement)) {
            this.focusFirstElement();
            e.preventDefault();
        }
    }

    private handleTabKeyDown(e: KeyboardEvent): void {
        if (!this.trapFocus) {
            return;
        }

        const tabbableElements: HTMLElement[] = tabbable(this.root);
        const tabbableElementCount: number = tabbableElements.length;

        if (tabbableElementCount === 0) {
            this.root.focus();
            e.preventDefault();
            return;
        }

        if (e.shiftKey && e.target === tabbableElements[0]) {
            tabbableElements[tabbableElementCount - 1].focus();
            e.preventDefault();
        } else if (
            !e.shiftKey &&
            e.target === tabbableElements[tabbableElementCount - 1]
        ) {
            tabbableElements[0].focus();
            e.preventDefault();
        }
    }

    /**
     * focus on first element of tab queue
     */
    private focusFirstElement = (): void => {
        const tabbableElements: HTMLElement[] = tabbable(this.root);
        if (tabbableElements.length === 0) {
            this.root.focus();
        } else {
            tabbableElements[0].focus();
        }
    };

    /**
     * we should only focus if focus has not already been brought to the dialog
     */
    private shouldForceFocus = (currentFocusElement: Element | null): boolean => {
        return !this.hidden && this.root && !this.root.contains(currentFocusElement);
    };
}
