import { attr, observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index";

export class Option extends FormAssociated<HTMLInputElement> {
    protected proxy: HTMLInputElement;
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element

    /**
     * The element's value to be included in form submission when checked.
     */
    public value: string = ""; // Map to proxy element.
    public valueChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.value = this.value;
        }
    }

    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean;
    private checkedAttributeChanged(): void {
        this.defaultChecked = this.checkedAttribute;
    }

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

        if (this.constructed) {
            this.$emit("change");
        }
    }

    /**
     * Tracks whether the "checked" property has been changed.
     */
    private dirtyChecked: boolean = false;

    @observable
    public defaultSlottedNodes: Node[];

    /**
     * Set to true when the component has constructed
     */
    private constructed: boolean = false;

    constructor() {
        super();
        this.constructed = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent): void => {
        (this.checked) ? this.checked = false : this.checked = true;
        this.$emit("oui-option-selection-change");
    };
}