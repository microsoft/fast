import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Option, OptionRole } from "../option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @public
 */
export abstract class Listbox extends FASTElement {
    /**
     * Disables the radio group and child radios.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * The index of the selected option
     *
     * @public
     */
    public selectedIndex: number = -1;

    /**
     * A collection of the selected options
     *
     * @public
     */
    @observable
    public selectedOptions: Option[] = [];
    protected selectedOptionsChanged(prev: Option[] = [], next: Option[] = []) {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => (o.selected = next.includes(o)));
        }
    }

    /**
     * @param index - option index to select
     * @internal
     */
    protected setSelectedOption(index = this.selectedIndex): void {
        const selectedOption = this.options[index];
        if (!selectedOption) {
            return;
        }

        const selectedOptions: Option[] = [];

        this.options.forEach(el => {
            if (el.isSameNode(selectedOption)) {
                selectedOptions.push(el);
            }
        });

        this.selectedIndex = index;
        this.selectedOptions = selectedOptions;
        this.ariaActiveDescendant = this.firstSelectedOption.id;
    }

    /**
     * @internal
     */
    public get firstSelectedOption(): Option {
        return this.selectedOptions[0];
    }

    /**
     * A static filter to include only enabled elements
     * @param n - element to filter
     * @public
     */
    public static slottedOptionFilter = (n: Option) =>
        n.nodeType === Node.ELEMENT_NODE &&
        n.getAttribute("role") === OptionRole.option &&
        !n.disabled;

    /**
     * @internal
     */
    @observable
    public options: Option[] = [];
    protected optionsChanged(prev: Option[], next: Option[]): void {
        if (this.$fastController.isConnected) {
            next.forEach((el, i) => (el.id = `${OptionRole.option}-${i}`));
        }
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
    private setDefaultSelectedOption(): void {
        let selectedIndex = this.options.findIndex(el => el.selected);
        selectedIndex = selectedIndex !== -1 ? selectedIndex : 0;
        this.setSelectedOption(selectedIndex);
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
    public keydownHandler(e: KeyboardEvent): void | boolean {
        const keyCode = e.key || e.key.charCodeAt(0);

        switch (keyCode) {
            case "ArrowUp": {
                // Select the previous selectable option
                e.preventDefault();
                this.selectPreviousOption();
                this.focusAndScrollOptionIntoView();
                break;
            }

            case "ArrowDown": {
                // Select the next selectable option
                e.preventDefault();
                this.selectNextOption();
                this.focusAndScrollOptionIntoView();
                break;
            }

            case "End": {
                // Select the last available option
                e.preventDefault();
                this.selectLastOption();
                this.focusAndScrollOptionIntoView();
                break;
            }

            case "Home":
                // Select the first available option
                e.preventDefault();
                this.selectFirstOption();
                this.focusAndScrollOptionIntoView();
                break;

            case "Tab":
                this.focusAndScrollOptionIntoView();
                break;

            case "Enter":
            case "Escape":
                break;

            default:
                this.handleTypeAhead(keyCode);
        }

        return true;
    }

    /**
     * Moves focus to the first selectable option
     *
     * @internal
     */
    public selectFirstOption(): void {
        if (!this.disabled) {
            this.setSelectedOption(0);
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
     * Moves focus to the last selectable option
     * @internal
     */
    public selectLastOption(): void {
        if (!this.disabled) {
            this.setSelectedOption(this.options.length - 1);
        }
    }

    /**
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        // do nothing if the listbox is disabled
        if (this.disabled) {
            return;
        }

        const captured = (e.target as HTMLElement).closest(
            `[role=${OptionRole.option}]`
        ) as Option;
        if (captured && !captured.disabled) {
            const selectedIndex = this.options.findIndex(el => el.isEqualNode(captured));
            this.setSelectedOption(selectedIndex);
            return true;
        }

        return;
    }

    /**
     * @internal
     */
    private focusAndScrollOptionIntoView(): void {
        if (this.contains(document.activeElement)) {
            this.firstSelectedOption.focus();
            this.firstSelectedOption.scrollIntoView({ block: "center" });
        }
    }

    /**
     * Move focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param typedKey - the key to be evaluated
     */
    private typeAheadBuffer: string = "";

    private typeaheadTimeout: number = -1;

    private typeAheadExpired: boolean = false;

    private static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;

    public handleTypeAhead(typedKey) {
        if (this.typeaheadTimeout) {
            window.clearTimeout(this.typeaheadTimeout);
        }

        this.typeaheadTimeout = window.setTimeout(
            () => (this.typeAheadExpired = true),
            Listbox.TYPE_AHEAD_TIMEOUT_MS
        );

        if (typedKey.length > 1) {
            return;
        }

        if (this.typeAheadExpired) {
            this.typeAheadBuffer = "";
        }

        this.typeAheadBuffer = `${this.typeAheadBuffer}${typedKey}`;

        const pattern = `^(${this.typeAheadBuffer.replace(
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
export class DelegatesARIAListbox extends ARIAGlobalStatesAndProperties {
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

/**
 * @internal
 */
export interface Listbox extends DelegatesARIAListbox {}
applyMixins(Listbox, DelegatesARIAListbox);
