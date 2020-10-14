import { attr, observable } from "@microsoft/fast-element";
import { KeyCodes, wrapInBounds } from "@microsoft/fast-web-utilities";
import { FormAssociated } from "../form-associated/index";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { Option } from "../option/option";

export class Select extends FormAssociated<HTMLInputElement> {
    protected proxy: HTMLInputElement;
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element

    @attr({ attribute: "multiple", mode: "boolean" })
    public multiple: boolean;

    @attr({ attribute: "open", mode: "boolean" })

    @observable
    public open: boolean;
    private openChanged() {
        this.updateButtonPartAttr();
    }

    @observable
    public defaultSlottedNodes: Node[];

    @observable
    public button: HTMLElement;

    @observable
    public selectedValue: HTMLElement;

    /**
     * @internal
     */
    @observable
    public listbox: HTMLElement[];
    private listboxChanged() {
        if (this.$fastController.isConnected) {
            this.applyListboxControllerCode();
        }
    }

    /**
     * @internal
     */
    @observable
    public options: Option[];
    private optionsChanged() {
        if (this.$fastController.isConnected) {
            //
        }
    }

    // TODO: This needs to change to support multiple values
    public value: string = "Selected Value"; // Map to proxy element.
    public valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    private activeOptionIndex: number = 0;

    /**
     * Set to true when the component has constructed
     */
    private constructed: boolean = false;

    constructor() {
        super();
        this.constructed = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.registerButtonSlotChange();

        // We won't get a slotchange for event for parts that were not replaced
        // by user-provided parts, so apply their controller code here.
        this.applyButtonControllerCode();
        this.applyListboxControllerCode();

        this.updateForm();
    }

    private updateForm(): void {
        //
    }


    public keypressHandlerButton = (e: KeyboardEvent): void => {
        super.keypressHandler(e);
        switch (e.keyCode) {
            case KeyCodes.space:
                this.open = !this.open;
                console.log("Call one")
                setTimeout(() => this.setFocusOnOption(), 0);
                break;
            case KeyCodes.enter:
                this.open = !this.open;
                console.log("Call two")
                setTimeout(() => this.setFocusOnOption(), 0);
                e.preventDefault(); // Enter also causes 'click' to fire for <button>s.  Prevent that so we don't immediately revert the change to this.open.
                break;
            case KeyCodes.tab:
                this.setFocusOnOption();
                break;
        }
    }

    /**
     * Handle keyboard interactions for listbox
     */
    public keypressHandlerListbox = (e: KeyboardEvent): void => {
        super.keypressHandler(e);

        // Don't scroll the page for arrow keys, and spacebar.
        e.preventDefault();
        switch (e.keyCode) {
            case KeyCodes.arrowDown:
                this.adjust(1)
                break;
            case KeyCodes.arrowUp:
                this.adjust(-1)
                break;
            case KeyCodes.enter:
                this.value = this.options[this.activeOptionIndex].value;
                console.log("Fire Enter", this.activeOptionIndex);
                this.options[this.activeOptionIndex].selected = true;
                this.optionSelectionChange(this.options[this.activeOptionIndex].value);
                break;
            case KeyCodes.escape:
                this.options[this.activeOptionIndex].removeAttribute('current');
                this.open = !this.open;
                console.log("Call three")
                break;
            // Handle type ahead mode
            default:
                if (/^.$/.test(e.key)) {
                    this.handleTypeAhead(e.key);
                }
                break;
        }
    };

    /**
     * Set state to closed when focus moves away from the listbox ("light dismiss").
     * With this implementation, clicking on non-focusable content inside
     * the listbox will cause it to close (e.relatedTarget will be null).
     * This issue is not trivially remedied (see https://github.com/WICG/open-ui/issues/137).
     * But, this behavior works sufficiently well for the current set of examples.
     */
    public focusoutHandlerListbox = (e: FocusEvent): void => {
        const elementReceivingFocus = e.relatedTarget as HTMLElement;
        if (this.listbox === undefined) {
            return
        }
        if (this.open && (!elementReceivingFocus || !this.listbox[0].contains(elementReceivingFocus))) {
            this.open = false;
        }
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent): void => {
        if (!this.disabled && !this.readOnly) {
            this.open = !this.open;
            setTimeout(() => this.setFocusOnOption(), 0);
        }
    };

    /**
     * This will only allow a selection of multiple values if the
     * multiple attribute is set
     */
    public handleMultiple = (value: string): void => {
        if (!this.multiple) {
            this.options.forEach(element => {
                if (element.value != this.value && element.selected) {
                    element.selected = false;
                }
            });
        }
    }

    /**
     * Will set focus to the necessary element
     * TODO: This will probably get removed by moveOption
     */
    public setFocusOnOption = (optionToFocus = null): void => {
        //this.getFirstSelectedOption();
        if(this.open) {
            console.log("Calls");
            this.getFirstSelectedOption();
            this.options[this.activeOptionIndex].focus();
        }
    }

