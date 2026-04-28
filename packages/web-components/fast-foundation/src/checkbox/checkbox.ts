import { observable } from "@microsoft/fast-element";
import { keySpace } from "@microsoft/fast-web-utilities";
import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";
import { FormAssociatedCheckbox } from "./checkbox.form-associated.js";

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
 * @public
 */
export class FASTCheckbox extends FormAssociatedCheckbox {
    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="checkbox"]
     *
     * @internal
     */
    public initialValue: string = "on";

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * The indeterminate state of the control
     */
    @observable
    public indeterminate: boolean = false;

    constructor() {
        super();

        this.proxy.setAttribute("type", "checkbox");
    }

    private toggleChecked() {
        if (this.indeterminate) {
            this.indeterminate = false;
        }
        this.checked = !this.checked;
    }

    /**
     * @internal
     */
    public keypressHandler = (e: KeyboardEvent): void => {
        if (this.disabled) {
            return;
        }

        switch (e.key) {
            case keySpace:
                this.toggleChecked();
                break;
        }
    };

    /**
     * @internal
     */
    public clickHandler = (e: MouseEvent): void => {
        if (!this.disabled) {
            this.toggleChecked();
        }
    };
}
