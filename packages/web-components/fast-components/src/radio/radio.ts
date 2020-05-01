import { attr, observable } from "@microsoft/fast-element";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { FormAssociated } from "../form-associated";

export interface RadioControl {
    checked: boolean;
    disabled: boolean;
    readOnly: boolean;
    focus: () => void;
    setAttribute: (name: string, value: string) => void;
    getAttribute: (name: string) => string | null;
}

export class Radio extends FormAssociated<HTMLInputElement> implements RadioControl {
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    @attr
    public name: string; // Map to proxy element
    protected nameChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.name = this.name;
        }
    }

    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="radio"]
     */
    public value: string = "on"; // Map to proxy element.
    private valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    /**
     * Provides the default checkedness of the input element
     * Passed down to proxy
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean;
    private checkedAttributeChanged(): void {
        this.defaultChecked = this.checkedAttribute;
    }

    /**
     * Initialized to the value of the checked attribute. Can be changed independently of the "checked" attribute,
     * but changing the "checked" attribute always additionally sets this value.
     */
    @observable
    public defaultChecked: boolean = !!this.checkedAttribute;
    private defaultCheckedChanged(): void {
        if (!this.dirtyChecked) {
            // Setting this.checked will cause us to enter a dirty state,
            // but if we are clean when defaultChecked is changed, we want to stay
            // in a clean state, so reset this.dirtyChecked
            this.checked = this.defaultChecked;
            this.dirtyChecked = false;
        }
    }

    /**
     * The checked state of the control
     */
    @observable
    public checked: boolean = this.defaultChecked;
    private checkedChanged(): void {
        if (!this.dirtyChecked) {
            this.dirtyChecked = true;
        }

        if (this.proxy instanceof HTMLElement) {
            this.proxy.checked = this.checked;
        }

        this.$emit("change");
        this.checkedAttribute = this.checked;
        this.updateForm();
    }

    protected proxy: HTMLInputElement = document.createElement("input");

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input radios
     */
    private dirtyChecked: boolean = false;

    constructor() {
        super();
        this.proxy.setAttribute("type", "radio");
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (
            this.parentElement?.getAttribute("role") !== "radiogroup" &&
            this.getAttribute("tabindex") === null
        ) {
            if (!this.disabled) {
                this.setAttribute("tabindex", "0");
            }
        }
        this.updateForm();
    }

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    public keypressHandler = (e: KeyboardEvent): void => {
        super.keypressHandler(e);
        switch (e.keyCode) {
            case keyCodeSpace:
                if (!this.checked && !this.readOnly) {
                    this.checked = true;
                }
                break;
        }
    };

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent): void => {
        if (!this.disabled && !this.readOnly) {
            this.checked = !this.checked;
        }
    };
}
