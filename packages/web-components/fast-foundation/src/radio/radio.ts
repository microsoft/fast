import { attr, observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import { keySpace } from "@microsoft/fast-web-utilities";
import { FormAssociatedRadio } from "./radio.form-associated.js";

/**
 * A structure representing a {@link @microsoft/fast-foundation#(FASTRadio:class)} element
 * @public
 */
export type RadioControl = Pick<
    HTMLInputElement,
    "checked" | "disabled" | "readOnly" | "focus" | "setAttribute" | "getAttribute"
>;

/**
 * Radio configuration options
 * @public
 */
export type RadioOptions = {
    checkedIndicator?: string | SyntheticViewTemplate;
};

/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#radio | ARIA radio }.
 *
 * @slot checked-indicator - The checked indicator
 * @slot - The default slot for the label
 * @csspart control - The element representing the visual radio control
 * @csspart label - The label
 * @fires change - Emits a custom change event when the checked state changes
 *
 * @public
 */
export class FASTRadio extends FormAssociatedRadio implements RadioControl {
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
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * @internal
     */
    public defaultCheckedChanged(): void {
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

    constructor() {
        super();
        this.proxy.setAttribute("type", "radio");
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.validate();

        if (
            this.parentElement?.getAttribute("role") !== "radiogroup" &&
            this.getAttribute("tabindex") === null
        ) {
            if (!this.disabled) {
                this.setAttribute("tabindex", "0");
            }
        }

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

    private isInsideRadioGroup(): boolean {
        const parent: HTMLElement | null = (this as HTMLElement).closest(
            "[role=radiogroup]"
        );
        return parent !== null;
    }

    /**
     * Handles key presses on the radio.
     * @beta
     */
    public keypressHandler(e: KeyboardEvent): boolean | void {
        switch (e.key) {
            case keySpace:
                if (!this.checked && !this.readOnly) {
                    this.checked = true;
                }
                return;
        }

        return true;
    }

    /**
     * Handles clicks on the radio.
     * @beta
     */
    public clickHandler(e: MouseEvent): boolean | void {
        if (!this.disabled && !this.readOnly && !this.checked) {
            this.checked = true;
        }
    }
}
