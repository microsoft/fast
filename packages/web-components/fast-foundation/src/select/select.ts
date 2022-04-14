import { attr, DOM, Observable, observable } from "@microsoft/fast-element";
import type { SyntheticViewTemplate } from "@microsoft/fast-element";
import { uniqueId } from "@microsoft/fast-web-utilities";
import type { FoundationElementDefinition } from "../foundation-element/foundation-element.js";
import { DelegatesARIAListbox, Listbox } from "../listbox/listbox.js";
import type { ListboxOption } from "../listbox-option/listbox-option.js";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import { FormAssociatedSelect } from "./select.form-associated.js";
import { SelectPosition } from "./select.options.js";

/**
 * Select configuration options
 * @public
 */
export type SelectOptions = FoundationElementDefinition &
    StartEndOptions & {
        indicator?: string | SyntheticViewTemplate;
    };

/**
 * A Select Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#select | ARIA select }.
 *
 * @public
 */
export class Select extends FormAssociatedSelect {
    /**
     * The open attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: open
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;
    protected openChanged() {
        if (this.open) {
            this.ariaControls = this.listboxId;
            this.ariaExpanded = "true";

            this.setPositioning();
            this.focusAndScrollOptionIntoView();
            this.indexWhenOpened = this.selectedIndex;

            // focus is directed to the element when `open` is changed programmatically
            DOM.queueUpdate(() => this.focus());

            return;
        }

        this.ariaControls = "";
        this.ariaExpanded = "false";
    }

    private indexWhenOpened: number;

    /**
     * The internal value property.
     *
     * @internal
     */
    private _value: string;

    /**
     * The value property.
     *
     * @public
     */
    public get value() {
        Observable.track(this, "value");
        return this._value;
    }

    public set value(next: string) {
        const prev = `${this._value}`;

        if (this.options?.length) {
            const selectedIndex = this.options.findIndex(el => el.value === next);

            const prevSelectedOption = this.options[this.selectedIndex];
            const nextSelectedOption = this.options[selectedIndex];

            const prevSelectedValue = prevSelectedOption
                ? prevSelectedOption.value
                : null;

            const nextSelectedValue = nextSelectedOption
                ? nextSelectedOption.value
                : null;

            if (selectedIndex === -1 || prevSelectedValue !== nextSelectedValue) {
                next = "";
                this.selectedIndex = selectedIndex;
            }

            if (this.firstSelectedOption) {
                next = this.firstSelectedOption.value;
            }
        }

        if (prev !== next) {
            this._value = next;
            super.valueChanged(prev, next);
            Observable.notify(this, "value");
        }
    }

    private updateValue(shouldEmit?: boolean) {
        if (this.$fastController.isConnected) {
            this.value = this.firstSelectedOption ? this.firstSelectedOption.value : "";
            this.displayValue = this.firstSelectedOption
                ? this.firstSelectedOption.textContent || this.firstSelectedOption.value
                : this.value;
        }

        if (shouldEmit) {
            this.$emit("input");
            this.$emit("change", this, {
                bubbles: true,
                composed: undefined,
            });
        }
    }

    /**
     * Updates the proxy value when the selected index changes.
     *
     * @param prev - the previous selected index
     * @param next - the next selected index
     *
     * @internal
     */
    public selectedIndexChanged(prev: number, next: number): void {
        super.selectedIndexChanged(prev, next);
        this.updateValue();
    }

    /**
     * Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr({ attribute: "position" })
    public positionAttribute: SelectPosition | "above" | "below";

    /**
     * Indicates the initial state of the position attribute.
     *
     * @internal
     */
    private forcedPosition: boolean = false;

    /**
     * Holds the current state for the calculated position of the listbox.
     *
     * @public
     */
    @observable
    public position: SelectPosition | "above" | "below" = SelectPosition.below;
    protected positionChanged() {
        this.positionAttribute = this.position;
        this.setPositioning();
    }

    /**
     * Reference to the internal listbox element.
     *
     * @internal
     */
    public listbox: HTMLDivElement;

    /**
     * The unique id for the internal listbox element.
     *
     * @internal
     */
    public listboxId: string = uniqueId("listbox-");

    /**
     * Calculate and apply listbox positioning based on available viewport space.
     *
     * @param force - direction to force the listbox to display
     * @public
     */
    public setPositioning(): void {
        const currentBox = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableBottom = viewportHeight - currentBox.bottom;

        this.position = this.forcedPosition
            ? this.positionAttribute
            : currentBox.top > availableBottom
            ? SelectPosition.above
            : SelectPosition.below;

        this.positionAttribute = this.forcedPosition
            ? this.positionAttribute
            : this.position;

        this.maxHeight =
            this.position === SelectPosition.above ? ~~currentBox.top : ~~availableBottom;
    }

