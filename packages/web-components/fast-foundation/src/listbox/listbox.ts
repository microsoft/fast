import { uniqueId } from "lodash-es";
import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { ListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { applyMixins } from "../utilities/apply-mixins";
import { ListboxRole } from "./listbox.options";

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @public
 */
export class Listbox extends FASTElement {
    /**
     * The index of the selected option
     *
     * @public
     */
    public selectedIndex: number = -1;

    /**
     * Typeahead timeout in milliseconds.
     *
     * @internal
     */
    private static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;

    /**
     * @internal
     */
    private typeaheadBuffer: string = "";

    /**
     * @internal
     */
    private typeaheadTimeout: number = -1;

    /**
     * Flag for the typeahead timeout expiration.
     *
     * @internal
     */
    protected typeAheadExpired: boolean = true;

    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    @attr
    public role: string = ListboxRole.listbox;

    /**
     * The disabled state of the listbox.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * @internal
     */
    @observable
    public options: ListboxOption[] = [];
    public optionsChanged(prev, next): void {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => (o.id = o.id || uniqueId("option-")));
        }
    }

    /**
     * A collection of the selected options
     *
     * @public
     */
    @observable
    public selectedOptions: ListboxOption[] = [];
    protected selectedOptionsChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => (o.selected = next.includes(o)));
        }
    }

    /**
     * @internal
     */
    public get firstSelectedOption(): ListboxOption {
        return this.selectedOptions[0];
    }

    /**
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback();
        DOM.queueUpdate(() => this.setDefaultSelectedOption());
    }

    /**
     * @internal
     */
    protected focusAndScrollOptionIntoView(): void {
        if (
            this.$fastController.isConnected &&
            this.contains(document.activeElement) &&
            this.firstSelectedOption
        ) {
            this.firstSelectedOption.focus();
            this.firstSelectedOption.scrollIntoView({ block: "nearest" });
        }
    }

    /**
     * @internal
     */
    public focusinHandler(e: FocusEvent): void {
        if (e.target === e.currentTarget) {
            this.setSelectedOption();
            this.focusAndScrollOptionIntoView();
        }
    }

    /**
     * @internal
     */
    protected setDefaultSelectedOption(): void {
        let selectedIndex = this.options.findIndex(el => el.selected);
        selectedIndex = selectedIndex !== -1 ? selectedIndex : 0;
        this.setSelectedOption(selectedIndex);
    }

    /**
     * Sets an option as selected and gives it focus.
     *
     * @param index - option index to select
     * @public
     */
    public setSelectedOption(index: number = this.selectedIndex): void {
        const selectedOption = this.options[index];
        if (!selectedOption) {
            return;
        }

        const selectedOptions: ListboxOption[] = [];

        this.options.forEach(el => {
            if (el.isSameNode(selectedOption)) {
                selectedOptions.push(el);
            }
        });

        this.selectedIndex = index;
        this.selectedOptions = selectedOptions;
        this.ariaActiveDescendant = this.firstSelectedOption.id;
        this.focusAndScrollOptionIntoView();
    }

    /**
     * A static filter to include only enabled elements
     *
     * @param n - element to filter
     * @public
     */
    public static slottedOptionFilter = (n: ListboxOption) =>
        n.nodeType === Node.ELEMENT_NODE &&
        n.getAttribute("role") === "option" &&
        !n.disabled;

    /**
     * Moves focus to the first selectable option
     *
     * @public
     */
    public selectFirstOption(): void {
        if (!this.disabled) {
            this.setSelectedOption(0);
        }
    }

    /**
     * Moves focus to the last selectable option
     *
     * @internal
     */
    public selectLastOption(): void {
        if (!this.disabled) {
            this.setSelectedOption(this.options.length - 1);
        }
    }

    /**
     * Moves focus to the next selectable option
     *
     * @internal
     */
    public selectNextOption(): void {
        if (!this.disabled && this.selectedIndex < this.options.length - 1) {
            this.setSelectedOption(this.selectedIndex + 1);
        }
    }

    /**
     * Moves focus to the previous selectable option
     *
     * @internal
     */
    public selectPreviousOption(): void {
        if (!this.disabled && this.selectedIndex > 0) {
            this.setSelectedOption(this.selectedIndex - 1);
        }
    }

    /**
     * Handles click events for listbox options
     *
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        const captured = (e.target as HTMLElement).closest(
            `[role=option]`
        ) as ListboxOption;

        if (captured && !captured.disabled) {
            const selectedIndex = this.options.findIndex(el => el.isEqualNode(captured));
            this.setSelectedOption(selectedIndex);
            return true;
        }
    }

    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
        if (this.disabled) {
            return true;
        }

        const key = e.key || e.key.charCodeAt(0);

        switch (key) {
            // Select the first available option
            case "Home": {
                e.preventDefault();
                this.selectFirstOption();
                break;
            }

            // Select the next selectable option
            case "ArrowDown": {
                e.preventDefault();
                this.selectNextOption();
                break;
            }

            // Select the previous selectable option
            case "ArrowUp": {
                e.preventDefault();
                this.selectPreviousOption();
                break;
            }

            // Select the last available option
            case "End": {
                e.preventDefault();
                this.selectLastOption();
                break;
            }

            case "Tab": {
                this.focusAndScrollOptionIntoView();
                // fall through
            }

            case "Enter":
            case "Escape": {
                return true;
            }

            case " ": {
                if (this.typeAheadExpired) {
                    return true;
                }
            }

            // Send key to Typeahead handler
            default: {
                this.handleTypeAhead(key);
                return true;
            }
        }
    }

    /**
     * Move focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param key - the key to be evaluated
     */
    public handleTypeAhead(key): void {
        if (this.typeaheadTimeout) {
            window.clearTimeout(this.typeaheadTimeout);
        }

        this.typeaheadTimeout = window.setTimeout(
            () => (this.typeAheadExpired = true),
            Listbox.TYPE_AHEAD_TIMEOUT_MS
        );

        if (key.length > 1) {
            return;
        }

        if (this.typeAheadExpired) {
            this.typeaheadBuffer = "";
        }

        this.typeaheadBuffer += `${key}`;

        const pattern = `^(${this.typeaheadBuffer.replace(
            /[.*+\-?^${}()|[\]\\]/g,
            "\\$&"
        )})`;
        const re = new RegExp(pattern, "gi");

        const selectedIndex = this.options.findIndex(o => o.text!.trim().match(re));
        this.setSelectedOption(selectedIndex);

        this.typeAheadExpired = false;
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA button role
 *
 * @public
 */
export class DelegatesARIAListbox {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-pressed
     */
    @attr({ attribute: "aria-pressed", mode: "fromView" })
    public ariaPressed: "true" | "false" | "mixed" | undefined;

    @observable
    public ariaActiveDescendant: string = "";

    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @observable
    public ariaExpanded: "true" | "false" | undefined;
}

applyMixins(DelegatesARIAListbox, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Listbox extends DelegatesARIAListbox, ARIAGlobalStatesAndProperties {}
applyMixins(Listbox, DelegatesARIAListbox);
