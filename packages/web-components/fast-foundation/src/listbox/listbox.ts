import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { Option } from "../option";

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
        if (!this.$fastController.isConnected) {
            return;
        }

        if (this.disabled) {
            this.setAttribute("aria-disabled", "true");
        }

        if (this.listboxItems.length) {
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

    public selectedOption: Option;

    @observable
    private selectedOptionIndex: number;
    protected selectedOptionIndexChanged(): void {
        this.setSelectedOption();
    }

    public setSelectedOption = (): void => {
        const selectedOption = this.listboxItems[this.selectedOptionIndex];
        if (!selectedOption) {
            return;
        }

        this.listboxItems.forEach(el => {
            const isSameNode = el.isSameNode(selectedOption);
            el.selected = isSameNode;
            if (isSameNode) {
                this.selectedOption = el;
            }
            this.activeDescendent = isSameNode ? el.id : this.activeDescendent;
        });

        this.focusFirstSelectedOption();
    };

    public focusFirstSelectedOption(): void {
        const selectedOption = this.listboxItems[this.selectedOptionIndex];
        DOM.queueUpdate(() => selectedOption.focus());
    }

    /**
     * @internal
     */
    public listboxItems: Option[];

    /**
     * @internal
     */
    private listboxItemsCount: number;

    /**
     * @internal
     */
    @observable
    public items: Element[];
    protected itemsChanged(oldValue, newValue): void {
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

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.handleClick);
        this.addEventListener("focusin", this.handleFocusIn);
        this.addEventListener("keydown", this.handleKeyDown);

        this.listboxItems = (this.items as Option[]).filter(
            (n: Option) =>
                n.nodeType === Node.ELEMENT_NODE &&
                n.getAttribute("role") === "option" &&
                !n.disabled
        );

        this.listboxItemsCount = this.listboxItems.length;
        this.selectedOptionIndex = this.listboxItems.findIndex(el => el.selected) || 0;

        DOM.queueUpdate(() => this.setupOptions());

        // this.addEventListener("keypress", this.keypressHandler);
    }

    private setupOptions(): void {
        this.listboxItems.forEach((el, i) => {
            el.setAttribute("tabindex", "0");
            el.id = `option-${i}`;
        });
        this.selectedOptionIndex = 0;
    }

    public keypressHandler(e: KeyboardEvent): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        let captured: Option = e.target! as Option;

        if (!this.listboxItems.includes(captured)) {
            captured = this.getFocusedOption();
        }

        if (captured) {
            if (captured.selected) {
                captured.setAttribute("tabindex", "0");
                return;
            }
            captured.removeAttribute("tabindex");
            // captured.setAttribute("tabindex", captured.selected ? "0" : "-1");
        }
    }

    public handleFocusIn = (e: FocusEvent): void => {
        if (e.target === e.currentTarget) {
            this.setSelectedOption();
        }
    };

    private getFocusedOption(): Option {
        return this.listboxItems[this.selectedOptionIndex || 0];
    }

    private rejectIfDisabled = (func, e): typeof func => {
        if (!this.disabled) {
            return func(e);
        }
    };

    public handleKeyDown = (e: KeyboardEvent): void | boolean => {
        if (!e.key) {
            return;
        }

        const keyCode = e.key || e.key.charCodeAt(0);

        switch (keyCode) {
            case "ArrowLeft":
            case "ArrowUp":
                return this.selectPreviousOption(e);

            case "ArrowDown":
            case "ArrowRight":
                return this.selectNextOption(e);

            case "Home":
                return this.selectFirstOption(e);

            case "End":
                return this.selectLastOption(e);

            case "Tab":
                if (e.defaultPrevented) {
                    return;
                }

                e.preventDefault();
                e.stopImmediatePropagation();
                this.focusFirstSelectedOption();
                return;

            case " ":
            case "Enter":
            case "Escape":
                break;

            default:
                e.stopImmediatePropagation();
        }
    };

    /**
     * Moves focus to the first selectable option
     *
     * @internal
     */
    private selectFirstOption = (e: KeyboardEvent): void => {
        e.stopPropagation();
        this.selectedOptionIndex = 0;
    };

    /**
     * Moves focus to the previous selectable option
     *
     * @internal
     */
    private selectPreviousOption = (e: KeyboardEvent): void => {
        e.stopPropagation();
        if (!this.disabled && this.selectedOptionIndex > 0) {
            this.selectedOptionIndex -= 1;
        }
    };

    /**
     * Moves focus to the next selectable option
     * @internal
     */
    private selectNextOption(e: KeyboardEvent) {
        e.stopPropagation();
        if (!this.disabled && this.selectedOptionIndex < this.listboxItemsCount - 1) {
            this.selectedOptionIndex += 1;
        }
    }

    /**
     * Moves focus to the last selectable option
     *
     * @internal
     */
    private selectLastOption = (e: KeyboardEvent): void => {
        e.stopPropagation();
        if (!this.disabled) {
            this.selectedOptionIndex = this.listboxItemsCount - 1;
        }
    };

    /**
     *
     * @internal
     */
    public handleClick = (e: MouseEvent): void => {
        e.preventDefault();

        const captured = (e.target as HTMLElement).closest("[role='option']");
        if (!captured) {
            return;
        }

        const selectedIndex = this.listboxItems.findIndex(el => el.isEqualNode(captured));
        if (selectedIndex !== -1) {
            this.selectedOptionIndex = selectedIndex;
            this.selectedOption = this.listboxItems[selectedIndex];
        }
    };

    /**
     * Move focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param typedKey - the key to be evaluated
     */
    private typeAheadValue: string = "";
    private typeAheadTimeoutHandler: number = -1;
    private typeAheadExpired: boolean = false;
    private static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;
    public handleTypeAhead(typedKey) {
        // For every keystroke, reset the timer that triggers when enough
        // time has elapsed such that the search should restart.
        window.clearTimeout(this.typeAheadTimeoutHandler);
        this.typeAheadTimeoutHandler = window.setTimeout(() => {
            this.typeAheadExpired = true;
        }, Listbox.TYPE_AHEAD_TIMEOUT_MS);

        if (this.typeAheadExpired) {
            this.typeAheadValue = "";
        }

        this.typeAheadValue = `${this.typeAheadValue}${typedKey}`;

        const focusedIndex = this.listboxItems.indexOf(document.activeElement as any);
        const searchStartOffset = this.typeAheadExpired ? 1 : 0;
        // Try to match first against options that come after the currently
        // selected option. If none of those match, loop back around starting
        // from the top of the list. If we're in the middle of a search,
        // continue matching against the currently focused option before moving
        // on to the next option.
        const optionsForSearch = this.listboxItems
            .slice(focusedIndex + searchStartOffset, this.listboxItems.length)
            .concat(this.listboxItems.slice(0, focusedIndex + searchStartOffset));

        const pattern = `^(${this.typeAheadValue.replace(
            /[-/\\^$*+?.()|[\]{}]/g,
            "\\$&"
        )})`;
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
                // this.setFocusOnOption(element);
                console.log(element);
                break;
            }
        }

        this.typeAheadExpired = false;
    }
}
