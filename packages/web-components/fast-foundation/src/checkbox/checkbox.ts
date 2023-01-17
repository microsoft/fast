import "element-internals-polyfill";
import { attr, booleanConverter, FASTElement, observable } from "@microsoft/fast-element";
import { keySpace } from "@microsoft/fast-web-utilities";
import { FormControlMixin, requiredValidator } from "@open-wc/form-control";
import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";

/**
 * Checkbox configuration options
 * @public
 */
export type CheckboxOptions = {
    checkedIndicator?: StaticallyComposableHTML<FASTCheckbox>;
    indeterminateIndicator?: StaticallyComposableHTML<FASTCheckbox>;
};

/**
 * A Checkbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#checkbox | ARIA checkbox }.
 *
 * @slot checked-indicator - The checked indicator
 * @slot indeterminate-indicator - The indeterminate indicator
 * @slot - The default slot for the label
 * @csspart control - The element representing the visual checkbox control
 * @csspart label - The label
 * @fires change - Emits a custom change event when the checked state changes
 *
 * {@inheritDoc @open-wc/form-control#FormControlMixin}
 *
 * @public
 */
export class FASTCheckbox extends FormControlMixin(FASTElement) {
    static formControlValidators = [requiredValidator];

    @observable
    public ariaChecked: string | null;

    @observable
    public checked: boolean = false;

    public checkedChanged(prev: boolean | undefined, next: boolean): void {
        this.dirtyChecked = true;

        this.ariaChecked = next ? "true" : "false";

        this.currentChecked = this.checked;
        this.setValue(this.value);

        if (prev !== undefined) {
            this.$emit("change");
        }
    }

    /**
     * The initial state of the checkbox.
     *
     * @public
     * @remarks
     * HTML Attribute: `checked`
     */
    @attr({ attribute: "checked", mode: "boolean" })
    public checkedAttribute: boolean = false;

    /**
     * Sets the defaultChecked state of the checkbox.
     * @param prev - the previous value
     * @param next - the new value
     *
     * @internal
     */
    public checkedAttributeChanged(prev: boolean | undefined, next: boolean): void {
        this.defaultChecked = next;
    }

    /**
     * The current checkedness of the element. This property serves as a mechanism
     * to set the `checked` property through both property assignment and the
     * .setAttribute() method. This is useful for setting the field's checkedness
     * in UI libraries that bind data through the .setAttribute() API
     * and don't support IDL attribute binding.
     */
    @attr({ attribute: "current-checked", converter: booleanConverter })
    public currentChecked: boolean;

    public currentCheckedChanged(prev: boolean | undefined, next: boolean) {
        this.checked = this.currentChecked;
    }

    @observable
    public defaultChecked: boolean;

    /**
     * Sets the checked state of the checkbox.
     *
     * @param prev - the previous value
     * @param next - the new value
     *
     * @internal
     */
    public defaultCheckedChanged(prev: boolean | undefined, next: boolean): void {
        if (this.dirtyChecked) {
            return;
        }

        this.checked = next;

        // setting `checked` also sets `dirtyChecked` to true, so we need to reset it here
        this.dirtyChecked = false;
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    protected dirtyChecked: boolean = false;

    /**
     * Tracks whether the "checked" property has been changed from its initial value.
     *
     * @internal
     */
    public dirtyValue: boolean = false;

    /**
     * Sets the element's disabled state. A disabled element will not be included during form submission.
     *
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean = false;

    /**
     * The indeterminate state of the control
     */
    @observable
    public indeterminate: boolean | undefined;

    /**
     * Updates the ariaChecked property when the indeterminate property is changed.
     *
     * @param prev - the previous value
     * @param next - the new value
     *
     * @internal
     */
    public indeterminateChanged(
        prev: boolean | undefined,
        next: boolean | undefined
    ): void {
        this.ariaChecked = next ? "mixed" : this.checked ? "true" : "false";
    }

    /**
     * The initial value of the form. This value sets the `value` property
     * only when the `value` property has not been explicitly set.
     *
     * @remarks
     * HTML Attribute: value
     */
    @attr({ attribute: "value", mode: "fromView" })
    public initialValue: string = "on";

    /**
     * Invoked when the `initialValue` property changes.
     *
     * @param previous - the previous value
     * @param next - the new value
     *
     * @remarks
     * If elements extending `FormAssociated` implement a `initialValueChanged` method
     * They must be sure to invoke `super.initialValueChanged(previous, next)` to ensure
     * proper functioning of `FormAssociated`
     */
    public initialValueChanged(previous: string, next: string): void {
        // If the value is clean and the component is connected to the DOM
        // then set value equal to the attribute value.
        if (!this.dirtyValue) {
            this.value = this.initialValue;
            this.dirtyValue = false;
        }
    }

    /**
     * The name of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `name`
     */
    @attr
    public name: string;

    /**
     * The required state of the element. If true, the element will be required to complete the form.
     *
     * @public
     * @remarks
     * HTML Attribute: `required`
     */
    @attr({ mode: "boolean" })
    public required: boolean = false;

    public requiredChanged(): void {
        this.setValue(this.value);
    }

    /**
     * The value of the element. This element's value will be surfaced during form submission under the provided name.
     *
     * @public
     * @remarks
     * HTML Attribute: `value`
     */
    @observable
    public value: string;

    public valueChanged(previous: string, next: string): void {
        this.dirtyValue = true;
        // this.currentValue = this.value;

        this.setValue(next);
    }

    /**
     * Toggles the checked state of the checkbox when the element is clicked.
     *
     * @internal
     */
    public clickHandler(e: Event): void {
        if (!this.disabled) {
            this.toggleChecked();
        }
    }

    /**
     * Toggles the checked state of the checkbox when the spacebar is pressed.
     *
     * @internal
     */
    public keypressHandler(e: KeyboardEvent): void {
        if (!this.disabled && e.key === keySpace) {
            this.toggleChecked();
        }
    }

    resetFormControl(): void {
        this.checked = this.defaultChecked;
    }

    shouldFormValueUpdate(): boolean {
        return this.checked;
    }

    /**
     * Toggles the checked state of the checkbox.
     *
     * @internal
     */
    private toggleChecked() {
        if (typeof this.indeterminate === "boolean") {
            this.indeterminate = false;
        }

        this.checked = !this.checked;
    }
}
