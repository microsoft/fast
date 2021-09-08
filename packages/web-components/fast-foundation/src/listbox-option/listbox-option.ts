import { attr, observable, Observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { StartEnd, StartEndOptions } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";

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
     * @internal
     */
    public proxy: HTMLOptionElement;

    /**
     * The defaultSelected state of the option.
     * @public
     */
    @observable
    public defaultSelected: boolean = false;
    protected defaultSelectedChanged(): void {
        if (!this.dirtySelected) {
            this.selected = this.defaultSelected;

            if (this.proxy instanceof HTMLOptionElement) {
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
     * The disabled state of the option.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;
    protected disabledChanged(prev, next): void {
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.disabled = this.disabled;
        }
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

        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy.defaultSelected = this.defaultSelected;
        }
    }

    /**
     * The checked state of the control.
     *
     * @public
     */
    @observable
    public selected: boolean = this.defaultSelected;
    protected selectedChanged(): void {
        if (this.$fastController.isConnected) {
            if (!this.dirtySelected) {
                this.dirtySelected = true;
            }

            if (this.proxy instanceof HTMLOptionElement) {
                this.proxy.selected = this.selected;
            }
        }
    }

    /**
     * Track whether the value has been changed from the initial value
     */
    public dirtyValue: boolean = false;

    /**
     * The initial value of the option. This value sets the `value` property
     * only when the `value` property has not been explicitly set.
     *
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value", mode: "fromView" })
    protected initialValue: string;
    public initialValueChanged(previous: string, next: string): void {
        // If the value is clean and the component is connected to the DOM
        // then set value equal to the attribute value.
        if (!this.dirtyValue) {
            this.value = this.initialValue;
            this.dirtyValue = false;
        }
    }

    public get label() {
        return this.value ? this.value : this.textContent ? this.textContent : "";
    }

    public get text(): string {
        return this.textContent as string;
    }

    public set value(next: string) {
        this._value = next;

        this.dirtyValue = true;

        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = next;
        }

        Observable.notify(this, "value");
    }

    public get value(): string {
        Observable.track(this, "value");
        return this._value ? this._value : this.text;
    }

    public get form(): HTMLFormElement | null {
        return this.proxy ? this.proxy.form : null;
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

        this.proxy = new Option(
            `${this.textContent}`,
            this.initialValue,
            this.defaultSelected,
            this.selected
        );
        this.proxy.disabled = this.disabled;
    }
}

/**
 * @internal
 */
export interface ListboxOption extends StartEnd {}
applyMixins(ListboxOption, StartEnd);