    public adjust(adjustment: number): void {
        this.activeOptionIndex = wrapInBounds(
            0,
            this.options.length - 1,
            this.activeOptionIndex + adjustment
        );
        this.options[this.activeOptionIndex].focus();
    }

    public updateButtonPartAttr(): void {
        if(!this.button) {
            return
        }

        switch(this.open) {
            case true:
                this.button.setAttribute('aria-expanded', 'true');
                break;
            case false:
                this.button.setAttribute('aria-expanded', 'false');
                break;
        }
    }

    /**
     * This will update the text that is in the select's
     * button by default that renders the selected value
     *
     * @param value - This is the value for the <option>
     */
    private updateSelectValue(value: string) {
        this.value = value;
        if (this.selectedValue) this.selectedValue.textContent = value;
    }

    private getFirstSelectedOption(): Option | null {
        const selectedOption: Option | undefined = this.options.find(x => x.selected);
        if (selectedOption) {
            this.activeOptionIndex = Array.from(this.options).indexOf(selectedOption);
        }
        return selectedOption || null
    }

    /**
     * When a user clicks on an option we need to update the known
     * parts of
     * - currently selected value
     * - array of values
     */
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public optionSelectionChange(value: string): void {
        this.handleMultiple(value);

        this.options.forEach(element  => {
            if (element.value != value) {
                const el: any = element;
                el.removeAttribute('current');
                this.activeOptionIndex = Array.from(this.options).indexOf(element);
            }
        });

        this.updateSelectValue(value);
        this.typeAheadValue = '';
        this.open = !this.open;
        console.log("Call six")
        // Focus back on the select when menu closes
        this.button.focus()
    }

    /**
     * When the author leverages the slot we need to ensure that the a11y and
     * functionality that is tied to the given part still function as designed
     */
    public registerButtonSlotChange(): void {
        const slot = this.shadowRoot!.querySelector("slot[name=button-container]");
        if (slot) {
            slot.addEventListener('slotchange', () => {
                this.applyButtonControllerCode();
            });
        }
    }

    private applyButtonControllerCode(): void {
        if (this.button) {
            console.log("This hits", this.button)
            this.button.setAttribute('tabindex', '0');
            this.button.setAttribute('aria-haspopup', 'listbox');
            this.button.setAttribute('aria-expanded', this.open ? 'true' : 'false');
            this.button.setAttribute('role', 'button');

            this.button.addEventListener('click', this.clickHandler);
            this.button.addEventListener('keydown', this.keypressHandlerButton);
        }
    }

    private applyListboxControllerCode(): void {
        this.listbox.forEach((listbox: HTMLElement, index: number) => {
            listbox.setAttribute("role", "listbox");
            listbox.addEventListener("keydown", this.keypressHandlerListbox);
            listbox.addEventListener("focusout", this.focusoutHandlerListbox);
        })
    }

    private regexEscape(str) {
        return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    /**
     * Move focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param typedKey - the key to be evaluated
     */
    private typeAheadValue: string = '';
    private typeAheadTimeoutHandler: number = -1;
    private typeAheadExpired: boolean = false;
    private static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;
    public handleTypeAhead(typedKey) {
        // For every keystroke, reset the timer that triggers when enough
        // time has elapsed such that the search should restart.
        window.clearTimeout(this.typeAheadTimeoutHandler);
        this.typeAheadTimeoutHandler = window.setTimeout(() => {
            this.typeAheadExpired = true;
        }, Select.TYPE_AHEAD_TIMEOUT_MS);

        if (this.typeAheadExpired) {
            this.typeAheadValue = '';
        }

        this.typeAheadValue = `${this.typeAheadValue}${typedKey}`;

        const focusedIndex = this.options.indexOf(document.activeElement as any);
        const searchStartOffset = this.typeAheadExpired ? 1 : 0;
        // Try to match first against options that come after the currently
        // selected option. If none of those match, loop back around starting
        // from the top of the list. If we're in the middle of a search,
        // continue matching against the currently focused option before moving
        // on to the next option.
        const optionsForSearch = this.options
            .slice(focusedIndex + searchStartOffset, this.options.length)
            .concat(this.options.slice(0, focusedIndex + searchStartOffset));

        const pattern = `^(${this.regexEscape(this.typeAheadValue)})`;
        const re = new RegExp(pattern, "gi");

        for (const option of optionsForSearch) {
            // Match against the visible text of the option, rather than
            // the `value` attribute. For a real <option> element, the
            // `label` property could be used here.
            // Chromium/Firefox's native <select>s ignore whitespace at the
            // beginning/end of the visible text when matching, so trim()
            // the search text to align with that behavior.
            const element: any = option;
            const matches = element.innerText.trim().match(re);

            if (matches) {
                this.setFocusOnOption(element);
                break;
            }
        }

        this.typeAheadExpired = false;
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