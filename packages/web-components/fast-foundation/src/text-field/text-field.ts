import {
    attr,
    nullableNumberConverter,
    observable,
    Updates,
} from "@microsoft/fast-element";
import {
    ARIAGlobalStatesAndProperties,
    StartEnd,
    StartEndOptions,
} from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import { FormAssociatedTextField } from "./text-field.form-associated.js";
import { TextFieldType } from "./text-field.options.js";

export { TextFieldType };

/**
 * Text field configuration options
 * @public
 */
export type TextFieldOptions = StartEndOptions;

/**
 * A Text Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text | <input type="text" /> element }.
 *
 * @slot start - Content which can be provided before the number field input
 * @slot end - Content which can be provided after the number field input
 * @slot - The default slot for the label
 * @csspart label - The label
 * @csspart root - The element wrapping the control, including start and end slots
 * @csspart control - The text field element
 * @fires change - Fires a custom 'change' event when the value has changed
 *
 * @public
 */
export class FASTTextField extends FormAssociatedTextField {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    protected readOnlyChanged(prev: boolean | undefined, next: boolean): void {
        if (this.$fastController.isConnected) {
            this.proxy?.toggleAttribute("readonly", next);
            this.validate();
        }
    }

    /**
     * Indicates that this element should get focus after the page finishes loading. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus | autofocus HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    @attr({ mode: "boolean" })
    public autofocus: boolean;
    protected autofocusChanged(prev: boolean | undefined, next: boolean): void {
        this.proxy?.toggleAttribute("autofocus", next);
        this.validate();
    }

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    @attr
    public placeholder: string;
    protected placeholderChanged(prev: string | undefined, next: string): void {
        this.proxy?.setAttribute("placeholder", next);
    }

    /**
     * Allows setting a type or mode of text.
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr
    public type: TextFieldType = TextFieldType.text;
    private typeChanged(prev: TextFieldType | undefined, next: TextFieldType): void {
        this.proxy?.setAttribute("type", next);
        this.validate();
    }

    /**
     * Allows associating a {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist | datalist} to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.
     * @public
     * @remarks
     * HTML Attribute: list
     */
    @attr
    public list: string;
    protected listChanged(prev: string | undefined, next: string): void {
        this.proxy?.setAttribute("list", next);
        this.validate();
    }

    /**
     * The maximum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: maxlength
     */
    @attr({ converter: nullableNumberConverter })
    public maxlength: number | null;
    protected maxlengthChanged(
        prev: number | null | undefined,
        next: number | null
    ): void {
        if (typeof next === "number") {
            this.proxy?.setAttribute("maxlength", next.toString());
        } else {
            this.proxy?.removeAttribute("maxlength");
        }

        this.validate();
    }

    /**
     * The minimum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: minlength
     */
    @attr({ converter: nullableNumberConverter })
    public minlength: number | null;
    protected minlengthChanged(
        prev: number | null | undefined,
        next: number | null
    ): void {
        if (typeof next === "number") {
            this.proxy?.setAttribute("minlength", next.toString());
        } else {
            this.proxy?.removeAttribute("minlength");
        }

        this.validate();
    }

    /**
     * A regular expression that the value must match to pass validation.
     * @public
     * @remarks
     * HTMLAttribute: pattern
     */
    @attr
    public pattern: string;
    protected patternChanged(prev: string | undefined, next: string): void {
        this.proxy?.setAttribute("pattern", next);
        this.validate();
    }

    /**
     * Sets the width of the element to a specified number of characters.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    @attr({ converter: nullableNumberConverter })
    public size: number | null;
    protected sizeChanged(prev: number | null | undefined, next: number | null): void {
        if (typeof next === "number") {
            this.proxy?.setAttribute("size", next.toString());
        } else {
            this.proxy?.removeAttribute("size");
        }
    }

    /**
     * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    @attr({ mode: "boolean" })
    public spellcheck: boolean;
    protected spellcheckChanged(prev: boolean | undefined, next: boolean): void {
        this.proxy?.toggleAttribute("spellcheck", next);
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * A reference to the internal input element
     * @internal
     */
    public control: HTMLInputElement;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", this.type);
        this.validate();

        if (this.autofocus) {
            Updates.enqueue(() => {
                this.focus();
            });
        }
    }

    /**
     * Selects all the text in the text field
     *
     * @public
     */
    public select(): void {
        this.control.select();

        /**
         * The select event does not permeate the shadow DOM boundary.
         * This fn effectively proxies the select event,
         * emitting a `select` event whenever the internal
         * control emits a `select` event
         */
        this.$emit("select");
    }

    /**
     * Handles the internal control's `input` event
     * @internal
     */
    public handleTextInput(): void {
        this.value = this.control.value;
    }

    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    public handleChange(): void {
        this.$emit("change");
    }

    /** {@inheritDoc (FormAssociated:interface).validate} */
    public validate(): void {
        super.validate(this.control);
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA textbox role
 *
 * @public
 */
export class DelegatesARIATextbox {}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface DelegatesARIATextbox extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIATextbox, ARIAGlobalStatesAndProperties);

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTTextField extends StartEnd, DelegatesARIATextbox {}
applyMixins(FASTTextField, StartEnd, DelegatesARIATextbox);
