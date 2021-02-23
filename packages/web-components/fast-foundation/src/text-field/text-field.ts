import { attr, DOM, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/index";
import { FormAssociatedTextField } from "./text-field.form-associated";
import { TextFieldType } from "./text-field.options";

export { TextFieldType };

/**
 * A Text Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text | <input type="text" /> element }.
 *
 * @public
 */
export class TextField extends FormAssociatedTextField {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
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
    private autofocusChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.autofocus = this.autofocus;
            this.validate();
        }
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
    private placeholderChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.placeholder = this.placeholder;
        }
    }

    /**
     * Allows setting a type or mode of text.
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr
    public type: TextFieldType = TextFieldType.text;
    private typeChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.type = this.type;
            this.validate();
        }
    }

    /**
     * Allows associating a {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist | datalist} to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.
     * @public
     * @remarks
     * HTML Attribute: list
     */
    @attr
    public list: string;
    private listChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.setAttribute("list", this.list);
            this.validate();
        }
    }

    /**
     * The maximum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: maxlength
     */
    @attr({ converter: nullableNumberConverter })
    public maxlength: number;
    private maxlengthChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.maxLength = this.maxlength;
            this.validate();
        }
    }

    /**
     * The minimum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: minlength
     */
    @attr({ converter: nullableNumberConverter })
    public minlength: number;
    private minlengthChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.minLength = this.minlength;
            this.validate();
        }
    }

    /**
     * A regular expression that the value must match to pass validation.
     * @public
     * @remarks
     * HTMLAttribute: pattern
     */
    @attr
    public pattern: string;
    private patternChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.pattern = this.pattern;
            this.validate();
        }
    }

    /**
     * Sets the width of the element to a specified number of characters.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    @attr({ converter: nullableNumberConverter })
    public size: number;
    private sizeChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.size = this.size;
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
    private spellcheckChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
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
            DOM.queueUpdate(() => {
                this.focus();
            });
        }
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
export interface TextField extends StartEnd, DelegatesARIATextbox {}
applyMixins(TextField, StartEnd, DelegatesARIATextbox);
