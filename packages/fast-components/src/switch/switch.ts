import { attr, observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { bool } from "../utilities";

export class Switch extends FormAssociated<HTMLInputElement> {
    @attr({ attribute: "readonly" })
    public readOnly: boolean; // Map to proxy element
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }

        this.readOnly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
    }

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

        this.$emit("change");

        this.checked ? this.classList.add("checked") : this.classList.remove("checked");
    }

    protected proxy = document.createElement("input");

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    private dirtyChecked: boolean = false;

    constructor() {
        super();

        this.proxy.setAttribute("type", "checkbox");
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.updateForm();
    }

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    public keypressHandler = (e: KeyboardEvent) => {
        super.keypressHandler(e);

        switch (e.keyCode) {
            case keyCodeSpace:
                this.checked = !this.checked;
                break;
        }
    };

    public clickHandler = (e: MouseEvent) => {
        if (!bool(this.disabled) && !bool(this.readOnly)) {
            this.checked = !this.checked;
        }
    };
}
