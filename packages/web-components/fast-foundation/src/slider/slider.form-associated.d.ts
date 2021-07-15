import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
declare class _Slider extends FoundationElement {}
interface _Slider extends FormAssociated {}
declare const FormAssociatedSlider_base: typeof _Slider;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Slider:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedSlider extends FormAssociatedSlider_base {
    proxy: HTMLInputElement;
}
export {};
