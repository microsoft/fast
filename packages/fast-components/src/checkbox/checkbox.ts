import { attr, FastElement, observable, Observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";

/* tslint:disable:member-ordering */
export class Checkbox extends FormAssociated<HTMLInputElement> {
    @attr({ attribute: "readonly" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="checkbox"]
     */
    @attr
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
    @attr({ attribute: "checked" })
    public checkedAttribute: string | null;
    private checkedAttributeChanged(): void {
        this.defaultChecked = typeof this.checkedAttribute === "string";
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

        this.updateForm();

        if (this.proxy instanceof HTMLElement) {
            this.proxy.checked = this.checked;
        }

        if (this.constructed) {
            this.dispatchEvent(
                new CustomEvent("change", { bubbles: true, composed: true })
            );
        }

        this.checked ? this.classList.add("checked") : this.classList.remove("checked");
    }

    protected proxy = document.createElement("input");

    /**
     * The indeterminate state of the control
     */
    @observable
    public indeterminate: boolean = false;
    private indeterminateChanged(): void {
        this.indeterminate
            ? this.classList.add("indeterminate")
            : this.classList.remove("indeterminate");
    }

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    private dirtyChecked: boolean = false;

    /**
     * Set to true when the component has constructed
     */
    private constructed: boolean = false;

    constructor() {
        super();

        this.proxy.setAttribute("type", "checkbox");
        this.constructed = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.updateForm();

        this.addEventListener("keypress", this.keypressHandler);
        this.addEventListener("click", this.clickHandler);
    }

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    protected keypressHandler = (e: KeyboardEvent) => {
        super.keypressHandler(e);

        switch (e.keyCode) {
            case keyCodeSpace:
                this.checked = !this.checked;
                break;
        }
    };

    private clickHandler = (e: MouseEvent) => {
        if (this.disabled !== ("" as any) && this.readOnly !== ("" as any)) {
            this.checked = !this.checked;
        }
    };
}
/* tslint:enable:member-ordering */
