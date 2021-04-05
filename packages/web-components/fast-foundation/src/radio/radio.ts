import { attr, observable } from "@microsoft/fast-element";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { FormAssociatedRadio } from "./radio.form-associated";

/**
 * A structure representing a {@link @microsoft/fast-foundation#(Radio:class)} element
 * @public
 */
export type RadioControl = Pick<
    HTMLInputElement,
    "checked" | "disabled" | "readOnly" | "focus" | "setAttribute" | "getAttribute"
>;

/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#radio | ARIA radio }.
 *
 * @public
 */
export class Radio extends FormAssociatedRadio implements RadioControl {
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
    }

    /**
     * The name of the radio. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname | name attribute} for more info.
     */
    @observable
    public name: string;

    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="radio"]
     *
     * @internal
     */
    public initialValue: string = "on";

    /**
     * Provides the default checkedness of the input element
     * Passed down to proxy
     *
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean = false;
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
    public defaultChecked: boolean | undefined;
    private defaultCheckedChanged(): void {
        if (this.$fastController.isConnected && !this.dirtyChecked) {
            // Setting this.checked will cause us to enter a dirty state,
            // but if we are clean when defaultChecked is changed, we want to stay
            // in a clean state, so reset this.dirtyChecked
            if (!this.isInsideRadioGroup()) {
                this.checked = this.defaultChecked ?? false;
                this.dirtyChecked = false;
            }
        }
    }

    /**
     * The checked state of the control
     *
     * @public
     */
    @observable
    public checked: boolean;
    private checkedChanged(): void {
        if (this.$fastController.isConnected) {
            // changing the value via code and from radio-group
            if (!this.dirtyChecked) {
                this.dirtyChecked = true;
            }

            this.updateForm();

            if (this.proxy instanceof HTMLInputElement) {
                this.proxy.checked = this.checked;
            }

            this.$emit("change");

            this.validate();
        }
    }

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input radios
     */
    private dirtyChecked: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "radio");
        this.validate();

        if (
            this.parentElement?.getAttribute("role") !== "radiogroup" &&
            this.getAttribute("tabindex") === null
        ) {
            if (!this.disabled) {
                this.setAttribute("tabindex", "0");
            }
        }

        this.updateForm();

        if (this.checkedAttribute) {
            if (!this.dirtyChecked) {
                // Setting this.checked will cause us to enter a dirty state,
                // but if we are clean when defaultChecked is changed, we want to stay
                // in a clean state, so reset this.dirtyChecked
                if (!this.isInsideRadioGroup()) {
                    this.checked = this.defaultChecked ?? false;
                    this.dirtyChecked = false;
                }
            }
        }
    }

    constructor() {
        super();
        this.checked = this.defaultChecked ?? false;
    }

    /**
     * @internal
     */
    public formResetCallback = (): void => {
        this.checked = !!this.defaultChecked;
        this.dirtyChecked = false;
    };

    private isInsideRadioGroup(): boolean {
        const parent: HTMLElement | null = (this as HTMLElement).closest(
            "[role=radiogroup]"
        );
        return parent !== null;
    }

    private updateForm(): void {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }

    /**
     * @internal
     */
    public keypressHandler = (e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case keyCodeSpace:
                if (!this.checked && !this.readOnly) {
                    this.checked = true;
                }
                break;
        }
    };

    /**
     * @internal
     */
    public clickHandler = (e: MouseEvent): void => {
        if (!this.disabled && !this.readOnly && !this.checked) {
            this.checked = true;
        }
    };
}
