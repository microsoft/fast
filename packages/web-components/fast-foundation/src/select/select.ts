import {
    attr,
    DOM,
    Observable,
    observable,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import {
    ArrowKeys,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
    keySpace,
    keyTab,
} from "@microsoft/fast-web-utilities";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ListboxOption } from "../listbox-option/listbox-option";
import { Listbox } from "../listbox/listbox";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd, StartEndOptions } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FormAssociatedSelect } from "./select.form-associated";
import { SelectPosition, SelectRole } from "./select.options";

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
 *
 * @remarks
 * Implements the {@link https://www.w3.org/TR/wai-aria-practices-1.2/#combobox | ARIA combobox} role.
 *
 * @public
 */
export class Select extends FormAssociatedSelect {
    /**
     * The internal value property.
     *
     * @internal
     */
    private _value: string;

    /**
     * The component is collapsible when in single-selection mode with no size attribute.
     *
     * @internal
     */
    public get collapsible(): boolean {
        return !this.multiple && typeof this.sizeAttribute !== "number";
    }

    /**
     * The ref to the internal `.control` element.
     *
     * @internal
     */
    @observable
    public control: HTMLElement;

    /**
     * The value displayed on the button.
     *
     * @public
     */
    @observable
    public displayValue: string = "";

    /**
     * Indicates the initial state of the position attribute.
     *
     * @internal
     */
    private forcedPosition: boolean = false;

    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public formResetCallback = (): void => {
        this.setProxyOptions();
        this.setDefaultSelectedOption();
        this.value = this.firstSelectedOption.value;
    };

    /**
     * @internal
     */
    private indexWhenOpened: number;

    /**
     * The ref to the internal `.listbox` element.
     *
     * @internal
     */
    public listbox: HTMLElement;

    /**
     * The ref to the internal `.indicator` element.
     *
     * @internal
     */
    @observable
    public indicator: HTMLElement;

    /**
     * The max height for the listbox when opened.
     *
     * @internal
     */
    @observable
    public maxHeight: number = 0;

    /**
     * The open attribute.
     *
     * @internal
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;
    protected openChanged(prev: unknown, next: boolean): void {
        if (!this.collapsible) {
            return;
        }

        this.ariaExpanded = next ? "true" : "false";

        if (next) {
            this.setPositioning();
            this.focusAndScrollOptionIntoView();
            this.indexWhenOpened = this.selectedIndex;
        }
    }

    /**
     * Holds the current state for the calculated position of the listbox.
     *
     * @public
     */
    @observable
    public position: SelectPosition = SelectPosition.below;

    /**
     * Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr({ attribute: "position" })
    public positionAttribute: SelectPosition;

    /**
     * The role of the element.
     *
     * @remarks
     * HTML Attribute: role
     *
     * @public
     */
    public role: SelectRole = SelectRole.combobox;

    /**
     * The ref to the internal `.selected-value` element.
     */
    @observable
    public selectedValue: HTMLElement;
    protected sizeChanged(prev: unknown, next: number) {
        super.sizeChanged(prev, next ?? 0);
        if (this.proxy) {
            this.proxy.size = next;
        }

        this.updateDimensions();
    }

    /**
     * The selection type for the component.
     *
     * @remarks
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/type} for more information.
     *
     * @public
     */
    public get type(): string {
        return this.proxy?.type ?? `select-${this.multiple ? "multiple" : "one"}`;
    }

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
        const prev = `${this._value ?? ""}`;

        if (this.$fastController.isConnected && this.options) {
            if (!this.hasSelectableOptions) {
                this.selectedIndex = -1;
            }

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
                if (this.hasSelectableOptions) {
                    this.selectedIndex = selectedIndex;
                }
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

        if (this.collapsible) {
            this.open = !this.open;
        }

        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
        }

        return true;
    }

    public connectedCallback() {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
    }

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
     * Handle focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    public focusoutHandler(e: FocusEvent): boolean | void {
        if (this.multiple) {
            this.uncheckAllOptions(true);
        }

        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }

        if (!this.options?.includes(focusTarget as ListboxOption)) {
            if (this.collapsible) {
                this.open = false;
            }
            if (this.indexWhenOpened !== this.selectedIndex) {
                this.updateValue(true);
            }
        }
    }

    /**
     * Handles parent-level observations which occur on child options.
     *
     * @param source - the source object
     * @param propertyName - the observed property
     *
     * @internal
     */
    public handleChange(source: any, propertyName: string) {
        switch (propertyName) {
            case "disabled": {
                this.slottedOptionsChanged(null, this.slottedOptions);
                this.options = this._options.filter(Listbox.slottedOptionFilter);
                this.setSelectedOptions();
                break;
            }
            case "selected": {
                if (Listbox.slottedOptionFilter(source)) {
                    this.selectedIndex = this.options.indexOf(source);
                }
                this.setSelectedOptions();
                break;
            }
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
            case keySpace: {
                e.preventDefault();
                if (this.collapsible && this.typeAheadExpired) {
                    this.open = !this.open;
                }

                break;
            }

            case keyHome:
            case keyEnd: {
                e.preventDefault();
                break;
            }

            case keyEnter: {
                e.preventDefault();
                this.open = !this.open;
                break;
            }

            case keyEscape: {
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }
                break;
            }

            case keyTab: {
                if (this.collapsible && this.open) {
                    e.preventDefault();
                    this.open = false;
                }

                return true;
            }
        }

        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
            this.indexWhenOpened = this.selectedIndex;
        }

        return !(key in ArrowKeys);
    }

    /**
     * Prevents focus when size is set and a scrollbar is clicked.
     *
     * @param e - the event object
     *
     * @override
     *
     * @internal
     */
    public mousedownHandler(e: MouseEvent): boolean | void {
        if (e.offsetX >= 0 && e.offsetX <= this.listbox?.scrollWidth) {
            return super.mousedownHandler(e);
        }

        return this.collapsible;
    }

    /**
     * Sets the multiple attribute on the proxy element to match the current value.
     *
     * @param prev - the previous value
     * @param next - the current value
     *
     * @override
     * @internal
     */
    public multipleChanged(prev: unknown, next: boolean): void {
        super.multipleChanged(prev, next);
        this.proxy.multiple = this.multiple;
        this.updateDimensions();
    }

    /**
     * Sets the default size based on the size attribute and the collapsible state.
     *
     * @override
     * @internal
     */
    public updateDefaultSize(): void {
        this.size = this.sizeAttribute ?? (this.collapsible ? 0 : 4);
    }

    /**
     * Updates the proxy value when the selected index changes.
     *
     * @param prev - the previous selected index
     * @param next - the next selected index
     *
     * @internal
     */
    public selectedIndexChanged(prev, next): void {
        super.selectedIndexChanged(prev, next);
        this.updateValue();
    }

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

        this.listbox.style.setProperty(
            "max-height",
            `${
                this.position === SelectPosition.above
                    ? ~~currentBox.top
                    : ~~availableBottom
            }px`
        );
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
                let proxyOption: Node;

                if (option instanceof HTMLOptionElement) {
                    proxyOption = option.cloneNode();
                } else {
                    option.proxy =
                        option.proxy ??
                        new Option(
                            `${option.textContent}`,
                            option.initialValue,
                            option.defaultSelected,
                            option.selected
                        );

                    option.proxy.hidden = true;
                    option.proxy.disabled = option.disabled;

                    proxyOption = option.proxy;
                }

                this.proxy.appendChild(proxyOption);
            });
        }
    }

    /**
     * @override
     * @internal
     */
    protected updateDimensions() {
        super.updateDimensions();

        requestAnimationFrame(() => {
            let maxOptionsWidth = 0;

            if (this.collapsible) {
                this.listbox.style.setProperty("visibility", "hidden");
                this.listbox.style.setProperty("overflow", "visible");
                this.listbox.style.setProperty("display", "flex");
                this.listbox.style.setProperty("width", "auto");
                this.listbox.hidden = false;
            }

            maxOptionsWidth = this.listbox.scrollWidth;

            if (this.collapsible) {
                this.listbox.hidden = true;
                this.listbox.style.removeProperty("display");
                this.listbox.style.removeProperty("overflow");
                this.listbox.style.removeProperty("visibility");
                this.listbox.style.removeProperty("width");
            }

            if (this.collapsible) {
                DOM.queueUpdate(() => {
                    this.control.style.setProperty(
                        "--option-width",
                        `${maxOptionsWidth}px`
                    );
                });
            }
        });
    }

    /**
     * Synchronize the form-associated proxy and update the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    public slottedOptionsChanged(prev: unknown, next: Element[]): void {
        super.slottedOptionsChanged(prev, next);
        this.setProxyOptions();
        this.updateValue();
        this.updateDimensions();
    }

    /**
     * Synchronize the value and display value with the first selected option,
     * then emit `input` and `change` events.
     *
     * @param shouldEmit - emit `input` and `change` events
     *
     * @internal
     */
    private updateValue(shouldEmit?: boolean) {
        if (this.$fastController.isConnected) {
            this.value = this.firstSelectedOption?.value ?? "";
            this.displayValue = this.firstSelectedOption?.textContent ?? this.value;
        }

        if (shouldEmit) {
            this.$emit("input");
            this.$emit("change", this, {
                bubbles: true,
                composed: undefined,
            });
        }
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA select role.
 *
 * @public
 */
export class DelegatesARIASelect {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information.
     *
     * @remarks
     * HTML Attribute: aria-expanded
     *
     * @public
     */
    @observable
    public ariaExpanded: "true" | "false" | undefined;

    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information.
     *
     * @remarks
     * HTML Attribute: aria-pressed
     *
     * @public
     */
    @attr({ attribute: "aria-pressed", mode: "fromView" })
    public ariaPressed: "true" | "false" | "mixed" | undefined;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 *
 * @internal
 */
export interface DelegatesARIASelect extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIASelect, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Select extends StartEnd, DelegatesARIASelect {}
applyMixins(Select, StartEnd, DelegatesARIASelect);
