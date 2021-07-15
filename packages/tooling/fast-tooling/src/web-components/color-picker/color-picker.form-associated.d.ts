import { FormAssociated, FoundationElement } from "@microsoft/fast-foundation";
declare class _ColorPicker extends FoundationElement {}
interface _ColorPicker extends FormAssociated {}
declare const FormAssociatedColorPicker_base: typeof _ColorPicker;
/**
 * A form-associated base class for the {@link @microsoft/fast-tooling#(ColorPicker:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedColorPicker extends FormAssociatedColorPicker_base {
    proxy: HTMLInputElement;
}
export {};
