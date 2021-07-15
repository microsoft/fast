import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _TextField extends FoundationElement {}
interface _TextField extends FormAssociated {}
declare const FormAssociatedTextField_base: typeof _TextField;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedTextField extends FormAssociatedTextField_base {
    proxy: HTMLInputElement;
}
export {};
