import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/index";
import { keyCodeEnter } from "@microsoft/fast-web-utilities";

/**
 * Text field sub-types
 * @public
 */
export enum TextFieldType {
    /**
     * An email TextField
     */
    email = "email",

    /**
     * A password TextField
     */
    password = "password",

    /**
     * A telephone TextField
     */
    tel = "tel",

    /**
     * A text TextField
     */
    text = "text",

    /**
     * A URL TextField
     */
    url = "url",
}

/**
 * An Text Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text | <input type="text" /> element }.
 *
 * @public
 */
export class TextField extends FormAssociated<HTMLInputElement> {
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
     * Sets the width of the element to a specified number of characters.
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

    private valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    /**
     * @internal
     */
    public control: HTMLInputElement;

    private focusValue: string;

    protected proxy = document.createElement("input");

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", this.type);

        if (this.autofocus) {
            this.focus();
        }

        this.setFormValue(this.value, this.value);
    }

    /**
     * @internal
     */
    public handleTextInput(): void {
        if (this.control && this.control.value) {
            this.value = this.control.value;
        }
        this.$emit("input", this.value);
    }

    public handleKeyDown = (e: KeyboardEvent): boolean => {
        if (e.keyCode === keyCodeEnter && this.focusValue !== this.value) {
            this.focusValue = this.value;
            this.$emit("change", this.value);
            return false;
        }
        return true;
    };

    public handleBlur = (e: FocusEvent): void => {
        if (this.focusValue !== this.value) {
            this.$emit("change", this.value);
        }
    };

    public handleFocus = (e: FocusEvent): void => {
        this.focusValue = this.value;
    };
}

/**
 * Includes ARIA states and properties relating to the ARIA link role
 *
 * @public
 */
/* eslint-disable-next-line */
export class DelegatesARIATextbox extends ARIAGlobalStatesAndProperties {}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface TextField extends StartEnd, DelegatesARIATextbox {}
applyMixins(TextField, StartEnd, DelegatesARIATextbox);
