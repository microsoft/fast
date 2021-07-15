import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _Checkbox extends FoundationElement {}
interface _Checkbox extends FormAssociated {}
declare const FormAssociatedCheckbox_base: typeof _Checkbox;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedCheckbox extends FormAssociatedCheckbox_base {
    proxy: HTMLInputElement;
}
export {};
