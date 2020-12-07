import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * An Option Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#option | ARIA menuitem }.
 *
 * @public
 */
export class ListboxOption extends FASTElement {
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

            this.$emit("change");
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
        return this.textContent ? this.textContent : this.value;
    }

    @observable
    public value: string;
    public valueChanged(previous: string, next: string) {
        this.dirtyValue = true;
    }

    public get form(): HTMLFormElement | null {
        return this.proxy ? this.proxy.form : null;
    }

    public updateProxy(name: string, value: any): void {
        if (this.proxy instanceof HTMLOptionElement) {
            this.proxy[name] = value;
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
