import { attr, observable } from "@microsoft/fast-element";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { FormAssociatedSwitch } from "./switch.form-associated";

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#switch | ARIA switch }.
 *
 * @public
 */
export class Switch extends FormAssociatedSwitch {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
        }

        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
    }

    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="checkbox"]
     *
     * @internal
     */
    public initialValue: string = "on";

    /**
     * The checked attribute value. This sets the initial checked value.
     *
     * @public
     * HTML Attribute: checked
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean;
    private checkedAttributeChanged(): void {
        this.defaultChecked = this.checkedAttribute;
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * Initialized to the value of the checked attribute. Can be changed independently of the "checked" attribute,
     * but changing the "checked" attribute always additionally sets this value.
     *
     * @public
     */
    @observable
    public defaultChecked: boolean;
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
     * The checked state of the control.
     *
     * @public
     */
    @observable
    public checked: boolean;
    private checkedChanged(): void {
        if (!this.dirtyChecked) {
            this.dirtyChecked = true;
        }

        this.updateForm();

        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.checked = this.checked;
        }

        this.$emit("change");

        this.checked ? this.classList.add("checked") : this.classList.remove("checked");

        this.validate();
    }

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    private dirtyChecked: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "checkbox");

        this.updateForm();
    }

    public constructor() {
        super();

        this.defaultChecked = !!this.checkedAttribute;
        this.checked = this.defaultChecked;
    }

    /**
     * @internal
     */
    public formResetCallback = (): void => {
        this.checked = this.checkedAttribute;
        this.dirtyChecked = false;
    };

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    /**
     * @internal
     */
    public keypressHandler = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case keyCodeSpace:
                this.checked = !this.checked;
                break;
        }
    };

    /**
     * @internal
     */
    public clickHandler = (e: MouseEvent) => {
        if (!this.disabled && !this.readOnly) {
            this.checked = !this.checked;
        }
    };
}
