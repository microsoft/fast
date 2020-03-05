import { attr, FastElement } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import tabbable from "tabbable";

export class Dialog extends FastElement {
    @attr
    public modal: boolean = true;

    @attr // this should be boolean, but we do not yet have boolean support
    public hidden: boolean = false;

    @attr({ attribute: "trap-focus" })
    public trapFocus: boolean = true;

    @attr({ attribute: "aria-describedby" })
    public ariaDescribedby: string;

    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

    public dialog: HTMLDivElement;

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

        if (this.shouldDialogTrapFocus()) {
            document.addEventListener("focusin", this.handleDocumentFocus);

            if (this.shouldForceFocus(document.activeElement)) {
                this.focusFirstElement();
            }
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        document.removeEventListener("keydown", this.handleDocumentKeydown);

        if (this.shouldDialogTrapFocus()) {
            document.removeEventListener("focusin", this.handleDocumentFocus);
        }
    }

    private handleDocumentKeydown = (e: KeyboardEvent): void => {
        // remove as any here when we have boolean support
        if (!e.defaultPrevented && !this.isDialogHidden()) {
            switch (e.keyCode) {
                case keyCodeEscape:
                    this.dismiss();
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
        if (!this.shouldDialogTrapFocus()) {
            return;
        }

        const tabbableElements: HTMLElement[] = tabbable(this);
        const tabbableElementCount: number = tabbableElements.length;

        if (tabbableElementCount === 0) {
            this.dialog.focus();
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
    };

    /**
     * focus on first element of tab queue
     */
    private focusFirstElement = (): void => {
        const tabbableElements: HTMLElement[] = tabbable(this);

        if (tabbableElements.length === 0) {
            this.dialog.focus();
        } else {
            tabbableElements[0].focus();
        }
    };

    /**
     * we should only focus if focus has not already been brought to the dialog
     */
    private shouldForceFocus = (currentFocusElement: Element | null): boolean => {
        return !this.isDialogHidden() && !this.contains(currentFocusElement);
    };

    /**
     * TODO: Issue #2742 - https://github.com/microsoft/fast-dna/issues/2742
     * This is a placeholder function to check if the hidden attribute is present
     * Currently there is not support for boolean attributes.
     * Once support is added, we will simply use this.hidden.
     */
    private isDialogHidden(): boolean {
        return typeof this.hidden !== "boolean";
    }

    /**
     * TODO: Issue #2742 - https://github.com/microsoft/fast-dna/issues/2742
     * This is a placeholder function to check if the trapFocus attribute is present
     * Currently there is not support for boolean attributes.
     * Once support is added, we will simply use this.trapFocus.
     */
    private shouldDialogTrapFocus(): boolean {
        return typeof this.trapFocus !== "boolean";
    }
}