    /**
     * The max height for the listbox when opened.
     *
     * @internal
     */
    @observable
    public maxHeight: number = 0;
    private maxHeightChanged(): void {
        if (this.listbox) {
            this.listbox.style.setProperty("--max-height", `${this.maxHeight}px`);
        }
    }

    /**
     * The value displayed on the button.
     *
     * @public
     */
    @observable
    public displayValue: string = "";

    /**
     * Synchronize the `aria-disabled` property when the `disabled` property changes.
     *
     * @param prev - The previous disabled value
     * @param next - The next disabled value
     *
     * @internal
     */
    public disabledChanged(prev: boolean, next: boolean): void {
        if (super.disabledChanged) {
            super.disabledChanged(prev, next);
        }
        this.ariaDisabled = this.disabled ? "true" : "false";
    }

    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public formResetCallback(): void {
        this.setProxyOptions();
        // Call the base class's implementation setDefaultSelectedOption instead of the select's
        // override, in order to reset the selectedIndex without using the value property.
        super.setDefaultSelectedOption();
        if (this.selectedIndex === -1) {
            this.selectedIndex = 0;
        }
    }

    /**
     * Handle opening and closing the listbox when the select is clicked.
     *
     * @param e - the mouse event
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }

        if (this.open) {
            const captured = (e.target as HTMLElement).closest(
                `option,[role=option]`
            ) as ListboxOption;

            if (captured && captured.disabled) {
                return;
            }
        }

        super.clickHandler(e);

        this.open = !this.open;

        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
        }

        return true;
    }

    /**
     * Handle focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    public focusoutHandler(e: FocusEvent): boolean | void {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }

        if (!this.options?.includes(focusTarget as ListboxOption)) {
            this.open = false;
            if (this.indexWhenOpened !== this.selectedIndex) {
                this.updateValue(true);
            }
        }
    }

    /**
     * Synchronize the form-associated proxy and update the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    public slottedOptionsChanged(prev: Element[], next: Element[]): void {
        super.slottedOptionsChanged(prev, next);
        this.setProxyOptions();
        this.updateValue();
    }

    protected setDefaultSelectedOption(): void {
        const options: ListboxOption[] =
            this.options ?? Array.from(this.children).filter(Listbox.slottedOptionFilter);

        const selectedIndex = options?.findIndex(
            el => el.hasAttribute("selected") || el.selected || el.value === this.value
        );

        if (selectedIndex !== -1) {
            this.selectedIndex = selectedIndex;
            return;
        }

        this.selectedIndex = 0;
    }

    /**
     * Reset and fill the proxy to match the component's options.
     *
     * @internal
     */
    private setProxyOptions(): void {
        if (this.proxy instanceof HTMLSelectElement && this.options) {
            this.proxy.options.length = 0;
            this.options.forEach(option => {
                const proxyOption =
                    option.proxy ||
                    (option instanceof HTMLOptionElement ? option.cloneNode() : null);

                if (proxyOption) {
                    this.proxy.appendChild(proxyOption);
                }
            });
        }
    }

    /**
     * Handle keyboard interaction for the select.
     *
     * @param e - the keyboard event
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
        super.keydownHandler(e);
        const key = e.key || e.key.charCodeAt(0);

        switch (key) {
            case " ": {
                if (this.typeaheadExpired) {
                    e.preventDefault();
                    this.open = !this.open;
                }
                break;
            }

            case "Enter": {
                e.preventDefault();
                this.open = !this.open;
                break;
            }

            case "Escape": {
                if (this.open) {
                    e.preventDefault();
                    this.open = false;
                }
                break;
            }

            case "Tab": {
                if (!this.open) {
                    return true;
                }

                e.preventDefault();
                this.open = false;
            }
        }

        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
            this.indexWhenOpened = this.selectedIndex;
        }

        return true;
    }

    public connectedCallback() {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA select role.
 *
 * @public
 */
export class DelegatesARIASelect {
    /**
     * See {@link https://www.w3.org/TR/wai-aria-1.2/#combobox} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-controls`
     */
    @observable
    public ariaControls: string;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIASelect extends DelegatesARIAListbox {}
applyMixins(DelegatesARIASelect, DelegatesARIAListbox);

/**
 * @internal
 */
export interface Select extends StartEnd, DelegatesARIASelect {}
applyMixins(Select, StartEnd, DelegatesARIASelect);
