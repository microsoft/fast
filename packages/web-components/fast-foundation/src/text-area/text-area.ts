import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { DelegatesARIATextbox } from "../text-field/index";
import { applyMixins } from "../utilities";
import { FormAssociatedTextArea } from "./text-area.form-associated";
import { TextAreaResize } from "./text-area.options";

export { TextAreaResize };

/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | <textarea> element }.
 *
 * @public
 */
export class TextArea extends FormAssociatedTextArea {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    /**
     * The resize mode of the element.
     * @public
     * @remarks
     * HTML Attribute: resize
     */
    @attr
    public resize: TextAreaResize = TextAreaResize.none;

    /**
     * A reference to the internal textarea element
     * @internal
     */
    public control: HTMLTextAreaElement;

    /**
     * Indicates that this element should get focus after the page finishes loading.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    @attr({ mode: "boolean" })
    public autofocus: boolean;
    private autofocusChanged(): void {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.autofocus = this.autofocus;
        }
    }

    /**
     * The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id | id} of the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form | form} the element is associated to
     * @public
     */
    @attr({ attribute: "form" })
    public formId: string;

    /**
     * Allows associating a {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist | datalist} to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.
     * @public
     * @remarks
     * HTML Attribute: list
     */
    @attr
    public list: string;
    private listChanged(): void {
        if (this.proxy instanceof HTMLTextAreaElement) {
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
        if (this.proxy instanceof HTMLTextAreaElement) {
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
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.minLength = this.minlength;
        }
    }

    /**
     * The name of the element.
     * @public
     * @remarks
     * HTML Attribute: name
     */
    @attr
    public name: string;

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    @attr
    public placeholder: string;

    /**
     * Sizes the element horizontally by a number of character columns.
     *
     * @public
     * @remarks
     * HTML Attribute: cols
     */
    @attr({ converter: nullableNumberConverter, mode: "fromView" })
    public cols: number = 20;

    /**
     * Sizes the element vertically by a number of character rows.
     *
     * @public
     * @remarks
     * HTML Attribute: rows
     */
    @attr({ converter: nullableNumberConverter, mode: "fromView" })
    public rows: number;

    /**
     * Sets if the element is eligible for spell checking
     * but the UA.
     * @public
     * @remarks
     * HTML Attribute: spellcheck
     */
    @attr({ mode: "boolean" })
    public spellcheck: boolean;
    private spellcheckChanged(): void {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * @internal
     */
    public handleTextInput = (): void => {
        this.value = this.control.value;
    };

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
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface TextArea extends DelegatesARIATextbox {}
applyMixins(TextArea, DelegatesARIATextbox);
