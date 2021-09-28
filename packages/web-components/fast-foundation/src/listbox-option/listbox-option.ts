import { attr, observable, Observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
import type { FoundationElementDefinition } from "../foundation-element";
import type { Listbox } from "../listbox/listbox";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import type { StartEndOptions } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * Listbox option configuration options
 * @public
 */
export type ListboxOptionOptions = FoundationElementDefinition & StartEndOptions;

/**
 * Determines if the element is a {@link (ListboxOption:class)}
 *
 * @param element - the element to test.
 * @public
 */
export function isListboxOption(el: Element): el is ListboxOption {
    return (
        isHTMLElement(el) &&
        ((el.getAttribute("role") as string) === "option" ||
            el instanceof HTMLOptionElement)
    );
}

/**
 * An Option Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#option | ARIA option }.
 *
 * @public
 */
export class ListboxOption extends FoundationElement {
    /**
     * @internal
     */
    private _value: string;

    /**
     * The defaultSelected state of the option.
     * @public
     */
    @observable
    public defaultSelected: boolean = false;
    protected defaultSelectedChanged(): void {
        if (!this.dirtySelected) {
            this.selected = this.defaultSelected;

            if (this.hasProxy) {
                this.proxy.selected = this.defaultSelected;
            }
        }
    }

    /**
     * Tracks whether the "selected" property has been changed.
     * @internal
     */
    private dirtySelected: boolean = false;

    /**
     * Track whether the value has been changed from the initial value
     */
    public dirtyValue: boolean = false;

    /**
     * The disabled state of the option.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;
    protected disabledChanged(prev, next): void {
        if (this.hasProxy) {
            this.proxy.disabled = this.disabled;
        }
    }

    public get form(): HTMLFormElement | null {
        return this.proxy?.form;
    }

    private get hasProxy() {
        return this.proxy instanceof HTMLOptionElement;
    }

    /**
     * The initial value of the option. This value sets the `value` property
     * only when the `value` property has not been explicitly set.
     *
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value", mode: "fromView" })
    public initialValue: string;
    public initialValueChanged(previous: string, next: string): void {
        // If the value is clean and the component is connected to the DOM
        // then set value equal to the attribute value.
        if (!this.dirtyValue) {
            this.value = this.initialValue;
            this.dirtyValue = false;
        }
    }

    /**
     * Returns the value or text content
     * @public
     */
    public get label() {
        return this.value ?? this.textContent ?? "";
    }

    /**
     * @internal
     */
    private parentListbox: Listbox | null;

    /**
     * @internal
     */
    public proxy: HTMLOptionElement;

    /**
     * The checked state of the control.
     *
     * @public
     */
    @observable
    public selected: boolean = this.defaultSelected;
    protected selectedChanged(prev: unknown, next: boolean): void {
        if (!this.dirtySelected) {
            this.dirtySelected = true;
        }

        if (this.hasProxy) {
            this.proxy.selected = next;
        }

        this.ariaSelected = String(next) as "true" | "false";
    }

    /**
     * The selected attribute value. This sets the initial selected value.
     *
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ attribute: "selected", mode: "boolean" })
    public selectedAttribute: boolean;
    protected selectedAttributeChanged(): void {
        this.defaultSelected = this.selectedAttribute;

        if (this.hasProxy) {
            this.proxy.defaultSelected = this.defaultSelected;
        }
    }

    /**
     * The checked state is used when the parent listbox is in multiple selection mode.
     * For accessibility reasons, the checked state should not be present
     *
     * @internal
     */
    @observable
    public checked?: boolean;
    public checkedChanged(prev: unknown, next?: boolean): void {
        this.ariaChecked =
            typeof next === "boolean" ? (String(next) as "true" | "false") : undefined;
    }

    /**
     * Returns the text content of the option.
     *
     * @public
     */
    public get text(): string {
        return this.textContent as string;
    }

    /**
     * The value of the option.
     *
     * @public
     */
    public get value(): string {
        Observable.track(this, "value");
        return this._value ?? this.text;
    }

    public set value(next: string) {
        this._value = next;

        this.dirtyValue = true;

        if (this.hasProxy) {
            this.proxy.value = next;
        }

        Observable.notify(this, "value");
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.parentListbox = this.closest("[role=listbox]");
        if (this.parentListbox?.getAttribute("multiple") !== null) {
            this.checked = false;
        }
    }

    public constructor(
        text?: string,
        value?: string,
        defaultSelected?: boolean,
        selected?: boolean
    ) {
        super();
        this.initialValue = this.initialValue || "";

        if (text) {
            this.textContent = text;
        }

        if (value) {
            this.initialValue = value;
        }

        if (defaultSelected) {
            this.defaultSelected = defaultSelected;
        }

        if (selected) {
            this.selected = selected;
        }
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA option role.
 *
 * @public
 */
export class DelegatesARIAListboxOption {
    /**
     * See {@link https://w3c.github.io/aria/#option} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-checked`
     */
    @attr({ attribute: "aria-checked" })
    public ariaChecked?: "true" | "false";

    /**
     * See {@link https://w3c.github.io/aria/#aria-selected} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-selected`
     */
    @attr({ attribute: "aria-selected" })
    public ariaSelected: "true" | "false" | undefined;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface DelegatesARIAListboxOption extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIAListboxOption, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface ListboxOption extends DelegatesARIAListboxOption, StartEnd {}
applyMixins(ListboxOption, DelegatesARIAListboxOption, StartEnd);
