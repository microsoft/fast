import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _Radio extends FoundationElement {}
interface _Radio extends FormAssociated {}
declare const FormAssociatedRadio_base: typeof _Radio;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Radio:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedRadio extends FormAssociatedRadio_base {
    proxy: HTMLInputElement;
}
export {};
