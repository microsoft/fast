import { attr, DOM, observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { Option } from "../option/option";
import { Listbox } from "../listbox/listbox";

/**
 * A Select Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#select | ARIA select }.
 *
 * @public
 */
export class Select extends FormAssociated<HTMLSelectElement> {
    protected proxy: HTMLSelectElement = document.createElement("select");

    @attr
    public autocomplete: string = "off";

    @attr({ attribute: "autofocus", mode: "boolean" })
    public autofocus: boolean = false;

    /**
     * The open attribute
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean;
    private openChanged(): void {
        if (this.$fastController.isConnected) {
            this.button.setAttribute("aria-expanded", `${this.open}`);

            if (this.open) {
                this.listbox.focusFirstSelectedOption();
            }
        }
    }

    /**
     * The container for the indicator icon.
     * @internal
     */
    @observable
    public indicatorContainer: HTMLElement;

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * @internal
     */
    @observable
    public listbox: Listbox;

    /**
     * @internal
     */
    @observable
    public options: Option[];

    /**
     * The value displayed on the button
     * @public
     */
    @observable
    public displayValue: string;

    /**
     * The button element that displays the selected value and triggers the visibility of the listbox.
     * @public
     */
    @observable
    public button: HTMLElement;

    /**
     * The slot that holds the contents of the button
     * @public
     */
    @observable
    public slottedButtonContainer: Node[];

    /**
     * Update the value and display value when the listbox emits a change event.
     * @param e - Event object
     */
    private listboxChangeHandler = (e: Event): void => {
        const captured = e.target as Option;
        this.value = captured.value;
    };

    protected valueChanged(previous: string, next: string): void {
        super.valueChanged(previous, next);
        DOM.queueUpdate(() => {
            const selectedOption = this.listbox.selectedOption;
            this.displayValue = selectedOption.textContent || selectedOption.value;
        });
    }

    private updateForm(): void {
        const value = this.value ? this.value : null;
        this.setFormValue(value, value);
    }

    public keydownHandler = (e: KeyboardEvent): void => {
        super.keypressHandler(e);

        const keyCode = e.key || e.key.charCodeAt(0);

        if (keyCode === "Escape") {
            this.open = false;
            DOM.queueUpdate(() => this.button.focus());
            return;
        }

        if ([" ", "Enter"].includes(`${keyCode}`)) {
            e.preventDefault();
            e.stopPropagation();

            if (!this.disabled) {
                this.open = !this.open;
            }

            if (this.open) {
                this.listbox.focusFirstSelectedOption();
            } else {
                DOM.queueUpdate(() => this.button.focus());
            }

            return;
        }

        // Pass the event to the listbox
        if (!e.defaultPrevented) {
            DOM.queueUpdate(() => {
                e.preventDefault();
                this.listbox.dispatchEvent(e);
            });
        }
    };

    public focusoutHandler = (e: FocusEvent): void => {
        const focusTarget = e.relatedTarget as HTMLElement;

        if (!this.open) {
            return;
        }

        if (this.isSameNode(focusTarget)) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }

        if (!this.listbox.listboxItems.includes(focusTarget as Option)) {
            e.stopPropagation();
            this.open = false;

            if (!focusTarget) {
                DOM.queueUpdate(() => this.button.focus());
            }
        }
    }

    public clickHandler = (e: MouseEvent): void => {
        if (this.disabled) {
            return;
        }

        this.open = !this.open;

        if (this.open) {
            this.listbox.focusFirstSelectedOption();
            return;
        }

        DOM.queueUpdate(() => this.button.focus());
    };

    @observable
    public selectedValue: HTMLElement;
    /**
     * This will update the text that is in the select's
     * button by default that renders the selected value
     *
     * @param value - This is the value for the <option>
     */
    private updateSelectValue(value: string) {
        this.value = value;
        if (this.selectedValue) {
            this.selectedValue.textContent = value;
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.options = this.listbox.listboxItems;

        this.button.setAttribute("aria-haspopup", "listbox");
        this.button.setAttribute("aria-expanded", this.open ? "true" : "false");
        this.button.setAttribute("role", "button");
        this.button.addEventListener("mousedown", this.clickHandler);

        this.addEventListener("keydown", this.keydownHandler);
        this.addEventListener("focusout", this.focusoutHandler);

        this.listbox.addEventListener("change", this.listboxChangeHandler);
        this.listbox.addEventListener("click", this.clickHandler);

        this.updateForm();
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface Select extends StartEnd {}
applyMixins(Select, StartEnd);