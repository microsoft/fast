import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Option } from "../option";

interface ListboxMouseEvent extends MouseEvent {
    target: Option;
}

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @public
 */
export class Listbox extends FASTElement {
    /**
     * Disables the radio group and child radios.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ attribute: "disabled", mode: "boolean" })
    public disabled: boolean;
    private disabledChanged(): void {
        if (this.listboxItems !== undefined) {
            this.listboxItems.forEach((option: Option) => {
                if (this.disabled) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            });
        }
    }

    @observable
    public activeDescendent: string;

    @observable
    public focusable: boolean = false;

    @observable
    private focusedOptionIndex: number;
    private focusedOptionIndexChanged(oldValue, newValue): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        this.listboxItems.forEach(el => (el.selected = false));

        const focusedOption = this.listboxItems[newValue];
        focusedOption.selected = true;
        this.activeDescendent = focusedOption.id;
        focusedOption.focus();
    }

    /**
     * When true, the child options will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        if (this.listboxItems) {
            this.listboxItems.forEach((option: Option): void => {
                if (this.readOnly) {
                    option.readOnly = true;
                } else {
                    option.readOnly = false;
                }
            });
        }
    }

    /**
     * @internal
     */
    private listboxItems: Option[];

    /**
     * @internal
     */
    private listboxItemsCount: number;

    /**
     * @internal
     */
    @observable
    public items: Element[];
    private itemsChanged(oldValue, newValue): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.listboxItems = newValue.filter(
            (n: Option) =>
                n.nodeType === Node.ELEMENT_NODE &&
                n.getAttribute("role") === "option" &&
                !n.disabled
        );
        this.listboxItemsCount = this.listboxItems.length;
        this.setupOptions();
    }

    private setupOptions(): void {
        this.listboxItems.forEach((o, i) => (o.id = `option-${i}`));
        this.focusedOptionIndex = 0;
    }

    constructor() {
        super();
        this.addEventListener("keydown", this.keydownHandler);
        this.addEventListener("click", this.clickHandler);
        this.addEventListener("keypress", this.keypressHandler);
        this.addEventListener("focusout", this.focusOutHandler);
        this.addEventListener("focusin", this.handleFocus);
    }

    private focusOutHandler = (e: FocusEvent) => {
        console.log(e);
    };

    private keypressHandler = (e: KeyboardEvent): void => {
        const captured: Option | null = e.target as Option;
        if (captured) {
            captured.setAttribute("tabindex", captured.selected ? "0" : "-1");
        }
    };

    public handleFocus = (e: Event): void => {
        if (e.target !== e.currentTarget) {
            return;
        }

        // this.$emit("selected-change", e);

        this.focusable = true;

        const focusedOption = this.getFocusedOption();

        focusedOption.focus();
    };

    private getFocusedOption() {
        return this.listboxItems[this.focusedOptionIndex || 0];
    }

    public handleBlur = (e: FocusEvent): void => {
        if (e.target !== e.currentTarget) {
            return;
        }

        this.focusable = false;
    };

    public keydownHandler = (e: KeyboardEvent) => {
        if (!e.key) {
            return;
        }

        const keyCode = e.key || e.key.charCodeAt(0);
        console.log(keyCode);

        switch (keyCode) {
            case "Enter":
                // changes the selected state of the current option and updates
                // the select value property
                break;

            case "ArrowUp":
                e.preventDefault();
                // moves focus to the previous option in the listbox
                if (this.focusedOptionIndex > 0) {
                    this.focusedOptionIndex -= 1;
                }
                break;

            case "ArrowDown":
                e.preventDefault();
                // moves focus to the next option in the listbox
                if (this.focusedOptionIndex < this.listboxItemsCount - 1) {
                    this.focusedOptionIndex += 1;
                }
                break;

            default:
                return;
        }
    };

    public clickHandler = (e: ListboxMouseEvent): void => {
        const captured = e.target.closest("[role='option']");

        if (this.disabled || this.readOnly || !captured) {
            return;
        }

        const selectedIndex = this.listboxItems.findIndex(el => el.isEqualNode(captured));
        if (selectedIndex !== -1) {
            this.focusedOptionIndex = selectedIndex;
        }
    };
}
