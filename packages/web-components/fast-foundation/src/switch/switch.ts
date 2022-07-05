import { attr, observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import { keyEnter, keySpace } from "@microsoft/fast-web-utilities";
import { FormAssociatedSwitch } from "./switch.form-associated.js";

/**
 * Switch configuration options
 * @public
 */
export type SwitchOptions = {
    switch?: string | SyntheticViewTemplate;
};

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#switch | ARIA switch }.
 *
 * @slot - The deafult slot for the label
 * @slot checked-message - The message when in a checked state
 * @slot unchecked-message - The message when in an unchecked state
 * @csspart label - The label
 * @csspart switch - The element representing the switch, which wraps the indicator
 * @csspart status-message - The wrapper for the status messages
 * @csspart checked-message - The checked message
 * @csspart unchecked-message - The unchecked message
 * @fires change - Emits a custom change event when the checked state changes
 *
 * @public
 */
export class FASTSwitch extends FormAssociatedSwitch {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean; // Map to proxy element
    protected readOnlyChanged(): void {
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
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    public constructor() {
        super();

        this.proxy.setAttribute("type", "checkbox");
    }

    /**
     * @internal
     */
    public keypressHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case keyEnter:
            case keySpace:
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

    /**
     * @internal
     */
    public checkedChanged(prev: boolean | undefined, next: boolean) {
        super.checkedChanged(prev, next);
        /**
         * @deprecated - this behavior already exists in the template and should not exist in the class.
         */
        this.checked ? this.classList.add("checked") : this.classList.remove("checked");
    }
}
