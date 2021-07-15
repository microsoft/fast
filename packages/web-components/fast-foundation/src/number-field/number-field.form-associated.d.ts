import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _NumberField extends FoundationElement {}
interface _NumberField extends FormAssociated {}
declare const FormAssociatedNumberField_base: typeof _NumberField;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(NumberField:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedNumberField extends FormAssociatedNumberField_base {
    proxy: HTMLInputElement;
}
export {};
