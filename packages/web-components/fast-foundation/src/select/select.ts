import { attr, DOM, Observable, observable, volatile } from "@microsoft/fast-element";
import { ListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { SelectPosition, SelectRole } from "./select.options";
import { FormAssociatedSelect } from "./select.form-associated";

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
     * @internal
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;
    protected openChanged() {
        this.ariaExpanded = this.open ? "true" : "false";
        if (this.open) {
            this.setPositioning();
            this.focusAndScrollOptionIntoView();
            this.indexWhenOpened = this.selectedIndex;
        }
    }

    private indexWhenOpened: number;

    private _value: string;

    @volatile
    public get value() {
        Observable.track(this, "value");
        return this._value;
    }

    public set value(next: string) {
        const previous = `${this._value}`;

        if (this.$fastController.isConnected) {
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

        super.valueChanged(previous, next);
        this._value = next;
        Observable.notify(this, "value");
    }

    private updateValue(shouldEmit?: boolean) {
        if (this.$fastController.isConnected) {
            if (this.firstSelectedOption) {
                this.value = this.firstSelectedOption.value || "";
                this.displayValue =
                    this.firstSelectedOption.textContent ||
                    this.firstSelectedOption.value ||
                    "";
            }
        }

        if (shouldEmit) {
            this.$emit("change");
        }
    }

    public selectedIndexChanged(prev, next): void {
        super.selectedIndexChanged(prev, next);
        this.updateValue();
    }

    /**
     *  Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr({ attribute: "position" })
    public positionAttribute: SelectPosition;

    /**
     * Indicates the initial state of the position attribute.
     *
     * @internal
     */
    private forcedPosition: boolean = false;

    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    public role: SelectRole = SelectRole.combobox;

    /**
     * Holds the current state for the calculated position of the listbox.
     *
     * @public
     */
    @observable
    public position: SelectPosition = SelectPosition.below;

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

    /**
     * The value displayed on the button.
     *
     * @public
     */
    @observable
    public displayValue: string = "";

    /**
     * @internal
     */
    public formResetCallback = (): void => {
        this.value = this.initialValue;
        this.setDefaultSelectedOption();
    };

    /**
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

    public focusoutHandler(e: FocusEvent): boolean | void {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            DOM.queueUpdate(() => this.focus());
            return;
        }

        if (!this.options.includes(focusTarget as ListboxOption)) {
            this.open = false;
        }
    }

    public optionsChanged(prev, next): void {
        super.optionsChanged(prev, next);

        this.setProxyOptions();
    }

    /**
     * Reset and fill the proxy to match the component's options
     * @internal
     */
    private setProxyOptions(): void {
        if (this.proxy instanceof HTMLSelectElement) {
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

    public keydownHandler(e: KeyboardEvent): boolean | void {
        super.keydownHandler(e);
        const key = e.key || e.key.charCodeAt(0);

        switch (key) {
            case " ": {
                if (this.typeAheadExpired) {
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
        }

        return true;
    }

    public connectedCallback() {
        super.connectedCallback();

        this.setProxyOptions();

        this.initialValue = this.initialValue || this.value || "";
        this.forcedPosition = !!this.positionAttribute;
    }

    public constructor() {
        super();
        this.value = this.initialValue;
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA select role.
 *
 * @public
 */
export class DelegatesARIASelect {
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
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIASelect extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIASelect, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Select extends StartEnd, DelegatesARIASelect {}
applyMixins(Select, StartEnd, DelegatesARIASelect);
