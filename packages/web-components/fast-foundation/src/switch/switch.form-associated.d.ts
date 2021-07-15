import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _Switch extends FoundationElement {}
interface _Switch extends FormAssociated {}
declare const FormAssociatedSwitch_base: typeof _Switch;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Switch:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedSwitch extends FormAssociatedSwitch_base {
    proxy: HTMLInputElement;
}
export {};
