import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _Button extends FoundationElement {}
interface _Button extends FormAssociated {}
declare const FormAssociatedButton_base: typeof _Button;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Button:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedButton extends FormAssociatedButton_base {
    proxy: HTMLInputElement;
}
export {};
