import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _TextArea extends FoundationElement {}
interface _TextArea extends FormAssociated {}
declare const FormAssociatedTextArea_base: typeof _TextArea;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(TextArea:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedTextArea extends FormAssociatedTextArea_base {
    proxy: HTMLTextAreaElement;
}
export {};
