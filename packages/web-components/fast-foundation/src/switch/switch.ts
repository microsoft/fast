import { attr, observable } from "@microsoft/fast-element";
import { keyEnter, keySpace } from "@microsoft/fast-web-utilities";
import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";
import { FormAssociatedSwitch } from "./switch.form-associated.js";

/**
 * Switch configuration options
 * @public
 */
export type SwitchOptions = {
    thumb?: StaticallyComposableHTML<FASTSwitch>;
};

/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#switch | ARIA switch }.
 *
 * @slot - The default slot for the label
 * @slot thumb - The thumb inside the control
 * @csspart label - The label
 * @csspart control - The element representing the switch, which wraps the indicator
 * @csspart thumb - The default thumb element
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
        if (this.readOnly) {
            return;
        }

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
}
